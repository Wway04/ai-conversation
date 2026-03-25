import { Skeleton } from '@/components/ui/skeleton';

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className="p-3 space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        {/* Search */}
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-hidden px-2 pb-2">
        {/* Date group label */}
        <div className="px-2 pt-3 pb-1.5">
          <Skeleton className="h-2.5 w-14" />
        </div>

        {/* 5 session items */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="w-full px-3 py-2.5 rounded-xl mb-0.5"
          >
            <div className="flex items-start gap-2.5">
              {/* Session icon */}
              <Skeleton className="mt-0.5 size-8 rounded-lg shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                {/* Title */}
                <Skeleton className="h-3.5 w-32" />
                {/* Order badge (on some) */}
                {i < 2 && <Skeleton className="h-4 w-20 rounded-md" />}
                {/* Last message */}
                <Skeleton className="h-3 w-full" />
                {/* Timestamp */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-2.5 w-14" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <Skeleton className="h-3 w-36 mx-auto" />
      </div>
    </div>
  );
}

function MessageBubbleSkeleton({ isUser = false }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <Skeleton className={`size-8 rounded-xl shrink-0 ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
      {/* Message content */}
      <div className={`max-w-[70%] space-y-2 ${isUser ? 'items-end' : ''}`}>
        <div
          className={`rounded-2xl p-4 space-y-2 ${
            isUser
              ? 'bg-primary/5 rounded-tr-sm'
              : 'bg-muted/50 rounded-tl-sm'
          }`}
        >
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          {!isUser && <Skeleton className="h-4 w-3/4" />}
        </div>
        <Skeleton className={`h-2.5 w-16 ${isUser ? 'ml-auto' : ''}`} />
      </div>
    </div>
  );
}

function ChatInputSkeleton() {
  return (
    <div className="p-3 border-t border-border/60 bg-card/80">
      <div className="flex items-end gap-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="size-10 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div
      className="card overflow-hidden border border-border/60 shadow-sm"
      style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
    >
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="border-r border-border/60 flex-shrink-0 bg-card/50 hidden lg:flex flex-col w-80">
          <SidebarSkeleton />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60 bg-card/80">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="w-px h-5" />
            <Skeleton className="size-9 rounded-xl" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-hidden p-4 space-y-6">
            <MessageBubbleSkeleton isUser={false} />
            <MessageBubbleSkeleton isUser={true} />
            <MessageBubbleSkeleton isUser={false} />
          </div>

          {/* Input area */}
          <ChatInputSkeleton />
        </div>
      </div>
    </div>
  );
}
