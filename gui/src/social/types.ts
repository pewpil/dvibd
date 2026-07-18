export type Color = 'purple' | 'teal' | 'coral';

export type SocialUser = {
  id: string;
  email: string;
  username: string;
  bio?: string;
};

export type Post = {
  id: string;
  author: SocialUser;
  content: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
  comments: number;
  reposts: number;
};

export type FeedResponse = {
  posts: Post[];
};
