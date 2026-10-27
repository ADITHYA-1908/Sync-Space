import { useState, useEffect, useCallback } from 'react';
import {
  initialWorkspaces,
  initialChannels,
  initialDirectMessages,
  initialMessages,
  currentUser,
} from './data/mockData';
import { WorkspaceSidebar } from './components/layout/WorkspaceSidebar';
import { ChannelSidebar } from './components/layout/ChannelSidebar';
import { ChatHeader } from './components/layout/ChatHeader';
import { MessageList } from './components/chat/MessageList';
import { MessageInput } from './components/chat/MessageInput';
import { HealthStatusModal } from './components/modals/HealthStatusModal';
import { NewChannelModal } from './components/modals/NewChannelModal';
import { InfoModal } from './components/modals/InfoModal';
import { X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  // Workspaces and Navigation State
  const [workspaces] = useState(initialWorkspaces);
  const [activeWorkspace, setActiveWorkspace] = useState(initialWorkspaces[0]);

  // Channels & Direct Messages
  const [channels, setChannels] = useState(initialChannels);
  const [directMessages] = useState(initialDirectMessages);

  // Active Selected Conversation (Default: # general)
  const [activeConversation, setActiveConversation] = useState({
    id: initialChannels[0].id,
    type: 'channel',
    title: initialChannels[0].name,
    topic: initialChannels[0].topic,
    channelType: initialChannels[0].type,
  });

  // Conversation Messages Dictionary: { [conversationId]: Array<Message> }
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);

  // Responsive Drawer State (Mobile / Tablet)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal Dialogs State
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [infoModalData, setInfoModalData] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  // Backend Health Check Monitoring (Preserving Part 1 foundation)
  const [healthData, setHealthData] = useState(null);
  const [healthStatus, setHealthStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [healthLatency, setHealthLatency] = useState(null);
  const [healthErrorMessage, setHealthErrorMessage] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    setHealthErrorMessage('');
    const startTime = performance.now();

    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        headers: { Accept: 'application/json' },
      });

      const latencyMs = Math.round(performance.now() - startTime);
      setHealthLatency(latencyMs);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      setHealthData(data);
      setHealthStatus('success');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setHealthStatus('error');
      setHealthErrorMessage(
        err instanceof Error ? err.message : 'Unable to connect to Express backend'
      );
      setHealthData(null);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          headers: { Accept: 'application/json' },
        });
        const latencyMs = Math.round(performance.now() - startTime);
        if (!isMounted) return;
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} (${response.statusText})`);
        }
        const data = await response.json();
        setHealthData(data);
        setHealthLatency(latencyMs);
        setHealthStatus('success');
        setLastChecked(new Date().toLocaleTimeString());
      } catch (err) {
        if (!isMounted) return;
        setHealthStatus('error');
        setHealthErrorMessage(
          err instanceof Error ? err.message : 'Unable to connect to Express backend'
        );
        setHealthData(null);
        setLastChecked(new Date().toLocaleTimeString());
      }
    };
    fetchHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Open info modal helper
  const handleOpenInfoModal = (title, message) => {
    setInfoModalData({
      isOpen: true,
      title,
      message,
    });
  };

  const handleCloseInfoModal = () => {
    setInfoModalData((prev) => ({ ...prev, isOpen: false }));
  };

  // Switch Conversation (Channel or DM)
  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setIsMobileSidebarOpen(false); // Close mobile drawer on selection
  };

  // Send a new message to the active conversation
  const handleSendMessage = (content) => {
    if (!activeConversation) return;

    const convId = activeConversation.id;
    const now = new Date();
    const formattedTime = `Today at ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatarBg: currentUser.avatarBg,
        status: currentUser.status,
      },
      content,
      timestamp: formattedTime,
      reactions: [],
    };

    setMessagesByConversation((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMessage],
    }));
  };

  // Toggle emoji reactions on messages
  const handleReactionToggle = (messageId, emoji) => {
    const convId = activeConversation.id;

    setMessagesByConversation((prev) => {
      const currentList = prev[convId] || [];
      const updatedList = currentList.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions || [];
        const existingIndex = reactions.findIndex((r) => r.emoji === emoji);

        if (existingIndex > -1) {
          // Increment reaction count
          const updated = [...reactions];
          updated[existingIndex] = {
            ...updated[existingIndex],
            count: updated[existingIndex].count + 1,
          };
          return { ...msg, reactions: updated };
        } else {
          // Add new emoji reaction
          return {
            ...msg,
            reactions: [...reactions, { emoji, count: 1, users: [currentUser.name] }],
          };
        }
      });

      return {
        ...prev,
        [convId]: updatedList,
      };
    });
  };

  // Create a new channel and select it
  const handleCreateChannel = (newChannel) => {
    setChannels((prev) => [...prev, newChannel]);
    setMessagesByConversation((prev) => ({
      ...prev,
      [newChannel.id]: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            avatarBg: currentUser.avatarBg,
            status: currentUser.status,
          },
          content: `Created #${newChannel.name}. ${newChannel.topic}`,
          timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          reactions: [{ emoji: '🎉', count: 1, users: [currentUser.name] }],
        },
      ],
    }));

    // Select newly created channel
    handleSelectConversation({
      id: newChannel.id,
      type: 'channel',
      title: newChannel.name,
      topic: newChannel.topic,
      channelType: newChannel.type,
    });
  };

  const currentMessages = messagesByConversation[activeConversation?.id] || [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Desktop Workspace Sidebar Rail (Hidden on small mobile screens, shown on tablet/desktop) */}
      <div className="hidden sm:flex">
        <WorkspaceSidebar
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
          currentUser={currentUser}
          healthStatus={healthStatus}
          onOpenHealthModal={() => setIsHealthModalOpen(true)}
          onOpenInfoModal={handleOpenInfoModal}
        />
      </div>

      {/* 2. Desktop Channel Sidebar (Visible on lg screens) */}
      <div className="hidden lg:flex">
        <ChannelSidebar
          workspace={activeWorkspace}
          channels={channels}
          directMessages={directMessages}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onOpenNewChannelModal={() => setIsNewChannelModalOpen(true)}
          currentUser={currentUser}
          onOpenInfoModal={handleOpenInfoModal}
        />
      </div>

      {/* 3. Mobile / Tablet Off-Canvas Drawer (When user clicks Hamburger button on smaller screens) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative z-50 flex h-full max-w-sm shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Workspace rail inside drawer */}
            <WorkspaceSidebar
              workspaces={workspaces}
              activeWorkspace={activeWorkspace}
              onSelectWorkspace={setActiveWorkspace}
              currentUser={currentUser}
              healthStatus={healthStatus}
              onOpenHealthModal={() => {
                setIsMobileSidebarOpen(false);
                setIsHealthModalOpen(true);
              }}
              onOpenInfoModal={(t, m) => {
                setIsMobileSidebarOpen(false);
                handleOpenInfoModal(t, m);
              }}
            />

            {/* Channels & DMs inside drawer */}
            <ChannelSidebar
              workspace={activeWorkspace}
              channels={channels}
              directMessages={directMessages}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              onOpenNewChannelModal={() => {
                setIsMobileSidebarOpen(false);
                setIsNewChannelModalOpen(true);
              }}
              currentUser={currentUser}
              onOpenInfoModal={(t, m) => {
                setIsMobileSidebarOpen(false);
                handleOpenInfoModal(t, m);
              }}
            />

            {/* Close button on drawer edge */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-3 -right-11 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-950">
        {/* Top Header */}
        <ChatHeader
          conversation={activeConversation}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenInfoModal={handleOpenInfoModal}
        />

        {/* Message Feed Container */}
        <MessageList
          conversation={activeConversation}
          messages={currentMessages}
          onReactionToggle={handleReactionToggle}
          onOpenInfoModal={handleOpenInfoModal}
        />

        {/* Bottom Message Composer */}
        <MessageInput
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          onOpenInfoModal={handleOpenInfoModal}
        />
      </div>

      {/* --- Modal Dialogs --- */}
      {/* 1. Health Status Modal (Preserving Part 1 Backend Health API Diagnostic) */}
      <HealthStatusModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthData={healthData}
        healthStatus={healthStatus}
        latency={healthLatency}
        lastChecked={lastChecked}
        onRefresh={checkHealth}
        errorMessage={healthErrorMessage}
      />

      {/* 2. Create Channel Modal */}
      <NewChannelModal
        isOpen={isNewChannelModalOpen}
        onClose={() => setIsNewChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      {/* 3. Feature Information & Roadmap Notice Modal */}
      <InfoModal
        isOpen={infoModalData.isOpen}
        onClose={handleCloseInfoModal}
        title={infoModalData.title}
        message={infoModalData.message}
      />
    </div>
  );
}

export default App;
