import { MessageSquarePlus, MessageSquare, Search, Sparkles, Pencil, Trash2, Check, X, Pin, PinOff } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getDateGroupLabel, formatRelativeTime } from '@/utils/Date';

const ChatSessionList = ({ sessions, activeSessionId, onSelectSession, onNewChat, onRename, onDelete, onTogglePin }) => {
  const [searchQuery, setSearchQuery]   = useState('');
  const [editingId,   setEditingId]     = useState(null);
  const [editValue,   setEditValue]     = useState('');
  const [deletingId,  setDeletingId]    = useState(null);
  const inputRef = useRef(null);

  // Auto-focus rename input
  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, searchQuery]);

  const groupedSessions = useMemo(() => {
    const groups = {};
    const pinned = filteredSessions.filter(s => s.isPinned);
    const unpinned = filteredSessions.filter(s => !s.isPinned);

    if (pinned.length > 0) groups['Pinned'] = pinned;

    unpinned.forEach((session) => {
      const label = getDateGroupLabel(session.lastMessageAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(session);
    });
    return groups;
  }, [filteredSessions]);

  const startEdit = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.title);
    setDeletingId(null);
  };

  const confirmEdit = (e) => {
    e?.stopPropagation();
    if (editValue.trim() && editValue.trim() !== sessions.find(s => s.id === editingId)?.title) {
      onRename?.(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setEditingId(null);
  };

  const startDelete = (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    setEditingId(null);
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    onDelete?.(id);
    setDeletingId(null);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 space-y-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)' }}
        >
          <MessageSquarePlus className="size-4" />
          <span>New Chat</span>
        </button>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-slate-500/30 focus:border-slate-500/40 transition-all"
          />
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredSessions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="size-5 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              {searchQuery ? 'No results' : 'No conversations yet'}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {searchQuery ? 'Try a different keyword' : 'Start by creating a new chat'}
            </p>
          </div>
        ) : (
          <div className="px-2 pb-2">
            {Object.entries(groupedSessions).map(([label, groupSessions]) => (
              <div key={label}>
                <div className="px-2 pt-3 pb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                    {label}
                  </span>
                </div>

                {groupSessions.map((session) => {
                  const isActive   = activeSessionId === session.id;
                  const isEditing  = editingId  === session.id;
                  const isDeleting = deletingId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => !isEditing && !isDeleting && onSelectSession(session.id)}
                      className={`group relative w-full text-left px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 cursor-pointer select-none ${
                        isActive ? 'bg-slate-500/10 shadow-sm' : 'hover:bg-muted/60'
                      } ${isDeleting ? 'ring-1 ring-destructive/40 bg-destructive/5' : ''}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Icon */}
                        <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isActive ? 'bg-slate-500/15 text-foreground' : 'bg-muted/80 text-muted-foreground'
                        }`}>
                          <MessageSquare className="size-3.5" />
                        </div>

                        {/* Title / Rename input / Delete confirm */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            /* ── Rename mode ── */
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') confirmEdit();
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                className="flex-1 min-w-0 text-[13px] bg-background border border-slate-500/40 rounded-md px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-500/40"
                              />
                              <button onClick={confirmEdit} className="size-6 rounded-md flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                                <Check className="size-3.5" />
                              </button>
                              <button onClick={cancelEdit} className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                                <X className="size-3.5" />
                              </button>
                            </div>
                          ) : isDeleting ? (
                            /* ── Delete confirm ── */
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <p className="flex-1 text-[12px] text-destructive font-medium truncate">Delete this chat?</p>
                              <button onClick={(e) => confirmDelete(e, session.id)} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-destructive text-white hover:bg-destructive/80 transition-colors">
                                Yes
                              </button>
                              <button onClick={cancelDelete} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors">
                                No
                              </button>
                            </div>
                          ) : (
                            /* ── Normal mode ── */
                            <>
                              <p className="text-[13px] font-medium truncate leading-tight text-foreground">
                                {session.title}
                              </p>
                              <span className="text-[10px] text-muted-foreground/50">
                                {formatRelativeTime(session.lastMessageAt)}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Action buttons — show on hover / active, hide when editing/deleting */}
                        {!isEditing && !isDeleting && (
                          <div className={`flex items-center gap-0.5 flex-shrink-0 transition-opacity ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <button
                              onClick={(e) => { e.stopPropagation(); onTogglePin?.(session.id); }}
                              title={session.isPinned ? "Unpin" : "Pin"}
                              className={`size-6 rounded-md flex items-center justify-center transition-colors ${
                                session.isPinned ? 'text-blue-500 hover:bg-blue-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              {session.isPinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                            </button>
                            <button
                              onClick={(e) => startEdit(e, session)}
                              title="Rename"
                              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                              <Pencil className="size-3" />
                            </button>
                            <button
                              onClick={(e) => startDelete(e, session.id)}
                              title="Delete"
                              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="size-3 text-slate-400/60" />
          <p className="text-[10px] text-muted-foreground/60 font-medium">AI Chat v1.0</p>
        </div>
      </div>
    </div>
  );
};

export { ChatSessionList };
