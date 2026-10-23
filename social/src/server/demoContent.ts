import type { NotificationKind, PostKind } from "./generated/client.mts";
import { prisma } from "./db";
import { daysAgo, hoursAgo, minutesAgo } from "./format";

interface DemoPostSeed {
  kind: PostKind;
  text: string;
  createdAt: Date;
  media: number;
  reply: number;
  repost: number;
  like: number;
  save: number;
  parentId: string | null;
}

interface DemoNotificationSeed {
  handle: string;
  kind: NotificationKind;
  createdAt: Date;
  community: boolean;
}

export async function generateDemoContent(userId: string): Promise<void> {
  const existing: number = await prisma.post.count({
    where: { authorId: userId, isFallback: true },
  });
  if (existing > 0) {
    return;
  }
  const fixtures = await prisma.user.findMany({
    where: { isFallback: true },
    select: { id: true, username: true },
  });
  if (fixtures.length === 0) {
    return;
  }
  const userByHandle = new Map(
    fixtures.map((fixture) => [fixture.username, fixture.id]),
  );
  const community = await prisma.community.findFirst({
    where: { name: "SolidJS" },
    select: { id: true },
  });
  const parent = await prisma.post.findFirst({
    where: {
      author: { username: "ariachen" },
      text: { startsWith: "Just shipped the new feed layout" },
    },
    select: { id: true },
  });

  const now = new Date();
  const postSeeds: DemoPostSeed[] = [
    {
      kind: "STAT",
      text: "Slow social means every post gets room to breathe. No feeds that punish you for stepping away.",
      createdAt: hoursAgo(1, now),
      media: 3,
      reply: 4,
      repost: 12,
      like: 89,
      save: 6,
      parentId: null,
    },
    {
      kind: "STAT",
      text: "The profile page is coming together. Cover, card, and tabs that stick right under the header.",
      createdAt: hoursAgo(3, now),
      media: 0,
      reply: 2,
      repost: 1,
      like: 21,
      save: 0,
      parentId: null,
    },
    {
      kind: "ARTICLE",
      text: "We settled on the design tokens this week: Lexend for headings, Rethink Sans for body, one primary.",
      createdAt: hoursAgo(6, now),
      media: 0,
      reply: 1,
      repost: 3,
      like: 17,
      save: 2,
      parentId: null,
    },
    {
      kind: "STAT",
      text: "Completely agree. The calmer pace makes each post count more.",
      createdAt: hoursAgo(9, now),
      media: 0,
      reply: 0,
      repost: 0,
      like: 5,
      save: 0,
      parentId: parent === null ? null : parent.id,
    },
  ];

  for (const seed of postSeeds) {
    const post = await prisma.post.create({
      data: {
        authorId: userId,
        kind: seed.kind,
        text: seed.text,
        parentId: seed.parentId,
        replyCount: seed.reply,
        repostCount: seed.repost,
        likeCount: seed.like,
        saveCount: seed.save,
        isFallback: true,
        createdAt: seed.createdAt,
      },
      select: { id: true },
    });
    if (seed.media > 0) {
      await prisma.postMedia.createMany({
        data: Array.from({ length: seed.media }, (_, index) => ({
          postId: post.id,
          index: index,
        })),
      });
    }
  }

  const notificationSeeds: DemoNotificationSeed[] = [
    { handle: "marcuslee", kind: "LIKED_POST", createdAt: minutesAgo(12, now), community: false },
    { handle: "sofia.reyes", kind: "REPLIED", createdAt: minutesAgo(40, now), community: false },
    { handle: "ariachen", kind: "FOLLOWED", createdAt: hoursAgo(2, now), community: false },
    { handle: "dvibd", kind: "MENTIONED_COMMUNITY", createdAt: hoursAgo(5, now), community: true },
    { handle: "liampark", kind: "LIKED_POST", createdAt: hoursAgo(6, now), community: false },
    { handle: "noahb", kind: "REPOSTED", createdAt: hoursAgo(7, now), community: false },
    { handle: "mia.ortiz", kind: "FOLLOWED", createdAt: hoursAgo(9, now), community: false },
    { handle: "ethancole", kind: "REPLIED", createdAt: hoursAgo(11, now), community: false },
    { handle: "zoe.n", kind: "LIKED_COMMENT", createdAt: hoursAgo(13, now), community: false },
    { handle: "owenfrost", kind: "MENTIONED", createdAt: hoursAgo(15, now), community: false },
    { handle: "isla.r", kind: "FOLLOWED", createdAt: hoursAgo(18, now), community: false },
    { handle: "calebs", kind: "LIKED_POST", createdAt: hoursAgo(20, now), community: false },
    { handle: "ava.l", kind: "REPOSTED", createdAt: hoursAgo(22, now), community: false },
    { handle: "theom", kind: "REPLIED", createdAt: daysAgo(1, now), community: false },
    { handle: "norah", kind: "FOLLOWED", createdAt: daysAgo(1, now), community: false },
    { handle: "jonahr", kind: "LIKED_POST", createdAt: daysAgo(1, now), community: false },
    { handle: "priya.a", kind: "MENTIONED_COMMUNITY", createdAt: daysAgo(2, now), community: true },
    { handle: "felixb", kind: "REPOSTED", createdAt: daysAgo(2, now), community: false },
  ];

  const notifications = notificationSeeds.flatMap((seed) => {
    const actorId: string | undefined = userByHandle.get(seed.handle);
    if (actorId === undefined) {
      return [];
    }
    return [
      {
        recipientId: userId,
        actorId: actorId,
        kind: seed.kind,
        communityId: seed.community ? (community?.id ?? null) : null,
        isFallback: true,
        createdAt: seed.createdAt,
      },
    ];
  });
  if (notifications.length > 0) {
    await prisma.notification.createMany({ data: notifications });
  }

  const savedCandidates = await prisma.post.findMany({
    where: {
      isFallback: true,
      author: { username: { in: ["ariachen", "marcuslee"] } },
    },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  const bookmarks = savedCandidates
    .slice(0, 2)
    .map((post, index) => ({
      userId: userId,
      postId: post.id,
      isFallback: true,
      createdAt:
        index === 0 ? minutesAgo(30, now) : daysAgo(2, now),
    }));
  if (bookmarks.length > 0) {
    await prisma.bookmark.createMany({ data: bookmarks });
  }
}
