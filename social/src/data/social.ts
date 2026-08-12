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