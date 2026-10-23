import type { NotificationKind } from "../server/generated/client.mts";

export type FeedMode = "discover" | "following";

export const MAX_STAT_LENGTH: number = 256;

export type CreatePostResult = { ok: true } | { ok: false; error: string };

export interface PostCard {
  id: string;
  name: string;
  handle: string;
  time: string;
  avatar?: string;
  text: string;
  type: "stat" | "article";
  media?: { count: number };
  reply: number;
  repost: number;
  like: number;
  save: number;
}

export interface TrendTopic {
  rank: number;
  tag: string;
  posts: string;
}

export interface SuggestedProfile {
  name: string;
  handle: string;
}

export interface CommunitySummary {
  name: string;
  members: string;
}

export interface HappeningSummary {
  id: string;
  title: string;
  meta: string[];
}

export interface NotificationCard {
  id: string;
  actor: string;
  handle: string;
  avatar?: string;
  action: string;
  time: string;
  kind: NotificationKind;
  isFallback: boolean;
}

export interface ProfileView {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  website: string;
  following: number;
  followers: number;
}

export interface ProfilePage {
  profile: ProfileView;
  posts: PostCard[];
  replies: PostCard[];
  media: PostCard[];
  likes: PostCard[];
}
