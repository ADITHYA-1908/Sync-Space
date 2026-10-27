import React, { useState } from 'react';
import {
  Hash,
  Lock,
  Plus,
  ChevronDown,
  Search,
  MessageSquarePlus,
  Mic,
  MicOff,
  Headphones,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';
import { Badge } from '../common/Badge';

export const ChannelSidebar = ({
  workspace,
  channels,
  directMessages,
  activeConversation,
  onSelectConversation,
  onOpenNewChannelModal,
  currentUser,
  onOpenInfoModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Filter channels and DMs by search query
  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDMs = directMessages.filter((dm) =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none shrink-0">
      {/* Workspace Header */}
      <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between shadow-xs">
        <button
          onClick={() =>
            onOpenInfoModal(
              workspace.name,
              `${workspace.name} is on the ${workspace.plan} with ${workspace.membersCount} active members.`
            )
          }
          className="flex items-center gap-2 font-bold text-white text-sm hover:text-indigo-300 transition truncate max-w-[190px] cursor-pointer"
        >
          <span className="truncate">{workspace.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        <button
          onClick={onOpenNewChannelModal}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Create a Channel"
          aria-label="Create Channel"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Search / Filter Input */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Jump to or search..."
            className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Scrollable Channels & DMs List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-5 text-xs py-2 custom-scrollbar">
        {/* CHANNELS SECTION */}
        <section aria-labelledby="channels-heading">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <span
              id="channels-heading"
              className="font-semibold text-2xs uppercase tracking-wider text-slate-400"
            >
              Channels
            </span>
            <button
              onClick={onOpenNewChannelModal}
              className="text-slate-400 hover:text-white p-0.5 rounded transition cursor-pointer"
              title="Add Channel"
              aria-label="Add Channel"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {filteredChannels.length === 0 ? (
              <p className="px-2 py-1.5 text-2xs text-slate-500 italic">No channels match search.</p>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeConversation?.id === channel.id;
                const isPrivate = channel.type === 'private';

                return (
                  <button
                    key={channel.id}
                    onClick={() =>
                      onSelectConversation({
                        id: channel.id,
                        type: 'channel',
                        title: channel.name,
                        topic: channel.topic,
                        channelType: channel.type,
                      })
                    }
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isPrivate ? (
                        <Lock
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        />
                      ) : (
                        <Hash
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isActive ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        />
                      )}
                      <span className="truncate">{channel.name}</span>
                    </div>

                    <Badge count={channel.unreadCount} />
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* DIRECT MESSAGES SECTION */}
        <section aria-labelledby="direct-messages-heading">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <span
              id="direct-messages-heading"
              className="font-semibold text-2xs uppercase tracking-wider text-slate-400"
            >
              Direct Messages
            </span>
            <button
              onClick={() =>
                onOpenInfoModal(
                  'Start Direct Message',
                  'Select any teammate below to open a conversation. You can add more teammates to the workspace in Part 3.'
                )
              }
              className="text-slate-400 hover:text-white p-0.5 rounded transition cursor-pointer"
              title="New Direct Message"
              aria-label="New Direct Message"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {filteredDMs.length === 0 ? (
              <p className="px-2 py-1.5 text-2xs text-slate-500 italic">No direct messages match.</p>
            ) : (
              filteredDMs.map((user) => {
                const isActive = activeConversation?.id === user.id;

                return (
                  <button
                    key={user.id}
                    onClick={() =>
                      onSelectConversation({
                        id: user.id,
                        type: 'dm',
                        title: user.name,
                        topic: `${user.role} • ${user.statusText}`,
                        userStatus: user.status,
                        userRole: user.role,
                        userAvatarBg: user.avatarBg,
                      })
                    }
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <UserAvatar
                        name={user.name}
                        status={user.status}
                        size="xs"
                        bgClass={user.avatarBg}
                      />
                      <span className="truncate">{user.name}</span>
                    </div>

                    <Badge count={user.unreadCount} />
                  </button>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* User Footer Bar with Status & Mic/Audio Controls */}
      <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() =>
            onOpenInfoModal(
              'User Status',
              `${currentUser.name} (${currentUser.role})\nStatus: "${currentUser.statusText}"`
            )
          }
          className="flex items-center gap-2 min-w-0 cursor-pointer p-1 rounded-xl hover:bg-slate-800/60 transition"
        >
          <UserAvatar
            name={currentUser.name}
            status={currentUser.status}
            size="sm"
            bgClass={currentUser.avatarBg}
          />
          <div className="min-w-0 text-left">
            <p className="font-semibold text-xs text-white truncate leading-tight">
              {currentUser.name}
            </p>
            <p className="text-2xs text-slate-400 truncate leading-tight">
              {currentUser.statusText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-slate-400">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isMuted
                ? 'text-rose-400 hover:text-rose-300 bg-rose-500/10'
                : 'hover:text-white hover:bg-slate-800'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            aria-label="Microphone"
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsDeafened((prev) => !prev)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isDeafened
                ? 'text-rose-400 hover:text-rose-300 bg-rose-500/10'
                : 'hover:text-white hover:bg-slate-800'
            }`}
            title={isDeafened ? 'Undeafen' : 'Deafen'}
            aria-label="Audio"
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
