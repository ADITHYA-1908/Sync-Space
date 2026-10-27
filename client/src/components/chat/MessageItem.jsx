import React, { useState } from 'react';
import { Smile, MessageSquare, Bookmark, MoreHorizontal } from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const MessageItem = ({ message, onReactionToggle, onOpenInfoModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Simple formatter to detect code backticks or bold text
  const renderFormattedContent = (content) => {
    return content.split('\n').map((line, idx) => {
      return (
        <span key={idx} className="block min-h-[1.25rem]">
          {line}
        </span>
      );
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex gap-3 px-4 sm:px-6 py-2.5 transition rounded-xl ${
        isHovered ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
      }`}
    >
      {/* Sender Avatar */}
      <div className="pt-0.5">
        <UserAvatar
          name={message.sender.name}
          status={message.sender.status || 'offline'}
          size="md"
          bgClass={message.sender.avatarBg || 'bg-indigo-600'}
        />
      </div>

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-xs sm:text-sm text-white hover:underline cursor-pointer">
            {message.sender.name}
          </span>

          {message.sender.role && (
            <span className="text-2xs px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-medium">
              {message.sender.role}
            </span>
          )}

          <span className="text-2xs text-slate-500 font-normal select-none">
            {message.timestamp}
          </span>
        </div>

        {/* Text Content */}
        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed break-words space-y-0.5">
          {renderFormattedContent(message.content)}
        </div>

        {/* Optional Emoji Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {message.reactions.map((reaction, i) => (
              <button
                key={i}
                onClick={() => onReactionToggle(message.id, reaction.emoji)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/60 text-xs text-slate-300 transition cursor-pointer select-none active:scale-95"
                title={`Reacted by: ${reaction.users?.join(', ') || 'team'}`}
              >
                <span>{reaction.emoji}</span>
                <span className="text-2xs font-semibold text-slate-400">{reaction.count}</span>
              </button>
            ))}

            <button
              onClick={() => onReactionToggle(message.id, '👍')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition cursor-pointer text-xs"
              title="Add reaction"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Hover Action Bar */}
      <div
        className={`absolute right-4 -top-3.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-lg px-1 py-0.5 flex items-center gap-0.5 z-10 transition-opacity duration-150 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => onReactionToggle(message.id, '❤️')}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="React with Love"
        >
          <Smile className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Threaded Replies',
              'Threaded conversations and side-panel replies will be powered by Socket.IO in Part 4.'
            )
          }
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="Reply in thread"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Bookmark Message',
              'Bookmarked and saved messages will be saved to your user profile in Part 3.'
            )
          }
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="Bookmark message"
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Message Options',
              'Copy link, edit message, or delete message options.'
            )
          }
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="More actions"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
