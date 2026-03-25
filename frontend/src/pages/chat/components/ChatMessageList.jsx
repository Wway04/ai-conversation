import { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { Bot, Sparkles, ShieldCheck, TrendingUp, MessageCircle } from 'lucide-react';

const ChatMessageList = ({ messages, isTyping }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Smooth scroll to bottom whenever messages change or typing starts
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          {/* Animated AI avatar */}
          <div className="relative mx-auto mb-6 w-fit">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/30">
              <Bot className="size-10 text-white" />
            </div>
            {/* Decorative pulse ring */}
            <div className="absolute -inset-2 rounded-3xl border-2 border-slate-500/20 animate-pulse" />
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
              <div className="size-2 rounded-full bg-white" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            AI Chat Assistant
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Ask me anything — I can help you write, explain, summarize,
            brainstorm, debug code, and much more.
          </p>

          {/* Capability cards */}
          <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
            <CapabilityCard
              icon={ShieldCheck}
              title="Explain concepts"
              color="text-red-500"
              bgColor="bg-red-500/10"
            />
            <CapabilityCard
              icon={TrendingUp}
              title="Write content"
              color="text-emerald-500"
              bgColor="bg-emerald-500/10"
            />
            <CapabilityCard
              icon={Sparkles}
              title="Debug code"
              color="text-slate-400"
              bgColor="bg-slate-500/10"
            />
            <CapabilityCard
              icon={MessageCircle}
              title="Brainstorm ideas"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
          </div>

          <p className="text-xs text-muted-foreground/50 mt-6">
            Start by asking a question below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto py-6 scroll-smooth"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--primary) 1%, transparent) 0%, transparent 50%)',
      }}
    >
      <div className="max-w-3xl mx-auto px-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  );
};

const CapabilityCard = ({ icon: Icon, title, color, bgColor }) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border/60 bg-card/50 hover:bg-muted/30 transition-colors">
    <div className={`size-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`size-4 ${color}`} />
    </div>
    <span className="text-xs font-medium text-foreground/80">{title}</span>
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-3 mb-5" style={{ animation: 'chatFadeIn 0.3s ease-out' }}>
    {/* Avatar */}
    <div className="flex-shrink-0 mt-1">
      <div className="size-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm shadow-slate-900/30">
        <Bot className="size-4 text-white" />
      </div>
    </div>

    <div className="flex flex-col items-start">
      <div className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide text-slate-400/70">
        AI Assistant
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-5 py-3.5 border border-border/80 shadow-sm"
        style={{ background: 'linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 97%, #1e293b) 100%)' }}
      >
        <div className="flex items-center gap-3">
          {/* Animated dots */}
          <div className="flex gap-1.5">
            <span
              className="size-2 rounded-full bg-slate-400/60"
              style={{ animation: 'typingBounce 1.4s ease-in-out infinite' }}
            />
            <span
              className="size-2 rounded-full bg-slate-400/60"
              style={{ animation: 'typingBounce 1.4s ease-in-out 0.2s infinite' }}
            />
            <span
              className="size-2 rounded-full bg-slate-400/60"
              style={{ animation: 'typingBounce 1.4s ease-in-out 0.4s infinite' }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            AI is thinking…
          </span>
        </div>
      </div>
    </div>

    {/* Inline style tag for animations */}
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-6px); opacity: 1; }
      }
      @keyframes chatFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
);

export { ChatMessageList };
