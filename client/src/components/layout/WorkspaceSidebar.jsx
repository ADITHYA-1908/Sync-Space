import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  FolderClosed,
  MoreHorizontal,
  Settings,
  Plus,
  Activity,
  Check,
  ChevronDown,
} from 'lucide-react';
import { UserAvatar } from '../common/UserAvatar';

export const WorkspaceSidebar = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  currentUser,
  healthStatus,
  onOpenHealthModal,
  onOpenInfoModal,
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');

  const navItems = [
    { id: 'messages', label: 'DMs & Channels', icon: MessageSquare, badge: 3 },
    { id: 'activity', label: 'Activity & Mentions', icon: Bell, badge: null },
    { id: 'files', label: 'Canvas & Files', icon: FolderClosed, badge: null },
    { id: 'more', label: 'More Tools', icon: MoreHorizontal, badge: null },
  ];

  return (
    <aside className="w-18 bg-slate-950 border-r border-slate-800/80 flex flex-col items-center py-3.5 select-none shrink-0 z-30">
      {/* SyncSpace Brand / Active Workspace Button */}
      <div className="relative mb-4">
        <button
          onClick={() => setShowWorkspaceMenu((prev) => !prev)}
          className="relative group p-1 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          title={`Switch Workspace: ${activeWorkspace.name}`}
          aria-expanded={showWorkspaceMenu}
          aria-haspopup="true"
        >
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeWorkspace.color} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-950/50 group-hover:rounded-xl transition-all duration-200 ring-2 ring-indigo-500/40`}
          >
            {activeWorkspace.initials}
          </div>

          {/* Mini dropdown indicator */}
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 rounded-full p-0.5 text-slate-300">
            <ChevronDown className="w-2.5 h-2.5" />
          </div>
        </button>

        {/* Workspace Switcher Popover Menu */}
        {showWorkspaceMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowWorkspaceMenu(false)}
            />
            <div className="absolute left-16 top-0 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Switch Workspace
                </span>
              </div>

              <div className="space-y-1">
                {workspaces.map((ws) => {
                  const isActive = ws.id === activeWorkspace.id;
                  return (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws);
                        setShowWorkspaceMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-medium'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${ws.color} text-white font-bold flex items-center justify-center text-xs shrink-0`}
                        >
                          {ws.initials}
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-slate-200 truncate">{ws.name}</p>
                          <span className="text-2xs text-slate-400">{ws.plan}</span>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onOpenInfoModal(
                      'Create Workspace',
                      'Creating new workspaces with multi-tenant MongoDB isolation will be introduced in Part 3.'
                    );
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-800 text-slate-300 transition text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                  <span>Add a new workspace</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-8 h-px bg-slate-800/80 mb-3" />

      {/* Main Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center space-y-2 w-full px-2" aria-label="Workspace views">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'messages') {
                  onOpenInfoModal(
                    item.label,
                    `${item.label} view is scheduled for upcoming milestones. You are currently viewing the core real-time Channels & DMs workspace.`
                  );
                }
              }}
              className={`relative group w-11 h-11 rounded-2xl flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" />

              {/* Active rail bar */}
              {isActive && (
                <span className="absolute -left-2 w-1 h-5 bg-indigo-500 rounded-r-full" />
              )}

              {/* Badge indicator */}
              {item.badge && !isActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Controls: Health Diagnostic & User Profile */}
      <div className="flex flex-col items-center space-y-3 pt-3 border-t border-slate-800/80 w-full px-2">
        {/* Backend Health Check Pill (Part 1 Integration) */}
        <button
          onClick={onOpenHealthModal}
          className="relative group w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
          title={`Backend Server Status: ${healthStatus} (Click for diagnostics)`}
          aria-label="Backend Health Status"
        >
          <Activity className="w-4 h-4 text-slate-300" />
          <span
            className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ring-2 ring-slate-950 ${
              healthStatus === 'success'
                ? 'bg-emerald-500'
                : healthStatus === 'loading'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
        </button>

        {/* Settings button */}
        <button
          onClick={() =>
            onOpenInfoModal(
              'Workspace Preferences',
              'Workspace settings, notification controls, and member management are scheduled for Part 3.'
            )
          }
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition cursor-pointer"
          title="Preferences & Settings"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Current User Profile Avatar */}
        <div className="pt-1">
          <button
            onClick={() =>
              onOpenInfoModal(
                `Profile: ${currentUser.name}`,
                `Role: ${currentUser.role} • Status: ${currentUser.statusText} • Account: ${currentUser.email}`
              )
            }
            className="group block rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            title={`${currentUser.name} (${currentUser.role})`}
          >
            <UserAvatar
              name={currentUser.name}
              status={currentUser.status}
              size="md"
              bgClass={currentUser.avatarBg}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
