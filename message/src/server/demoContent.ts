import { prisma } from "./db";

const MINUTE_MS: number = 60_000;
const HOUR_MS: number = 60 * MINUTE_MS;

interface CommunityRef {
  id: string;
  name: string;
}

interface DirectMessageSeed {
  fromSelf: boolean;
  text: string;
  ageMinutes: number;
}

interface DirectSeed {
  username: string;
  messages: DirectMessageSeed[];
}

const COMMUNITY_NAMES: string[] = [
  "SolidJS",
  "Design Tokens",
  "Indie Hacking",
];

const CHANNEL_KEYS: { community: string; slug: string }[] = [
  { community: "SolidJS", slug: "general" },
  { community: "Design Tokens", slug: "design-critique" },
  { community: "Indie Hacking", slug: "random" },
];

const FIXTURE_HANDLES: string[] = [
  "ariachen",
  "marcuslee",
  "sofia.reyes",
  "priya.a",
];

const DIRECT_SEEDS: DirectSeed[] = [
  {
    username: "ariachen",
    messages: [
      {
        fromSelf: false,
        text: "Hey, good to see you on the message app. How is the new layout treating you?",
        ageMinutes: 4320,
      },
      {
        fromSelf: true,
        text: "Better than expected. The three columns finally feel balanced.",
        ageMinutes: 4260,
      },
      {
        fromSelf: false,
        text: "The sticky headers help a lot once the thread gets long.",
        ageMinutes: 4200,
      },
      {
        fromSelf: true,
        text: "I noticed that too. I also like that unread counts only show for channels I joined.",
        ageMinutes: 3000,
      },
      {
        fromSelf: false,
        text: "That was deliberate. Channels you have not joined stay quiet.",
        ageMinutes: 2940,
      },
      {
        fromSelf: true,
        text: "Makes the sidebar much easier to scan.",
        ageMinutes: 2880,
      },
      {
        fromSelf: false,
        text: "Send me a note when you have tried the shared files panel.",
        ageMinutes: 180,
      },
    ],
  },
  {
    username: "marcuslee",
    messages: [
      {
        fromSelf: false,
        text: "Morning. Did the direct message flow work for you on first load?",
        ageMinutes: 2880,
      },
      {
        fromSelf: true,
        text: "It did. The conversation list picked up our thread right away.",
        ageMinutes: 2820,
      },
      {
        fromSelf: false,
        text: "Good. I am still tuning the presence dot timing.",
        ageMinutes: 2760,
      },
      {
        fromSelf: true,
        text: "Two minutes for online feels right to me.",
        ageMinutes: 1440,
      },
      {
        fromSelf: false,
        text: "Agreed. Idle at ten minutes keeps it from flickering.",
        ageMinutes: 1380,
      },
      {
        fromSelf: true,
        text: "I will keep an eye on it during the week.",
        ageMinutes: 720,
      },
    ],
  },
  {
    username: "sofia.reyes",
    messages: [
      {
        fromSelf: false,
        text: "The shared files list is live in the info panel. Worth a look.",
        ageMinutes: 5760,
      },
      {
        fromSelf: true,
        text: "Just opened it. The extension labels read well.",
        ageMinutes: 5700,
      },
      {
        fromSelf: false,
        text: "Sizes come from the upload record, so they stay accurate.",
        ageMinutes: 5640,
      },
      {
        fromSelf: true,
        text: "Nice. Links show the domain too.",
        ageMinutes: 4320,
      },
      {
        fromSelf: false,
        text: "Small detail, but it saves a click.",
        ageMinutes: 4260,
      },
      {
        fromSelf: true,
        text: "I will test the mute toggle next.",
        ageMinutes: 4200,
      },
      {
        fromSelf: false,
        text: "Mute only hides the badge, the thread stays in the list.",
        ageMinutes: 300,
      },
    ],
  },
];

function minutesAgo(minutes: number, now: Date): Date {
  return new Date(now.getTime() - minutes * MINUTE_MS);
}

function hoursAgo(hours: number, now: Date): Date {
  return new Date(now.getTime() - hours * HOUR_MS);
}

