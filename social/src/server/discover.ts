import { query } from "@solidjs/router";
import type {
  CommunitySummary,
  HappeningSummary,
  SuggestedProfile,
  TrendTopic,
} from "../types/social";
import { prisma } from "./db";
import { compactCount } from "./format";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

function postCount(value: number): string {
  return `${compactCount(value)} ${value === 1 ? "post" : "posts"}`;
}

function memberCount(value: number): string {
  return `${compactCount(value)} ${value === 1 ? "member" : "members"}`;
}

export const getTrending = query(async (): Promise<TrendTopic[]> => {
  "use server";
  const tags = await prisma.tag.findMany({
    where: { posts: { some: {} } },
    take: 4,
    orderBy: [{ posts: { _count: "desc" } }, { name: "asc" }],
    include: { _count: { select: { posts: true } } },
  });
  return tags.map((tag, index) => ({
    rank: index + 1,
    tag: tag.name,
    posts: postCount(tag._count.posts),
  }));
}, "socialTrending");

export const getTagNames = query(async (): Promise<string[]> => {
  "use server";
  const tags = await prisma.tag.findMany({
    take: 8,
    orderBy: [{ posts: { _count: "desc" } }, { name: "asc" }],
    select: { name: true },
  });
  return tags.map((tag) => tag.name);
}, "socialTagNames");

export const getSuggestedProfiles = query(
  async (): Promise<SuggestedProfile[]> => {
    "use server";
    const user: SafeUser | null = await readSessionUser();
    const rows = await prisma.user.findMany({
      where:
        user === null
          ? {}
          : {
              id: { not: user.id },
              followers: { none: { followerId: user.id } },
            },
      orderBy: [{ followers: { _count: "desc" } }, { username: "asc" }],
      take: 3,
      select: { username: true, displayName: true },
    });
    return rows.map((row) => ({
      name: row.displayName ?? row.username,
      handle: row.username,
    }));
  },
  "socialSuggestedProfiles",
);

export const getCommunities = query(async (): Promise<CommunitySummary[]> => {
  "use server";
  const rows = await prisma.community.findMany({
    take: 3,
    orderBy: [{ members: { _count: "desc" } }, { name: "asc" }],
    include: { _count: { select: { members: true } } },
  });
  return rows.map((row) => ({
    name: row.name,
    members: memberCount(row._count.members),
  }));
}, "socialCommunities");

export const getHappenings = query(
  async (): Promise<HappeningSummary[]> => {
    "use server";
    const rows = await prisma.happening.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        tag: { include: { _count: { select: { posts: true } } } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      meta:
        row.tag === null
          ? []
          : [row.tag.name, postCount(row.tag._count.posts)],
    }));
  },
  "socialHappenings",
);
