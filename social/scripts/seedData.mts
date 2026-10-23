import { genSalt, hash } from "bcrypt";
import { randomBytes } from "node:crypto";
import type { PostKind } from "../src/server/generated/client.mts";
import { prisma } from "../src/server/db";
import { hoursAgo } from "../src/server/format";
import { syncPostTags } from "../src/server/postTags";

interface FixturePerson {
  username: string;
  name: string;
}

interface SeedPost {
  author: string;
  text: string;
  kind: PostKind;
  ageHours: number;
  media: number;
  reply: number;
  repost: number;
  like: number;
  save: number;
}

interface SeedCommunity {
  name: string;
  description: string;
  members: string[];
}

interface SeedHappening {
  title: string;
  tag: string;
  ageHours: number;
}

const FIXTURE_PEOPLE: FixturePerson[] = [
  { username: "ariachen", name: "Aria Chen" },
  { username: "marcuslee", name: "Marcus Lee" },
  { username: "sofia.reyes", name: "Sofia Reyes" },
  { username: "dvibd", name: "dvibd" },
  { username: "liampark", name: "Liam Park" },
  { username: "noahb", name: "Noah Bennett" },
  { username: "mia.ortiz", name: "Mia Ortiz" },
  { username: "ethancole", name: "Ethan Cole" },
  { username: "zoe.n", name: "Zoe Nakamura" },
  { username: "owenfrost", name: "Owen Frost" },
  { username: "isla.r", name: "Isla Romano" },
  { username: "calebs", name: "Caleb Singh" },
  { username: "ava.l", name: "Ava Lindqvist" },
  { username: "theom", name: "Theo Marchetti" },
  { username: "norah", name: "Nora Haddad" },
  { username: "jonahr", name: "Jonah Reyes" },
  { username: "priya.a", name: "Priya Anand" },
  { username: "felixb", name: "Felix Bauer" },
];

const SEED_POSTS: SeedPost[] = [
  {
    author: "ariachen",
    text: "Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd",
    kind: "STAT",
    ageHours: 2,
    media: 1,
    reply: 12,
    repost: 5,
    like: 48,
    save: 3,
  },
  {
    author: "marcuslee",
    text: "SolidStart v2 with fine-grained reactivity is genuinely a joy to build with. #SolidStart #WebDev #OpenSource",
    kind: "ARTICLE",
    ageHours: 5,
    media: 7,
    reply: 8,
    repost: 22,
    like: 130,
    save: 15,
  },
  {
    author: "sofia.reyes",
    text: "Spent the morning drawing icons. Lexend for headings, Rethink Sans for body, such a clean pairing. #dvibd",
    kind: "STAT",
    ageHours: 8,
    media: 0,
    reply: 3,
    repost: 1,
    like: 27,
    save: 9,
  },
];

const SEED_COMMUNITIES: SeedCommunity[] = [
  {
    name: "SolidJS",
    description: "Signals, routing, and SolidStart builds.",
    members: [
      "ariachen",
      "marcuslee",
      "sofia.reyes",
      "dvibd",
      "ethancole",
      "zoe.n",
      "owenfrost",
      "priya.a",
    ],
  },
  {
    name: "Design Tokens",
    description: "Type, color, and spacing systems that scale.",
    members: ["sofia.reyes", "isla.r", "calebs", "ava.l", "norah", "felixb"],
  },
  {
    name: "Indie Hacking",
    description: "Small teams shipping calm, useful software.",
    members: ["marcuslee", "noahb", "mia.ortiz", "jonahr"],
  },
];

const SEED_HAPPENINGS: SeedHappening[] = [
  { title: "dvibd launches its public API", tag: "dvibd", ageHours: 1 },
  {
    title: "SolidStart v2 conference talks published",
    tag: "SolidStart",
    ageHours: 5,
  },
  {
    title: "Community fundraiser for open-source fonts",
    tag: "Design",
    ageHours: 24,
  },
];

