import { Bot, User, CheckCheck, FileText, Image as ImgIcon } from 'lucide-react';
import { formatFileSize } from '@/utils/Number';
import { formatMessageTime } from '@/utils/Date';

const FileAttachment = ({ file }) => {
  const isImage = file.mimeType?.startsWith('image/');
  const name = file.originalName || 'file';
  const url = file.url || null;

  if (isImage && url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1">
        <img
          src={url}
          alt={name}
          className="max-w-[220px] max-h-[160px] rounded-xl object-cover border border-border shadow-sm hover:opacity-90 transition-opacity"
        />
        <p className="text-[10px] mt-1 text-muted-foreground truncate max-w-[220px] px-1">{name}</p>
      </a>
    );
  }

  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors max-w-[240px] group"
    >
      <div className="size-8 rounded-lg bg-background flex items-center justify-center border border-border group-hover:border-primary/20 transition-colors">
        {isImage ? (
          <ImgIcon className="size-4 text-primary" />
        ) : (
          <FileText className="size-4 text-primary" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate text-foreground/90">{name}</span>
        {file.size && (
          <span className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</span>
        )}
      </div>
    </a>
  );
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 px-4">
        <div className="relative max-w-lg">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-500/5 via-slate-400/5 to-slate-500/5" />
          <div className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-500/10">
            <div className="size-5 rounded-full bg-gradient-to-br from-slate-500/20 to-slate-700/20 flex items-center justify-center flex-shrink-0">
              <Bot className="size-3 text-slate-400" />
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <SimpleMarkdown content={message.content} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 mb-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animation: 'chatFadeIn 0.3s ease-out' }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
            <User className="size-4 text-white" />
          </div>
        ) : (
          <div className="size-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-sm shadow-slate-900/30">
            <Bot className="size-4 text-white" />
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`flex flex-col max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}
      >
        {/* Sender label */}
        <div
          className={`text-[11px] font-semibold mb-1.5 uppercase tracking-wide ${
            isUser ? 'text-blue-500/70' : 'text-slate-400/70'
          }`}
        >
          {isUser ? 'You' : 'AI Assistant'}
        </div>

        {/* Files (outside bubble) */}
        {isUser && message.files?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 justify-end">
            {message.files.map((file) => (
              <FileAttachment key={file.id} file={file} />
            ))}
          </div>
        )}

        {/* Bubble (Text only or empty if none) */}
        {message.content && (
          <div
            className={`px-4 py-2 text-sm leading-relaxed ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[22px] shadow-sm shadow-blue-500/15'
                : 'bg-card border border-border/80 rounded-2xl rounded-tl-sm shadow-sm'
            }`}
            style={
              !isUser
                ? { background: 'linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 97%, #1e293b) 100%)' }
                : undefined
            }
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-table:text-sm">
                <SimpleMarkdown content={message.content} />
              </div>
            )}
          </div>
        )}

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-muted-foreground/50 font-medium">
            {formatMessageTime(message.createdAt)}
          </span>
          {isUser && (
            <CheckCheck className="size-3 text-blue-400/60" />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Simple markdown renderer — handles bold, headers, lists, tables, code, blockquotes
 * No external dependency needed
 */
const SimpleMarkdown = ({ content }) => {
  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inCodeBlock = false;
  let codeLines = [];
  let listItems = [];
  let listType = null; // 'ul' or 'ol'

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator
      elements.push(
        <div key={`table-${elements.length}`} className="my-3 overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40">
                {headerRow.map((cell, headerIndex) => (
                  <th key={headerIndex} className="text-left py-2 px-3 font-semibold text-foreground/80 border-b border-border/50">{renderInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-3">{renderInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      const cls = listType === 'ol' ? 'list-decimal' : 'list-disc';
      elements.push(
        <Tag key={`list-${elements.length}`} className={`${cls} pl-5 my-2 space-y-1`}>
          {listItems.map((item, itemIndex) => (
            <li key={itemIndex} className="text-sm leading-relaxed">{renderInline(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-gray-900 text-gray-100 rounded-xl p-3.5 my-3 text-xs overflow-x-auto border border-gray-700/30">
            <code className="font-mono">{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushTable();
        flushList();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    // Table row
    if (line.includes('|') && line.trim().startsWith('|')) {
      flushList();
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every(c => /^[\s-:]+$/.test(c))) {
        // separator row
        tableRows.push(cells);
        inTable = true;
        continue;
      }
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // List items
    const ulMatch = line.match(/^(\s*)[-*]\s+(.+)/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)/);
    if (ulMatch) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(ulMatch[2]);
      continue;
    }
    if (olMatch) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(olMatch[2]);
      continue;
    }
    if (listItems.length > 0 && line.trim() !== '') {
      flushList();
    }

    // Empty line
    if (line.trim() === '') {
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h-${elements.length}`} className="font-semibold text-sm mt-3.5 mb-1.5 text-foreground/90 flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-slate-500/50" />
          {renderInline(line.slice(4))}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h-${elements.length}`} className="font-bold text-[15px] mt-1 mb-2 text-foreground pb-1.5 border-b border-border/40">
          {renderInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${elements.length}`} className="border-l-3 border-slate-500/40 bg-slate-500/5 rounded-r-lg pl-3.5 pr-3 py-2 my-3 text-sm text-muted-foreground">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Normal paragraph
    flushList();
    elements.push(<p key={`p-${elements.length}`} className="text-sm my-1 leading-relaxed">{renderInline(line)}</p>);
  }

  flushTable();
  flushList();

  return <>{elements}</>;
};

/** Render inline markdown: **bold**, `code`, emoji */
function renderInline(text) {
  if (!text) return text;

  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find earliest match
    let earliest = null;
    let type = null;

    if (boldMatch && (!earliest || boldMatch.index < earliest.index)) {
      earliest = boldMatch;
      type = 'bold';
    }
    if (codeMatch && (!earliest || codeMatch.index < earliest.index)) {
      earliest = codeMatch;
      type = 'code';
    }

    if (!earliest) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    if (type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold text-foreground">{earliest[1]}</strong>);
    } else if (type === 'code') {
      parts.push(
        <code key={key++} className="bg-muted/80 text-foreground px-1.5 py-0.5 rounded-md text-xs font-mono border border-border/30">{earliest[1]}</code>
      );
    }

    remaining = remaining.slice(earliest.index + earliest[0].length);
  }

  return parts.length === 1 ? parts[0] : parts;
}

export { ChatMessage };
