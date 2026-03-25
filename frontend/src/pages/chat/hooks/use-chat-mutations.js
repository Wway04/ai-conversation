import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as chatApi from '../api/chat.api';
import { chatKeys } from './chat.keys';

export const useChatMutations = (activeSessionId, { setActiveSessionId, setIsTyping }) => {
  const queryClient = useQueryClient();

  // ── New chat ────────────────────────────────────────
  const createSessionMutation = useMutation({
    mutationFn: (title) => chatApi.createSession(title),
    onSuccess: (newSession) => {
      queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) => [newSession, ...existingSessions]);
      setActiveSessionId(newSession.id);
    },
    onError: () => toast.error('Could not create new chat'),
  });

  const handleNewChat = () => createSessionMutation.mutate('New Chat');

  // ── Send message ────────────────────────────────────
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, content, files }) =>
      chatApi.sendMessage(sessionId, content, files),

    onMutate: async ({ sessionId, content, files }) => {
      const tempMessageId = `temp-${Date.now()}`;
      const optimisticUserMessage = {
        id: tempMessageId,
        sessionId,
        role: 'user',
        content,
        files: files.map((file, fileIndex) => ({
          id: `temp-file-${fileIndex}`,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
        })),
        createdAt: new Date().toISOString(),
      };
      // Optimistic insert
      queryClient.setQueryData(chatKeys.session(sessionId), (cachedSession) => {
        const messages = [...(cachedSession?.messages ?? []), optimisticUserMessage];
        if (cachedSession) return { ...cachedSession, messages };
        return { id: sessionId, messages };
      });
      setIsTyping(true);
      return { tempMessageId, sessionId };
    },

    onSuccess: (sendMessageResponse, _unusedVariables, mutationContext) => {
      queryClient.setQueryData(chatKeys.session(mutationContext.sessionId), (cachedSession) => {
        if (!cachedSession) return cachedSession;
        const filteredMessages = (cachedSession.messages ?? []).filter(
          (message) => message.id !== mutationContext.tempMessageId && message.id !== sendMessageResponse.userMessage.id
        );
        return {
          ...cachedSession,
          messages: [
            ...filteredMessages,
            sendMessageResponse.userMessage,
            sendMessageResponse.assistantMessage,
          ],
        };
      });
      // Bubble updated session to top of list
      queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) =>
        [...existingSessions.map((session) =>
          session.id === mutationContext.sessionId
            ? { ...session, updatedAt: new Date().toISOString() }
            : session,
        )].sort((sessionA, sessionB) => {
          if (sessionA.isPinned && !sessionB.isPinned) return -1;
          if (!sessionA.isPinned && sessionB.isPinned) return 1;
          return new Date(sessionB.updatedAt).getTime() - new Date(sessionA.updatedAt).getTime();
        }),
      );
    },

    onError: (error, _unusedVariables, mutationContext) => {
      if (mutationContext?.tempMessageId) {
        queryClient.setQueryData(chatKeys.session(mutationContext.sessionId), (cachedSession) =>
          cachedSession
            ? { ...cachedSession, messages: cachedSession.messages.filter((message) => message.id !== mutationContext.tempMessageId) }
            : cachedSession,
        );
      }
      toast.error(error?.message || 'Failed to send message');
    },

    onSettled: () => setIsTyping(false),
  });

  const handleSend = async (content, files = []) => {
    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const sessionTitle = content.slice(0, 60) || 'New Chat';
        const newSession   = await chatApi.createSession(sessionTitle);
        queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) => [newSession, ...existingSessions]);
        setActiveSessionId(newSession.id);
        sessionId = newSession.id;
      } catch {
        toast.error('Could not start a chat session');
        return;
      }
    }
    sendMessageMutation.mutate({ sessionId, content, files });
  };

  // ── Rename session ──────────────────────────────────
  const renameSessionMutation = useMutation({
    mutationFn: ({ sessionId, newTitle }) => chatApi.renameSession(sessionId, newTitle),

    onMutate: async ({ sessionId, newTitle }) => {
      const sessionListSnapshot = queryClient.getQueryData(chatKeys.sessions());
      queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) =>
        existingSessions.map((session) =>
          session.id === sessionId ? { ...session, title: newTitle } : session,
        ),
      );
      return { sessionListSnapshot };
    },

    onSuccess: (_unusedData, { newTitle }) =>
      toast.success('Conversation renamed successfully', {
        description: `"${newTitle}"`,
        duration: 3000,
      }),

    onError: (_unusedError, _unusedVariables, mutationContext) => {
      if (mutationContext?.sessionListSnapshot) {
        queryClient.setQueryData(chatKeys.sessions(), mutationContext.sessionListSnapshot);
      }
      toast.error('Failed to rename conversation', {
        description: 'Please try again.',
        duration: 3000,
      });
    },
  });

  const handleRename = (sessionId, newTitle) =>
    renameSessionMutation.mutate({ sessionId, newTitle });

  // ── Delete session ──────────────────────────────────
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId) => chatApi.deleteSession(sessionId),

    onSuccess: (_unusedData, deletedSessionId) => {
      queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) =>
        existingSessions.filter((session) => session.id !== deletedSessionId),
      );
      queryClient.removeQueries({ queryKey: chatKeys.session(deletedSessionId) });

      if (activeSessionId === deletedSessionId) {
        const remainingSessions = queryClient.getQueryData(chatKeys.sessions()) ?? [];
        setActiveSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
      }

      toast.success('Conversation deleted', {
        description: 'The chat has been permanently removed.',
        duration: 1000,
      });
    },

    onError: () =>
      toast.error('Failed to delete conversation', {
        description: 'Please try again.',
        duration: 1000,
      }),
  });

  const handleDelete = (sessionId) => deleteSessionMutation.mutate(sessionId);

  // ── Pin session ────────────────────────────────────
  const togglePinMutation = useMutation({
    mutationFn: (sessionId) => chatApi.togglePinSession(sessionId),
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(chatKeys.sessions(), (existingSessions = []) =>
        existingSessions
          .map((session) => (session.id === updatedSession.id ? updatedSession : session))
          .sort((sessionA, sessionB) => {
            if (sessionA.isPinned && !sessionB.isPinned) return -1;
            if (!sessionA.isPinned && sessionB.isPinned) return 1;
            return new Date(sessionB.updatedAt).getTime() - new Date(sessionA.updatedAt).getTime();
          }),
      );
    },
    onError: () => toast.error('Failed to update pinned status'),
  });

  const handleTogglePin = (sessionId) => togglePinMutation.mutate(sessionId);

  return {
    handleNewChat,
    handleSend,
    handleRename,
    handleDelete,
    handleTogglePin,
  };
};
