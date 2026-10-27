import React from 'react';
import {
  Hash,
  Lock,
  Search,
  Users,
  Pin,
  Phone,
  Video,
  MoreVertical,
  Menu,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const ChatHeader = ({
  conversation,
  onToggleMobileSidebar,
  onOpenInfoModal,
}) => {
  if (!conversation) return null;

  const isChannel = conversation.type === 'channel';

  return (
    <header className="h-14 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 z-20">
      {/* Left Area: Mobile Drawer Toggle & Conversation Details */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          {isChannel ? (
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              {conversation.channelType === 'private' ? (
                <Lock className="w-4 h-4 text-amber-400" />
              ) : (
                <Hash className="w-4 h-4 text-indigo-400" />
              )}
            </div>
          ) : (
            <UserAvatar
              name={conversation.title}
              status={conversation.userStatus}
              size="sm"
              bgClass={conversation.userAvatarBg}
            />
          )}

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white truncate">
                {isChannel ? `#${conversation.title}` : conversation.title}
              </h1>

              {!isChannel && conversation.userRole && (
                <span className="hidden sm:inline-block text-2xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                  {conversation.userRole}
                </span>
              )}
            </div>

            {conversation.topic && (
              <p className="text-2xs text-slate-400 truncate max-w-[240px] sm:max-w-md md:max-w-lg">
                {conversation.topic}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Area: Action Icons */}
      <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
        <button
          onClick={() =>
            onOpenInfoModal(
              'Search Messages',
              `Full-text search across ${conversation.title} and workspace history will be powered by MongoDB Atlas Search in Part 3.`
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="Search in conversation"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Call Features',
              'Huddle, audio, and video calling will be integrated using WebRTC and Socket.IO in Part 4.'
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer hidden sm:flex"
          title="Start Audio Call (Part 4)"
          aria-label="Audio call"
        >
          <Phone className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Video Meetings',
              'Video meetings and screen sharing are scheduled for upcoming milestones.'
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer hidden sm:flex"
          title="Start Video Call (Part 4)"
          aria-label="Video call"
        >
          <Video className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        <button
          onClick={() =>
            onOpenInfoModal(
              'Pinned Messages',
              `Pinned messages for ${conversation.title} will be persisted in MongoDB in Part 3.`
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="Pinned Items"
          aria-label="Pinned items"
        >
          <Pin className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Channel Members',
              isChannel
                ? `Active members in #${conversation.title}: Adithya Natarajan, Alex Johnson, Sarah Chen, Marcus Miller, Elena Rostova.`
                : `${conversation.title} is a direct contact.`
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="Member list"
          aria-label="Member list"
        >
          <Users className="w-4 h-4" />
        </button>

        <button
          onClick={() =>
            onOpenInfoModal(
              'Conversation Options',
              `Settings, notification mutes, and export for ${conversation.title}.`
            )
          }
          className="p-2 rounded-xl hover:text-white hover:bg-slate-800/80 transition cursor-pointer"
          title="More options"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
