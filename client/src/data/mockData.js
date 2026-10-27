/**
 * SyncSpace Part 2 Mock Data
 * Realistic seed data for workspaces, channels, direct message contacts, and conversation histories.
 * Note: These are local seed items for UI testing and layout verification prior to Part 3/4 database integration.
 */

export const currentUser = {
  id: 'user-current',
  name: 'Adithya Natarajan',
  email: 'adithyamsss2006@gmail.com',
  role: 'Platform Architect',
  status: 'online', // 'online' | 'away' | 'busy' | 'offline'
  statusText: 'Shipping SyncSpace Part 2 🚀',
  avatarBg: 'bg-indigo-600',
};

export const initialWorkspaces = [
  {
    id: 'ws-syncspace',
    name: 'SyncSpace Dev',
    slug: 'syncspace-dev',
    initials: 'SS',
    color: 'from-indigo-600 to-violet-600',
    plan: 'Pro Plan',
    membersCount: 24,
  },
  {
    id: 'ws-acme',
    name: 'Acme Enterprise',
    slug: 'acme-corp',
    initials: 'AE',
    color: 'from-emerald-600 to-teal-600',
    plan: 'Enterprise',
    membersCount: 142,
  },
  {
    id: 'ws-design',
    name: 'Design Collective',
    slug: 'design-collective',
    initials: 'DC',
    color: 'from-amber-500 to-orange-600',
    plan: 'Standard',
    membersCount: 12,
  },
];

export const initialChannels = [
  {
    id: 'channel-general',
    name: 'general',
    type: 'public',
    topic: 'Company-wide announcements, discussions, and updates',
    unreadCount: 0,
  },
  {
    id: 'channel-frontend',
    name: 'frontend',
    type: 'public',
    topic: 'React 19, Tailwind CSS v4, and modern web application UI/UX',
    unreadCount: 2,
  },
  {
    id: 'channel-backend',
    name: 'backend',
    type: 'public',
    topic: 'Node.js, Express, REST APIs, and system performance',
    unreadCount: 0,
  },
  {
    id: 'channel-announcements',
    name: 'announcements',
    type: 'public',
    topic: 'Official product releases, project roadmap, and milestones',
    unreadCount: 1,
  },
  {
    id: 'channel-random',
    name: 'random',
    type: 'public',
    topic: 'Water cooler banter, memes, and casual conversations',
    unreadCount: 0,
  },
];

export const initialDirectMessages = [
  {
    id: 'dm-alex',
    name: 'Alex Johnson',
    role: 'Lead System Engineer',
    status: 'online',
    statusText: 'Reviewing PR #42',
    avatarBg: 'bg-blue-600',
    unreadCount: 1,
  },
  {
    id: 'dm-sarah',
    name: 'Sarah Chen',
    role: 'Principal Product Designer',
    status: 'online',
    statusText: 'Designing design tokens 🎨',
    avatarBg: 'bg-emerald-600',
    unreadCount: 0,
  },
  {
    id: 'dm-marcus',
    name: 'Marcus Miller',
    role: 'DevOps & Cloud Architect',
    status: 'away',
    statusText: 'In a meeting until 3 PM',
    avatarBg: 'bg-amber-600',
    unreadCount: 0,
  },
  {
    id: 'dm-elena',
    name: 'Elena Rostova',
    role: 'Full-Stack Developer',
    status: 'offline',
    statusText: 'Focus mode',
    avatarBg: 'bg-purple-600',
    unreadCount: 0,
  },
];

