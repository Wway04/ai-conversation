import {
  Sparkles,
  ShieldAlert,
  Lightbulb,
  TrendingUp,
  UserSearch,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  risk: {
    icon: ShieldAlert,
    color: 'text-red-500',
    bgHover: 'hover:bg-red-500/5 hover:border-red-500/25 hover:text-red-600',
    dotColor: 'bg-red-400',
  },
  recommendation: {
    icon: Lightbulb,
    color: 'text-amber-500',
    bgHover: 'hover:bg-amber-500/5 hover:border-amber-500/25 hover:text-amber-600',
    dotColor: 'bg-amber-400',
  },
  profit: {
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgHover: 'hover:bg-emerald-500/5 hover:border-emerald-500/25 hover:text-emerald-600',
    dotColor: 'bg-emerald-400',
  },
  buyer: {
    icon: UserSearch,
    color: 'text-blue-500',
    bgHover: 'hover:bg-blue-500/5 hover:border-blue-500/25 hover:text-blue-600',
    dotColor: 'bg-blue-400',
  },
};

const SuggestedQuestions = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="px-4 pb-3">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="size-5 rounded-md bg-slate-500/10 flex items-center justify-center">
            <Sparkles className="size-3 text-slate-400" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            Gợi ý câu hỏi
          </span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Question chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {questions.map((q, i) => {
            // Support both string and object format
            const text = typeof q === 'string' ? q : q.text;
            const category = typeof q === 'string' ? 'risk' : q.category;
            const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.risk;
            const Icon = config.icon;

            return (
              <button
                key={i}
                onClick={() => onSelect(text)}
                className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-[13px] font-medium border border-border/70 bg-card/50 transition-all duration-200 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] ${config.bgHover}`}
              >
                <div
                  className={`size-7 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-transparent ${config.color}`}
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="text-foreground/80 group-hover:text-foreground truncate">
                  {text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { SuggestedQuestions };
