export interface TrendingTopic {
  rank: number;
  tag: string;
  posts: string;
}

export const trendingTopics: TrendingTopic[] = [
  { rank: 1, tag: "dvibd", posts: "12.4k posts" },
  { rank: 2, tag: "SolidStart", posts: "8.1k posts" },
  { rank: 3, tag: "Open Source", posts: "6.7k posts" },
  { rank: 4, tag: "Web Dev", posts: "5.2k posts" },
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

export interface Post {
  id: number;
  author: string;
  handle: string;
  time: string;
  avatar?: string;
  text: string;
  media?: { count: number };
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
    media: { count: 1 },
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
    reply: 3,
    repost: 1,
    like: 27,
    save: 9,
  },
];