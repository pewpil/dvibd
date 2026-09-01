export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  status: "online" | "offline" | "idle";
  bio: string;
  role: string;
  email: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "channel";
  title: string;
  avatar: string;
  subtitle: string;
  communityName: string;
  lastMessage: string;
  lastSenderName: string;
  timestamp: string;
  unreadCount: number;
  presenceStatus: "online" | "offline" | "idle";
  memberCount: number;
  isMuted: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  status: "sent" | "delivered" | "read";
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
}

export interface SharedFile {
  id: string;
  name: string;
  size: string;
  extension: string;
  timestamp: string;
}

export interface SharedLink {
  id: string;
  title: string;
  url: string;
  domain: string;
}

export interface Participant {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  status: "online" | "offline" | "idle";
}

export const currentUser: User = {
  id: "user-current",
  name: "Alex Rivera",
  handle: "alexrivera",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  status: "online",
  bio: "Full-stack developer working on dvibd platform.",
  role: "Software Engineer",
  email: "alex.rivera@dvibd.dev",
};

export const fallbackConversations: Conversation[] = [
  {
    id: "conv-1",
    type: "direct",
    title: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    subtitle: "Product Designer",
    communityName: "",
    lastMessage: "I uploaded the revised Figma tokens for the navigation bar.",
    lastSenderName: "Elena",
    timestamp: "10:42 AM",
    unreadCount: 2,
    presenceStatus: "online",
    memberCount: 2,
    isMuted: false,
  },
  {
    id: "conv-2",
    type: "channel",
    title: "#design-critique",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    subtitle: "Community channel for UI/UX reviews",
    communityName: "Dvibd Design Hub",
    lastMessage: "Marcus: The contrast ratio on secondary badges looks solid now.",
    lastSenderName: "Marcus",
    timestamp: "10:15 AM",
    unreadCount: 5,
    presenceStatus: "online",
    memberCount: 48,
    isMuted: false,
  },
  {
    id: "conv-3",
    type: "direct",
    title: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subtitle: "Lead Architect",
    communityName: "",
    lastMessage: "Let me know once the database migration completes.",
    lastSenderName: "Marcus",
    timestamp: "Yesterday",
    unreadCount: 0,
    presenceStatus: "idle",
    memberCount: 2,
    isMuted: false,
  },
  {
    id: "conv-4",
    type: "channel",
    title: "#release-announcements",
    avatar: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80",
    subtitle: "Official release notes and updates",
    communityName: "Dvibd Core",
    lastMessage: "Sora: dvibd v2.4.0 is now live in production across all regions.",
    lastSenderName: "Sora",
    timestamp: "Yesterday",
    unreadCount: 0,
    presenceStatus: "online",
    memberCount: 128,
    isMuted: true,
  },
  {
    id: "conv-5",
    type: "direct",
    title: "Sora Tanaka",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    subtitle: "Frontend Engineer",
    communityName: "",
    lastMessage: "The CSS module id hashing works cleanly with Turbopack.",
    lastSenderName: "Sora",
    timestamp: "2d ago",
    unreadCount: 0,
    presenceStatus: "online",
    memberCount: 2,
    isMuted: false,
  },
  {
    id: "conv-6",
    type: "channel",
    title: "#frontend-infra",
    avatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80",
    subtitle: "Build tooling, Next.js, and SolidStart discussions",
    communityName: "Dvibd Engineering",
    lastMessage: "Alex: Added the new Next.js route handlers.",
    lastSenderName: "You",
    timestamp: "3d ago",
    unreadCount: 0,
    presenceStatus: "offline",
    memberCount: 36,
    isMuted: false,
  },
];

export const fallbackMessages: Message[] = [
  {
    id: "msg-1",
    senderId: "user-elena",
    senderName: "Elena Rostova",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "Hey Alex! Did you get a chance to check the updated message layout requirements?",
    timestamp: "10:24 AM",
    isOutgoing: false,
    status: "read",
  },
  {
    id: "msg-2",
    senderId: "user-current",
    senderName: "Alex Rivera",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "Yes, I reviewed them. We are building 3 vertical divisions: Conversations on the left, Current Conversation in the center, and Conversation Info on the right.",
    timestamp: "10:28 AM",
    isOutgoing: true,
    status: "read",
  },
  {
    id: "msg-3",
    senderId: "user-elena",
    senderName: "Elena Rostova",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "Awesome! Here is the updated design preview showing the proportion balance and responsive grid.",
    timestamp: "10:35 AM",
    isOutgoing: false,
    status: "read",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    mediaName: "message-layout-spec-v2.png",
    mediaSize: "1.4 MB",
  },
  {
    id: "msg-4",
    senderId: "user-current",
    senderName: "Alex Rivera",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "The proportions look great. I am implementing the CSS modules with tag#id selectors and percentage units.",
    timestamp: "10:39 AM",
    isOutgoing: true,
    status: "read",
  },
  {
    id: "msg-5",
    senderId: "user-elena",
    senderName: "Elena Rostova",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "I uploaded the revised Figma tokens for the navigation bar.",
    timestamp: "10:42 AM",
    isOutgoing: false,
    status: "read",
  },
];

export const fallbackParticipants: Participant[] = [
  {
    id: "user-elena",
    name: "Elena Rostova",
    handle: "elena",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "Product Designer",
    status: "online",
  },
  {
    id: "user-current",
    name: "Alex Rivera",
    handle: "alexrivera",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Software Engineer",
    status: "online",
  },
];

export const fallbackSharedFiles: SharedFile[] = [
  {
    id: "file-1",
    name: "message-layout-spec-v2.png",
    size: "1.4 MB",
    extension: "PNG",
    timestamp: "Today, 10:35 AM",
  },
  {
    id: "file-2",
    name: "design-tokens-palette.json",
    size: "42 KB",
    extension: "JSON",
    timestamp: "Aug 29, 2026",
  },
  {
    id: "file-3",
    name: "message-architecture.pdf",
    size: "3.2 MB",
    extension: "PDF",
    timestamp: "Aug 27, 2026",
  },
];

export const fallbackSharedLinks: SharedLink[] = [
  {
    id: "link-1",
    title: "Figma: dvibd Design System 2.0",
    url: "https://figma.com/file/dvibd-system",
    domain: "figma.com",
  },
  {
    id: "link-2",
    title: "Next.js App Router Documentation",
    url: "https://nextjs.org/docs/app",
    domain: "nextjs.org",
  },
  {
    id: "link-3",
    title: "GitHub: dvibd repository",
    url: "https://github.com/pewpil/dvibd",
    domain: "github.com",
  },
];
