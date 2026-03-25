import { useQuery } from '@tanstack/react-query';
import * as chatApi from '../api/chat.api';
import { chatKeys } from './chat.keys';

export const useChatQueries = (activeSessionId, onSessionsLoaded) => {
  // ── Fetch all sessions ──────────────────────────────
  const { data: sessions = [], isLoading: loading } = useQuery({
    queryKey: chatKeys.sessions(),
    queryFn:  chatApi.getSessions,
    onSuccess: (sessionList) => {
      if (onSessionsLoaded) onSessionsLoaded(sessionList);
    },
  });

  // ── Fetch messages for active session ───────────────
  const { data: activeSessionData } = useQuery({
    queryKey: chatKeys.session(activeSessionId),
    queryFn:  () => chatApi.getSessionById(activeSessionId),
    enabled:  !!activeSessionId,
  });

  const messages      = activeSessionData?.messages ?? [];
  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? null;

  return {
    sessions,
    activeSession,
    messages,
    loading,
  };
};
