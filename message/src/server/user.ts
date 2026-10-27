import { Prisma, type User } from "./generated/client.mts";

export type SafeUser = Pick<
  User,
  | "id"
  | "username"
  | "email"
  | "displayName"
  | "avatarUrl"
  | "bio"
  | "website"
  | "headline"
  | "lastSeenAt"
  | "createdAt"
>;

export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  website: true,
  headline: true,
  lastSeenAt: true,
  createdAt: true,
};

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    website: user.website,
    headline: user.headline,
    lastSeenAt: user.lastSeenAt,
    createdAt: user.createdAt,
  };
}
