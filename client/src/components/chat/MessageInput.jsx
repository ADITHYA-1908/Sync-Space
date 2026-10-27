import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bold,
  Italic,
  Link,
  Code,
  Paperclip,
  Smile,
  List,
} from 'lucide-react';

export const MessageInput = ({
  conversation,
  onSendMessage,
  onOpenInfoModal,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  // Focus textarea when conversation switches
  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversation?.id]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInsertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 0);
  };

  const placeholderText = conversation
    ? conversation.type === 'channel'
      ? `Message #${conversation.title}`
      : `Message ${conversation.title}`
    : 'Type a message...';

  const isMessageValid = content.trim().length > 0;

  return (
    <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800/80 shrink-0">
      <form
        onSubmit={handleSubmit}
        className="border border-slate-800 rounded-2xl bg-slate-900/90 shadow-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition overflow-hidden"
      >
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-slate-800/80 bg-slate-900/60 text-slate-400">
          <button
            type="button"
            onClick={() => handleInsertFormatting('**', '**')}
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleInsertFormatting('*', '*')}
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleInsertFormatting('`', '`')}
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Inline Code (`code`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleInsertFormatting('[Link](', ')')}
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Insert Link"
          >
            <Link className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleInsertFormatting('- ')}
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() =>
              onOpenInfoModal(
                'File Attachments',
                'Cloud file uploads (images, PDFs, documents) with AWS S3 / Cloudinary will be connected in Part 3.'
              )
            }
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Attach file (Part 3)"
          >
            <Paperclip className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenInfoModal(
                'Emoji Picker',
                'Custom team reactions and native emoji picker will be available in upcoming milestones.'
              )
            }
            className="p-1 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Insert emoji"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Input Area */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed max-h-40 custom-scrollbar"
            aria-label="Message composition field"
          />
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/40 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-2xs text-slate-500">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-3xs">
                Enter
              </kbd>{' '}
              to send,{' '}
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-3xs">
                Shift+Enter
              </kbd>{' '}
              for newline
            </span>
          </div>

          <button
            type="submit"
            disabled={!isMessageValid}
            className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition select-none cursor-pointer ${
              isMessageValid
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
            title={isMessageValid ? 'Send Message' : 'Type a message to send'}
            aria-label="Send message"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Honest Session Disclaimer */}
      <p className="text-3xs text-center text-slate-500 mt-2 select-none">
        SyncSpace Part 2: Messages are kept in local React state for layout testing. MongoDB persistence arrives in Part 3.
      </p>
    </div>
  );
};