export const initialMessages = {
  'channel-general': [
    {
      id: 'msg-gen-1',
      sender: {
        id: 'dm-alex',
        name: 'Alex Johnson',
        role: 'Lead System Engineer',
        avatarBg: 'bg-blue-600',
      },
      content: 'Welcome everyone to the official SyncSpace workspace! 🎉\nLet\'s keep team communication structured, fast, and transparent.',
      timestamp: 'Today at 09:15 AM',
      reactions: [{ emoji: '🎉', count: 4, users: ['Adithya', 'Sarah', 'Marcus'] }],
    },
    {
      id: 'msg-gen-2',
      sender: {
        id: 'dm-sarah',
        name: 'Sarah Chen',
        role: 'Principal Product Designer',
        avatarBg: 'bg-emerald-600',
      },
      content: 'I\'ve reviewed the updated layout specifications. The dark workspace rail and high-contrast channel sidebar feel very cohesive and clean.',
      timestamp: 'Today at 09:22 AM',
      reactions: [{ emoji: '👍', count: 3, users: ['Alex', 'Adithya'] }],
    },
    {
      id: 'msg-gen-3',
      sender: {
        id: 'user-current',
        name: 'Adithya Natarajan',
        role: 'Platform Architect',
        avatarBg: 'bg-indigo-600',
      },
      content: 'Part 1 foundation and Part 2 UI layout are now wired up. Feel free to test conversation switching, responsive drawer navigation, and message sending.',
      timestamp: 'Today at 09:40 AM',
      reactions: [{ emoji: '🚀', count: 5, users: ['Alex', 'Sarah', 'Marcus', 'Elena'] }],
    },
  ],

  'channel-frontend': [
    {
      id: 'msg-fe-1',
      sender: {
        id: 'dm-sarah',
        name: 'Sarah Chen',
        role: 'Principal Product Designer',
        avatarBg: 'bg-emerald-600',
      },
      content: 'We are using Tailwind CSS v4 with the `@tailwindcss/vite` plugin. It supports instant styling compilation with zero overhead.',
      timestamp: 'Today at 10:02 AM',
    },
    {
      id: 'msg-fe-2',
      sender: {
        id: 'user-current',
        name: 'Adithya Natarajan',
        role: 'Platform Architect',
        avatarBg: 'bg-indigo-600',
      },
      content: 'All chat components are built with modular separation: WorkspaceSidebar, ChannelSidebar, ChatHeader, MessageList, and MessageInput.',
      timestamp: 'Today at 10:14 AM',
    },
  ],

  'channel-backend': [
    {
      id: 'msg-be-1',
      sender: {
        id: 'dm-alex',
        name: 'Alex Johnson',
        role: 'Lead System Engineer',
        avatarBg: 'bg-blue-600',
      },
      content: 'The Express health-check endpoint `GET /api/health` is active on port 5000 and returning status, uptime, and timestamp in JSON format.',
      timestamp: 'Yesterday at 04:30 PM',
    },
    {
      id: 'msg-be-2',
      sender: {
        id: 'dm-marcus',
        name: 'Marcus Miller',
        role: 'DevOps & Cloud Architect',
        avatarBg: 'bg-amber-600',
      },
      content: 'In Part 3, we\'ll add MongoDB with Mongoose schemas for Users, Workspaces, and Channels with JWT auth middleware.',
      timestamp: 'Yesterday at 05:12 PM',
    },
  ],

  'channel-announcements': [
    {
      id: 'msg-ann-1',
      sender: {
        id: 'user-current',
        name: 'Adithya Natarajan',
        role: 'Platform Architect',
        avatarBg: 'bg-indigo-600',
      },
      content: '📢 **Milestone Update**: SyncSpace Part 1 (Foundation & Setup) is successfully committed to GitHub. Part 2 (Frontend Layout & Real-time Mock UI) is currently in development.',
      timestamp: 'Today at 08:30 AM',
      reactions: [{ emoji: '🔥', count: 6, users: ['Team'] }],
    },
  ],

  'channel-random': [
    {
      id: 'msg-rand-1',
      sender: {
        id: 'dm-sarah',
        name: 'Sarah Chen',
        role: 'Principal Product Designer',
        avatarBg: 'bg-emerald-600',
      },
      content: 'Anyone grabbing coffee or matcha before the sprint review? ☕',
      timestamp: 'Today at 11:15 AM',
    },
  ],

  'dm-alex': [
    {
      id: 'msg-dm-a-1',
      sender: {
        id: 'dm-alex',
        name: 'Alex Johnson',
        role: 'Lead System Engineer',
        avatarBg: 'bg-blue-600',
      },
      content: 'Hey Adithya, how is the responsive breakpoint looking on mobile? Let me know if the message composer needs keyboard padding adjustment.',
      timestamp: 'Today at 10:45 AM',
    },
    {
      id: 'msg-dm-a-2',
      sender: {
        id: 'user-current',
        name: 'Adithya Natarajan',
        role: 'Platform Architect',
        avatarBg: 'bg-indigo-600',
      },
      content: 'Hey Alex! The layout uses an off-canvas drawer on mobile and full 3-column split on desktop. Tested smoothly!',
      timestamp: 'Today at 10:48 AM',
    },
  ],

  'dm-sarah': [
    {
      id: 'msg-dm-s-1',
      sender: {
        id: 'dm-sarah',
        name: 'Sarah Chen',
        role: 'Principal Product Designer',
        avatarBg: 'bg-emerald-600',
      },
      content: 'Adithya, the contrast ratios on the dark sidebar and active channel pill look great. Matches the accessibility standards.',
      timestamp: 'Today at 09:55 AM',
    },
  ],

  'dm-marcus': [
    {
      id: 'msg-dm-m-1',
      sender: {
        id: 'dm-marcus',
        name: 'Marcus Miller',
        role: 'DevOps & Cloud Architect',
        avatarBg: 'bg-amber-600',
      },
      content: 'Let me know whenever you want me to prep the Docker and MongoDB container compose file for Part 3.',
      timestamp: 'Yesterday at 03:20 PM',
    },
  ],

  'dm-elena': [
    {
      id: 'msg-dm-e-1',
      sender: {
        id: 'dm-elena',
        name: 'Elena Rostova',
        role: 'Full-Stack Developer',
        avatarBg: 'bg-purple-600',
      },
      content: 'I\'m currently heads down writing unit tests for the upcoming auth service. Talk soon!',
      timestamp: 'Yesterday at 06:00 PM',
    },
  ],
};