const SEED_FOLLOWS: ReadonlyArray<readonly [string, string]> = [
  ["marcuslee", "ariachen"],
  ["sofia.reyes", "ariachen"],
  ["dvibd", "ariachen"],
  ["liampark", "ariachen"],
  ["mia.ortiz", "ariachen"],
  ["noahb", "ariachen"],
  ["ariachen", "marcuslee"],
  ["sofia.reyes", "marcuslee"],
  ["ethancole", "marcuslee"],
  ["zoe.n", "marcuslee"],
  ["owenfrost", "marcuslee"],
  ["ariachen", "sofia.reyes"],
  ["marcuslee", "sofia.reyes"],
  ["isla.r", "sofia.reyes"],
  ["calebs", "sofia.reyes"],
  ["theom", "norah"],
  ["norah", "theom"],
  ["jonahr", "norah"],
  ["felixb", "priya.a"],
  ["ava.l", "zoe.n"],
];

async function main(): Promise<void> {
  const existing: number = await prisma.user.count({
    where: { isFallback: true },
  });
  if (existing > 0) {
    console.log("Seed skipped: fallback data already exists.");
    return;
  }

  const now = new Date();
  const passwordHash: string = await hash(
    randomBytes(32).toString("hex"),
    await genSalt(),
  );

  const userIdByHandle = new Map<string, string>();
  for (const person of FIXTURE_PEOPLE) {
    const user = await prisma.user.create({
      data: {
        username: person.username,
        displayName: person.name,
        email: `${person.username}@dvibd.local`,
        passwordHash: passwordHash,
        isFallback: true,
      },
      select: { id: true },
    });
    userIdByHandle.set(person.username, user.id);
  }

  for (const seed of SEED_POSTS) {
    const authorId: string | undefined = userIdByHandle.get(seed.author);
    if (authorId === undefined) {
      continue;
    }
    const post = await prisma.post.create({
      data: {
        authorId: authorId,
        kind: seed.kind,
        text: seed.text,
        replyCount: seed.reply,
        repostCount: seed.repost,
        likeCount: seed.like,
        saveCount: seed.save,
        isFallback: true,
        createdAt: hoursAgo(seed.ageHours, now),
      },
      select: { id: true },
    });
    await syncPostTags(post.id, seed.text);
    if (seed.media > 0) {
      await prisma.postMedia.createMany({
        data: Array.from({ length: seed.media }, (_, index) => ({
          postId: post.id,
          index: index,
        })),
      });
    }
  }

  for (const community of SEED_COMMUNITIES) {
    const row = await prisma.community.create({
      data: {
        name: community.name,
        description: community.description,
        isFallback: true,
      },
      select: { id: true },
    });
    const memberships = community.members.flatMap((handle) => {
      const userId: string | undefined = userIdByHandle.get(handle);
      if (userId === undefined) {
        return [];
      }
      return [{ userId: userId, communityId: row.id }];
    });
    if (memberships.length > 0) {
      await prisma.communityMember.createMany({ data: memberships });
    }
  }

  for (const happening of SEED_HAPPENINGS) {
    const tag = await prisma.tag.upsert({
      where: { name: happening.tag },
      create: { name: happening.tag },
      update: {},
    });
    await prisma.happening.create({
      data: {
        title: happening.title,
        tagId: tag.id,
        isFallback: true,
        createdAt: hoursAgo(happening.ageHours, now),
      },
    });
  }

  const follows = SEED_FOLLOWS.flatMap((pair) => {
    const followerId: string | undefined = userIdByHandle.get(pair[0]);
    const followeeId: string | undefined = userIdByHandle.get(pair[1]);
    if (followerId === undefined || followeeId === undefined) {
      return [];
    }
    return [{ followerId: followerId, followeeId: followeeId }];
  });
  if (follows.length > 0) {
    await prisma.follow.createMany({ data: follows });
  }

  console.log(
    `Seed complete: ${FIXTURE_PEOPLE.length} people, ${SEED_POSTS.length} posts, ${SEED_COMMUNITIES.length} communities, ${SEED_HAPPENINGS.length} happenings, ${follows.length} follows.`,
  );
}

await main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
