import { Prisma, type User } from "./generated/client.mts";

export type SafeUser = Pick<
  User,
  | "id"
  | "username"
  | "email"
  | "displayName"
  | "bio"
  | "website"
  | "avatarUrl"
  | "coverUrl"
  | "isFallback"
  | "createdAt"
>;

export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  bio: true,
  website: true,
  avatarUrl: true,
  coverUrl: true,
  isFallback: true,
  createdAt: true,
};

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    bio: user.bio,
    website: user.website,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    isFallback: user.isFallback,
    createdAt: user.createdAt,
  };
}
