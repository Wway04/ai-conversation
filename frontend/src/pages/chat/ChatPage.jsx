import { useState } from 'react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMain } from './components/ChatMain';
import { ChatLoading } from './components/ChatLoading';
import { useChat } from './hooks/use-chat';

const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
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
  } = useChat();

  const mappedSessions = sessions.map((session) => ({
    id: session.id,
    title: session.title || 'Untitled Chat',
    lastMessageAt: session.updatedAt || session.createdAt,
    isPinned: !!session.isPinned,
  }));

  if (loading) {
    return <ChatLoading />;
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      <ChatSidebar
        open={sidebarOpen}
        sessions={mappedSessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onRename={handleRename}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />

      <ChatMain
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSession={activeSession}
        messages={messages}
        isTyping={isTyping}
        onSend={handleSend}
      />
    </div>
  );
};

export { ChatPage };
