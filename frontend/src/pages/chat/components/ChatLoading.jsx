import { Bot } from 'lucide-react';

const ChatLoading = ({ message = "Loading conversation…" }) => {
  return (
    <div className="h-svh w-full flex flex-col items-center justify-center bg-background gap-4">
      <div className="relative">
        <Bot className="size-12 text-foreground animate-bounce" />
      </div>
      <span className="text-muted-foreground text-lg font-medium animate-pulse">{message}</span>
    </div>
  );
};

export { ChatLoading };
