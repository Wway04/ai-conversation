import { useState } from 'react';
import { useChatQueries } from './use-chat-queries';
import { useChatMutations } from './use-chat-mutations';

export const useChat = () => {
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // ── Queries ─────────────────────────────────────────
  const {
    sessions,
    activeSession,
    messages,
    loading,
  } = useChatQueries(activeSessionId, (sessionList) => {
    if (sessionList.length > 0 && !activeSessionId) {
      setActiveSessionId(sessionList[0].id);
    }
  });

  // ── Mutations ───────────────────────────────────────
  const {
    handleNewChat,
    handleSend,
    handleRename,
    handleDelete,
    handleTogglePin,
  } = useChatMutations(activeSessionId, { setActiveSessionId, setIsTyping });

  // ── Actions ─────────────────────────────────────────
  const handleSelectSession = (sessionId) => setActiveSessionId(sessionId);

  return {
    sessions,
    activeSession,
    activeSessionId,
    messages,
    loading,
    isTyping,
    handleSelectSession,
    handleNewChat,
    handleSend,
    handleRename,
    handleDelete,
    handleTogglePin,
  };
};
