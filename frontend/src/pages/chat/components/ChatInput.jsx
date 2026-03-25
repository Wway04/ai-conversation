import { useState, useRef, useEffect } from 'react';
import { Plus, Send, X, FileText, Image as ImgIcon, Loader2 } from 'lucide-react';
import { formatFileSize } from '@/utils/Number';

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSend = async () => {
    const trimmed = value.trim();
    if ((!trimmed && files.length === 0) || disabled || sending) return;
    setSending(true);
    try {
      await onSend(trimmed, files);
      setValue('');
      setFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const canSend = (value.trim().length > 0 || files.length > 0) && !sending && !disabled;

  return (
    <div className="border-t border-border/60 bg-card/80 backdrop-blur-sm px-4 py-3 w-full">
      <div className="max-w-3xl mx-auto space-y-2">

        {/* File previews */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/60 bg-muted/50 text-xs max-w-[200px]"
              >
                {f.type.startsWith('image/') ? (
                  <ImgIcon className="size-3 text-slate-400 flex-shrink-0" />
                ) : (
                  <FileText className="size-3 text-slate-400 flex-shrink-0" />
                )}
                <span className="truncate flex-1 text-foreground/80">{f.name}</span>
                <span className="text-muted-foreground flex-shrink-0">{formatFileSize(f.size)}</span>
                <button
                  onClick={() => removeFile(i)}
                  className="flex-shrink-0 size-3.5 rounded-full bg-muted-foreground/20 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                >
                  <X className="size-2" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          className={`relative flex items-end gap-2 rounded-2xl border bg-background transition-all duration-300 ${
            isFocused
              ? 'border-slate-500/40 shadow-lg shadow-primary/5 ring-2 ring-slate-500/10'
              : 'border-border/80 shadow-sm'
          }`}
        >
          {/* + Attach button */}
          <div className="pl-3 pb-2.5 flex-shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={sending || disabled}
              title="Attach files"
              className="size-8 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="size-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="*/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything… (Shift+Enter for new line)"
            disabled={sending || disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent py-3.5 text-sm focus:outline-none disabled:opacity-50 placeholder:text-muted-foreground/50 leading-relaxed min-h-[46px]"
          />

          {/* Generate Free button */}
          <div className="pr-2.5 pb-2 flex-shrink-0">
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                canSend
                  ? 'text-white shadow-md shadow-slate-900/40 hover:shadow-lg hover:shadow-slate-900/50 hover:scale-[1.03] active:scale-[0.97]'
                  : 'bg-muted text-muted-foreground/40 cursor-not-allowed'
              }`}
              style={
                canSend
                  ? { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)' }
                  : undefined
              }
            >
              {sending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Generate Free</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] text-muted-foreground/40 font-medium">
          AI can make mistakes · Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export { ChatInput };
