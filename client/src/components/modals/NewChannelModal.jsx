import React, { useState } from 'react';
import { Hash, Lock, X, Plus } from 'lucide-react';

export const NewChannelModal = ({ isOpen, onClose, onCreateChannel }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedName = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');

    if (!formattedName) {
      setError('Please provide a valid channel name.');
      return;
    }

    onCreateChannel({
      id: `channel-${formattedName}-${Date.now()}`,
      name: formattedName,
      type: isPrivate ? 'private' : 'public',
      topic: topic.trim() || 'New team discussion channel',
      unreadCount: 0,
    });

    setName('');
    setTopic('');
    setIsPrivate(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-channel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-channel-title" className="text-base font-semibold text-white">
                Create a Channel
              </h2>
              <p className="text-xs text-slate-400">Channels are where team members communicate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="channel-name" className="block text-xs font-medium text-slate-300 mb-1.5">
              Channel Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                #
              </span>
              <input
                id="channel-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. mobile-app, release-sync"
                className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                autoFocus
              />
            </div>
            <p className="text-2xs text-slate-500 mt-1">Lowercase letters, numbers, and hyphens only.</p>
          </div>

          <div>
            <label htmlFor="channel-topic" className="block text-xs font-medium text-slate-300 mb-1.5">
              Topic or Description <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="channel-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What is this channel about?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Visibility toggle */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="mt-1 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
              />
              <div className="text-xs">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  {isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Hash className="w-3.5 h-3.5 text-indigo-400" />}
                  Make private
                </span>
                <p className="text-slate-400 mt-0.5">
                  When a channel is private, it can only be viewed or joined by invitation.
                </p>
              </div>
            </label>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Channel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
