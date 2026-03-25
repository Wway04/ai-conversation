import { PanelLeftClose, PanelLeft, Bot } from 'lucide-react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';

const ChatMain = ({
  sidebarOpen,
  setSidebarOpen,
  activeSession,
  messages,
  isTyping,
  onSend,
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border/60 bg-card/80 backdrop-blur-sm flex-shrink-0">
        <button
          onClick={() => setSidebarOpen((isCurrentlyOpen) => !isCurrentlyOpen)}
          className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeft className="size-4" />}
        </button>

        <div className="w-px h-5 bg-border/60" />

        <span className="text-sm font-semibold text-foreground truncate flex-1">
          {activeSession?.title || 'AI Chat'}
        </span>

        {/* Online badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15">
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <ChatMessageList messages={messages} isTyping={isTyping} />

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isTyping} />
    </div>
  );
};

export { ChatMain };
