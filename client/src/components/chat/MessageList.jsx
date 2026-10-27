import React, { useEffect, useRef } from 'react';
import { Hash, MessageSquare, Sparkles } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { UserAvatar } from '../common/UserAvatar';

export const MessageList = ({
  conversation,
  messages = [],
  onReactionToggle,
  onOpenInfoModal,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or conversation switches
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversation?.id]);

  if (!conversation) return null;

  const isChannel = conversation.type === 'channel';

  return (
    <div className="flex-1 overflow-y-auto px-1 sm:px-2 py-4 space-y-4 custom-scrollbar">
      {/* Conversation Introduction Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-slate-800/60 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
          {isChannel ? (
            <Hash className="w-8 h-8" />
          ) : (
            <UserAvatar
              name={conversation.title}
              status={conversation.userStatus}
              size="lg"
              bgClass={conversation.userAvatarBg}
            />
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {isChannel ? `Welcome to #${conversation.title}!` : conversation.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
          {isChannel
            ? conversation.topic ||
              `This is the start of the #${conversation.title} channel. Send a message to start collaborating with your team!`
            : `This is the very beginning of your direct message history with ${conversation.title}. Keep conversations direct, concise, and friendly.`}
        </p>

        <div className="flex items-center gap-2 mt-3 text-2xs text-indigo-400 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SyncSpace Real-Time Session • Part 2 Frontend Engine</span>
        </div>
      </div>

      {/* Date Divider */}
      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-2xs font-medium text-slate-400 select-none">
          Today
        </div>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
          <p className="text-xs">No messages yet in this conversation.</p>
          <p className="text-2xs text-slate-600">Be the first to say hello below!</p>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onReactionToggle={onReactionToggle}
              onOpenInfoModal={onOpenInfoModal}
            />
          ))}
        </div>
      )}

      {/* Invisible anchor for smooth scroll to bottom */}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};
