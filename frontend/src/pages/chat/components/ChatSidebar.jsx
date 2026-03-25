import { ChatSessionList } from './ChatSessionList';

const ChatSidebar = ({
  open,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRename,
  onDelete,
  onTogglePin,
}) => {
  return (
    <div
      className={`flex-shrink-0 border-r border-border/60 bg-card/50 flex flex-col transition-all duration-300 ${
        open ? 'w-72' : 'w-0 border-r-0 overflow-hidden'
      }`}
    >
      <ChatSessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession}
        onNewChat={onNewChat}
        onRename={onRename}
        onDelete={onDelete}
        onTogglePin={onTogglePin}
      />
    </div>
  );
};

export { ChatSidebar };
