import { Prisma, type User } from "./generated/client.mts";

export type SafeUser = Pick<
  User,
  "id" | "username" | "email" | "displayName" | "createdAt"
>;

export const USER_SELECT: Prisma.UserSelect = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  createdAt: true,
};

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}
