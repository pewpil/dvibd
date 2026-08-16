export interface TrendingTopic {
  rank: number;
  tag: string;
  posts: string;
}

export const trendingTopics: TrendingTopic[] = [
  { rank: 1, tag: "dvibd", posts: "12.4k posts" },
  { rank: 2, tag: "SolidStart", posts: "8.1k posts" },
  { rank: 3, tag: "OpenSource", posts: "6.7k posts" },
  { rank: 4, tag: "WebDev", posts: "5.2k posts" },
];

export interface SuggestedUser {
  name: string;
  handle: string;
}

export const suggestedUsers: SuggestedUser[] = [
  { name: "Aria Chen", handle: "ariachen" },
  { name: "Marcus Lee", handle: "marcuslee" },
  { name: "Sofia Reyes", handle: "sofia.reyes" },
];

export interface Community {
  name: string;
  members: string;
}

export const communities: Community[] = [
  { name: "SolidJS", members: "24k members" },
  { name: "Design Tokens", members: "9.3k members" },
  { name: "Indie Hacking", members: "15.7k members" },
];

export interface CurrentUser {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  website: string;
  following: number;
  followers: number;
}

export const currentUser: CurrentUser = {
  name: "Sad And Dan",
  handle: "sadanddan",
  avatar: "/profile-picture.svg",
  cover: "/profile-cover.svg",
  bio: "Building dvibd, a calmer social network for thoughtful writing and quiet sharing.",
  website: "dvibd.com",
  following: 1240,
  followers: 8900,
};

export const interestTags: string[] = [
  "Technology",
  "Design",
  "Open Source",
  "Web Dev",
  "Communities",
  "Art",
  "Music",
  "Photography",
  "Writing",
  "Gaming",
  "Science",
  "Travel",
  "Food",
  "Health",
  "Books",
  "Nature",
];

export interface LifeEvent {
  id: number;
  title: string;
  meta: string[];
}

export const lifeEvents: LifeEvent[] = [
  {
    id: 1,
    title: "dvibd launches its public API",
    meta: ["dvibd", "1.2k posts"],
  },
  {
    id: 2,
    title: "SolidStart v2 conference talks published",
    meta: ["SolidStart", "840 posts"],
  },
  {
    id: 3,
    title: "Community fundraiser for open-source fonts",
    meta: ["Design", "320 posts"],
  },
];

export interface Post {
  id: number;
  author: string;
  handle: string;
  time: string;
  avatar?: string;
  text: string;
  type: "stat" | "article";
  media?: { count: number };
  likedByUser?: boolean;
  replyTo?: string;
  reply: number;
  repost: number;
  like: number;
  save: number;
}

export const posts: Post[] = [
  {
    id: 1,
    author: "Aria Chen",
    handle: "ariachen",
    time: "2h",
    text: "Just shipped the new feed layout and it feels so much calmer. Slow social done right.",
    type: "stat",
    media: { count: 1 },
    likedByUser: true,
    reply: 12,
    repost: 5,
    like: 48,
    save: 3,
  },
  {
    id: 2,
    author: "Marcus Lee",
    handle: "marcuslee",
    time: "5h",
    text: "SolidStart v2 with fine-grained reactivity is genuinely a joy to build with.",
    type: "article",
    media: { count: 7 },
    reply: 8,
    repost: 22,
    like: 130,
    save: 15,
  },
  {
    id: 3,
    author: "Sofia Reyes",
    handle: "sofia.reyes",
    time: "8h",
    text: "Spent the morning drawing icons. Lexend for headings, Rethink Sans for body — such a clean pairing.",
    type: "stat",
    likedByUser: true,
    reply: 3,
    repost: 1,
    like: 27,
    save: 9,
  },
  {
    id: 4,
    author: "Sad And Dan",
    handle: "sadanddan",
    time: "1h",
    text: "Slow social means every post gets room to breathe. No feeds that punish you for stepping away.",
    type: "stat",
    media: { count: 3 },
    reply: 4,
    repost: 12,
    like: 89,
    save: 6,
  },
  {
    id: 5,
    author: "Sad And Dan",
    handle: "sadanddan",
    time: "3h",
    text: "The profile page is coming together. Cover, card, and tabs that stick right under the header.",
    type: "stat",
    reply: 2,
    repost: 1,
    like: 21,
    save: 0,
  },
  {
    id: 6,
    author: "Sad And Dan",
    handle: "sadanddan",
    time: "6h",
    text: "We settled on the design tokens this week: Lexend for headings, Rethink Sans for body, one primary.",
    type: "article",
    reply: 1,
    repost: 3,
    like: 17,
    save: 2,
  },
  {
    id: 7,
    author: "Sad And Dan",
    handle: "sadanddan",
    time: "9h",
    replyTo: "ariachen",
    text: "Completely agree. The calmer pace makes each post count more.",
    type: "stat",
    reply: 0,
    repost: 0,
    like: 5,
    save: 0,
  },
];

export interface Notification {
  id: number;
  actor: string;
  handle: string;
  avatar?: string;
  action: string;
  time: string;
}

export const notifications: Notification[] = [
  {
    id: 1,
    actor: "Marcus Lee",
    handle: "marcuslee",
    action: "liked your post",
    time: "12m",
  },
  {
    id: 2,
    actor: "Sofia Reyes",
    handle: "sofia.reyes",
    action: "replied to your post",
    time: "40m",
  },
  {
    id: 3,
    actor: "Aria Chen",
    handle: "ariachen",
    action: "started following you",
    time: "2h",
  },
  {
    id: 4,
    actor: "dvibd",
    handle: "dvibd",
    action: "mentioned you in a community post",
    time: "5h",
  },
  {
    id: 5,
    actor: "Liam Park",
    handle: "liampark",
    action: "liked your post",
    time: "6h",
  },
  {
    id: 6,
    actor: "Noah Bennett",
    handle: "noahb",
    action: "reposted your post",
    time: "7h",
  },
  {
    id: 7,
    actor: "Mia Ortiz",
    handle: "mia.ortiz",
    action: "started following you",
    time: "9h",
  },
  {
    id: 8,
    actor: "Ethan Cole",
    handle: "ethancole",
    action: "replied to your post",
    time: "11h",
  },
  {
    id: 9,
    actor: "Zoe Nakamura",
    handle: "zoe.n",
    action: "liked your comment",
    time: "13h",
  },
  {
    id: 10,
    actor: "Owen Frost",
    handle: "owenfrost",
    action: "mentioned you in a post",
    time: "15h",
  },
  {
    id: 11,
    actor: "Isla Romano",
    handle: "isla.r",
    action: "started following you",
    time: "18h",
  },
  {
    id: 12,
    actor: "Caleb Singh",
    handle: "calebs",
    action: "liked your post",
    time: "20h",
  },
  {
    id: 13,
    actor: "Ava Lindqvist",
    handle: "ava.l",
    action: "reposted your post",
    time: "22h",
  },
  {
    id: 14,
    actor: "Theo Marchetti",
    handle: "theom",
    action: "replied to your post",
    time: "1d",
  },
  {
    id: 15,
    actor: "Nora Haddad",
    handle: "norah",
    action: "started following you",
    time: "1d",
  },
  {
    id: 16,
    actor: "Jonah Reyes",
    handle: "jonahr",
    action: "liked your post",
    time: "1d",
  },
  {
    id: 17,
    actor: "Priya Anand",
    handle: "priya.a",
    action: "mentioned you in a community post",
    time: "2d",
  },
  {
    id: 18,
    actor: "Felix Bauer",
    handle: "felixb",
    action: "reposted your post",
    time: "2d",
  },
];