export async function generateMessageDemoContent(
  userId: string,
): Promise<void> {
  const existingDirect: number = await prisma.message.count({
    where: {
      isFallback: true,
      conversation: { kind: "DIRECT", participants: { some: { userId } } },
    },
  });
  if (existingDirect > 0) {
    return;
  }

  const communityRows: CommunityRef[] = await prisma.community.findMany({
    where: { name: { in: COMMUNITY_NAMES } },
    select: { id: true, name: true },
  });
  const communityByName: Map<string, CommunityRef> = new Map(
    communityRows.map((row: CommunityRef): [string, CommunityRef] => [
      row.name,
      row,
    ]),
  );
  const solidjs: CommunityRef | undefined = communityByName.get("SolidJS");
  const designTokens: CommunityRef | undefined =
    communityByName.get("Design Tokens");
  const indieHacking: CommunityRef | undefined =
    communityByName.get("Indie Hacking");
  if (
    solidjs === undefined ||
    designTokens === undefined ||
    indieHacking === undefined
  ) {
    return;
  }

  const fixtureRows: { id: string; username: string }[] =
    await prisma.user.findMany({
      where: { username: { in: FIXTURE_HANDLES } },
      select: { id: true, username: true },
    });
  if (fixtureRows.length < FIXTURE_HANDLES.length) {
    return;
  }
  const userByHandle: Map<string, string> = new Map(
    fixtureRows.map((row: { id: string; username: string }): [string, string] => [
      row.username,
      row.id,
    ]),
  );

  const now: Date = new Date();
  const channelJoinedAt: Date = new Date(now);
  const channelLastReadAt: Date = hoursAgo(5, now);

  await prisma.communityMember.createMany({
    data: [
      { userId: userId, communityId: solidjs.id },
      { userId: userId, communityId: designTokens.id },
      { userId: userId, communityId: indieHacking.id },
    ],
    skipDuplicates: true,
  });

  const communityIdByKey: Map<string, string> = new Map([
    ["SolidJS", solidjs.id],
    ["Design Tokens", designTokens.id],
    ["Indie Hacking", indieHacking.id],
  ]);
  for (const channel of CHANNEL_KEYS) {
    const communityId: string | undefined = communityIdByKey.get(
      channel.community,
    );
    if (communityId === undefined) {
      continue;
    }
    const conversation: { id: string } | null =
      await prisma.conversation.findUnique({
        where: {
          communityId_slug: { communityId: communityId, slug: channel.slug },
        },
        select: { id: true },
      });
    if (conversation === null) {
      continue;
    }
    await prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: {
          conversationId: conversation.id,
          userId: userId,
        },
      },
      create: {
        conversationId: conversation.id,
        userId: userId,
        role: "MEMBER",
        joinedAt: channelJoinedAt,
        lastReadAt: channelLastReadAt,
        isMuted: false,
      },
      update: {
        role: "MEMBER",
        joinedAt: channelJoinedAt,
        lastReadAt: channelLastReadAt,
        isMuted: false,
        leftAt: null,
      },
    });
  }

  for (const seed of DIRECT_SEEDS) {
    const targetId: string | undefined = userByHandle.get(seed.username);
    if (targetId === undefined) {
      continue;
    }
    const directKey: string = [userId, targetId].sort().join(":");
    const existing: { id: string } | null = await prisma.conversation.findUnique(
      {
        where: { directKey: directKey },
        select: { id: true },
      },
    );
    if (existing !== null) {
      continue;
    }

    const oldestAge: number = seed.messages.reduce(
      (oldest: number, message: DirectMessageSeed): number =>
        Math.max(oldest, message.ageMinutes),
      0,
    );
    const joinedAt: Date = minutesAgo(oldestAge + 120, now);
    const conversation: { id: string } = await prisma.conversation.create({
      data: {
        kind: "DIRECT",
        directKey: directKey,
        createdById: userId,
        isFallback: true,
        participants: {
          create: [
            { userId: userId, role: "MEMBER", joinedAt: joinedAt },
            { userId: targetId, role: "MEMBER", joinedAt: joinedAt },
          ],
        },
      },
      select: { id: true },
    });

    let lastMessageAt: Date = joinedAt;
    for (const [index, message] of seed.messages.entries()) {
      const createdAt: Date = minutesAgo(message.ageMinutes, now);
      const senderId: string = message.fromSelf ? userId : targetId;
      const recipientId: string = message.fromSelf ? targetId : userId;
      const deliveredAt: Date = new Date(createdAt.getTime() + 4 * MINUTE_MS);
      const readAt: Date | null =
        index >= seed.messages.length - 2
          ? null
          : new Date(createdAt.getTime() + 20 * MINUTE_MS);
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: senderId,
          text: message.text,
          createdAt: createdAt,
          isFallback: true,
          receipts: {
            create: [
              {
                userId: recipientId,
                deliveredAt: deliveredAt,
                readAt: readAt,
              },
            ],
          },
        },
      });
      if (createdAt.getTime() > lastMessageAt.getTime()) {
        lastMessageAt = createdAt;
      }
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: lastMessageAt },
    });
  }
}
