import { prisma } from "../src/server/db";
import type {
  AttachmentKind,
  ConversationRole,
} from "../src/server/generated/client.mts";

interface FixtureRole {
  username: string;
  headline: string;
}

interface CommunityFixture {
  name: string;
  avatarUrl: string;
}

interface CommunityRow {
  id: string;
  name: string;
  avatarUrl: string | null;
}

interface UserRow {
  id: string;
  username: string;
  headline: string | null;
}

interface SeedAttachment {
  kind: AttachmentKind;
  url: string;
  name: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  extension: string | null;
  domain: string | null;
}

interface SeedMessage {
  author: string;
  text: string;
  ageHours: number;
  attachment?: SeedAttachment;
}

interface SeedChannel {
  community: string;
  slug: string;
  title: string;
  description: string;
  participants: string[];
  messages: SeedMessage[];
}

interface ParticipantRow {
  conversationId: string;
  userId: string;
  role: ConversationRole;
  joinedAt: Date;
}

interface ReceiptRow {
  messageId: string;
  userId: string;
  deliveredAt: Date;
  readAt: Date | null;
}

const MINUTE_MS: number = 60_000;
const HOUR_MS: number = 60 * MINUTE_MS;

const FIXTURE_ROLES: FixtureRole[] = [
  { username: "ariachen", headline: "Product Designer" },
  { username: "marcuslee", headline: "Lead Architect" },
  { username: "sofia.reyes", headline: "Design Systems Lead" },
  { username: "dvibd", headline: "Open Source Maintainer" },
  { username: "liampark", headline: "Frontend Engineer" },
  { username: "noahb", headline: "Backend Engineer" },
  { username: "mia.ortiz", headline: "Product Manager" },
  { username: "ethancole", headline: "Platform Engineer" },
  { username: "zoe.n", headline: "Accessibility Engineer" },
  { username: "owenfrost", headline: "Developer Advocate" },
  { username: "isla.r", headline: "Design Engineer" },
  { username: "calebs", headline: "Build Engineer" },
  { username: "ava.l", headline: "UX Researcher" },
  { username: "theom", headline: "API Designer" },
  { username: "norah", headline: "Design Lead" },
  { username: "jonahr", headline: "Data Engineer" },
  { username: "priya.a", headline: "Site Reliability Engineer" },
  { username: "felixb", headline: "QA Lead" },
];

const COMMUNITY_FIXTURES: CommunityFixture[] = [
  { name: "SolidJS", avatarUrl: "/community-core.svg" },
  { name: "Design Tokens", avatarUrl: "/community-design.svg" },
  { name: "Indie Hacking", avatarUrl: "/community-engineering.svg" },
];

const ATTACHMENT_LAYOUT_IMAGE: SeedAttachment = {
  kind: "IMAGE",
  url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
  name: "message-layout-spec-v2.png",
  mimeType: "image/png",
  sizeBytes: 1_468_006,
  extension: "PNG",
  domain: null,
};

const ATTACHMENT_INFO_IMAGE: SeedAttachment = {
  kind: "IMAGE",
  url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80",
  name: "conversation-info-spec-v1.png",
  mimeType: "image/png",
  sizeBytes: 1_003_520,
  extension: "PNG",
  domain: null,
};

const ATTACHMENT_ARCHITECTURE_PDF: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/message-architecture.pdf",
  name: "message-architecture.pdf",
  mimeType: "application/pdf",
  sizeBytes: 3_355_443,
  extension: "PDF",
  domain: null,
};

const ATTACHMENT_SCROLL_NOTES: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/message-stream-scroll-notes.md",
  name: "message-stream-scroll-notes.md",
  mimeType: "text/markdown",
  sizeBytes: 6_144,
  extension: "MD",
  domain: null,
};

const ATTACHMENT_PRESENCE_SKETCH: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/presence-dot-spec.sketch",
  name: "presence-dot-spec.sketch",
  mimeType: "application/x-sketch",
  sizeBytes: 2_516_582,
  extension: "SKETCH",
  domain: null,
};

const ATTACHMENT_BADGE_MOTION: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/unread-badge-motion.mp4",
  name: "unread-badge-motion.mp4",
  mimeType: "video/mp4",
  sizeBytes: 9_122_611,
  extension: "MP4",
  domain: null,
};

const ATTACHMENT_USABILITY_XLSX: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/usability-findings.xlsx",
  name: "usability-findings.xlsx",
  mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  sizeBytes: 215_040,
  extension: "XLSX",
  domain: null,
};

const ATTACHMENT_TOKEN_PALETTE: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/design-tokens-palette.json",
  name: "design-tokens-palette.json",
  mimeType: "application/json",
  sizeBytes: 43_008,
  extension: "JSON",
  domain: null,
};

const ATTACHMENT_AVATARS_SVG: SeedAttachment = {
  kind: "FILE",
  url: "https://files.dvibd.dev/fixtures/avatars-pack.svg",
  name: "avatars-pack.svg",
  mimeType: "image/svg+xml",
  sizeBytes: 348_160,
  extension: "SVG",
  domain: null,
};

const ATTACHMENT_TURBOPACK_LINK: SeedAttachment = {
  kind: "LINK",
  url: "https://nextjs.org/docs/architecture/turbopack",
  name: "Turbopack Migration Guide",
  mimeType: null,
  sizeBytes: null,
  extension: null,
  domain: "nextjs.org",
};

const ATTACHMENT_WCAG_LINK: SeedAttachment = {
  kind: "LINK",
  url: "https://www.w3.org/WAI/WCAG22/quickref/",
  name: "WCAG 2.2 Quick Reference",
  mimeType: null,
  sizeBytes: null,
  extension: null,
  domain: "w3.org",
};

const ATTACHMENT_PRISMA_LINK: SeedAttachment = {
  kind: "LINK",
  url: "https://github.com/pewpil/dvibd/blob/main/orm/prisma/schema.prisma",
  name: "Prisma schema: orm/prisma/schema.prisma",
  mimeType: null,
  sizeBytes: null,
  extension: null,
  domain: "github.com",
};

const ATTACHMENT_REPO_LINK: SeedAttachment = {
  kind: "LINK",
  url: "https://github.com/pewpil/dvibd",
  name: "GitHub: dvibd repository",
  mimeType: null,
  sizeBytes: null,
  extension: null,
  domain: "github.com",
};

const SEED_CHANNELS: SeedChannel[] = [
  {
    community: "SolidJS",
    slug: "general",
    title: "general",
    description: "General chat for the SolidJS community.",
    participants: ["ariachen", "marcuslee", "dvibd", "ethancole", "zoe.n"],
    messages: [
      {
        author: "ariachen",
        text: "Morning all. The new signals docs went up last night, worth a read before the call.",
        ageHours: 3,
      },
      {
        author: "marcuslee",
        text: "Read them at breakfast. The memo section finally explains why comparisons are tracked.",
        ageHours: 2.6,
      },
      {
        author: "dvibd",
        text: "Bookmarked the page so it shows up in the resources list.",
        ageHours: 2.2,
      },
      {
        author: "ethancole",
        text: "Anyone else running SolidStart on Node 24 in CI? Our build times dropped by half.",
        ageHours: 1.1,
      },
      {
        author: "ariachen",
        text: "Same here, only the cold install is slow now.",
        ageHours: 0.6,
      },
    ],
  },
  {
    community: "SolidJS",
    slug: "solidstart",
    title: "solidstart",
    description: "Routing, data loading, and server functions in SolidStart.",
    participants: ["marcuslee", "priya.a", "owenfrost", "ethancole"],
    messages: [
      {
        author: "marcuslee",
        text: "Draft of the routing and loading story is attached, comments welcome.",
        ageHours: 26,
        attachment: ATTACHMENT_ARCHITECTURE_PDF,
      },
      {
        author: "priya.a",
        text: "Read it. Server functions living next to the route keep the client bundle small.",
        ageHours: 24,
      },
      {
        author: "owenfrost",
        text: "I can turn that into a short docs page this week.",
        ageHours: 9,
      },
      {
        author: "ethancole",
        text: "Ping me when it lands, the starter template should link it.",
        ageHours: 3.5,
      },
    ],
  },
  {
    community: "SolidJS",
    slug: "frontend-infra",
    title: "frontend-infra",
    description: "Build tooling, bundlers, and CI for the frontend apps.",
    participants: [
      "ethancole",
      "priya.a",
      "zoe.n",
      "marcuslee",
      "dvibd",
      "owenfrost",
    ],
    messages: [
      {
        author: "ethancole",
        text: "Bumped the shared tooling to the current Node LTS across all three apps.",
        ageHours: 118,
      },
      {
        author: "priya.a",
        text: "Useful reference for the build tooling question we had last week.",
        ageHours: 110,
        attachment: ATTACHMENT_TURBOPACK_LINK,
      },
      {
        author: "ethancole",
        text: "No pipeline change needed, the build image already pins the same version.",
        ageHours: 104,
      },
      {
        author: "zoe.n",
        text: "The docs site still lists the old version in the setup guide.",
        ageHours: 48,
      },
      {
        author: "dvibd",
        text: "Fixed the guide, thanks for catching that.",
        ageHours: 34,
      },
    ],
  },
  {
    community: "SolidJS",
    slug: "dev-standup",
    title: "dev-standup",
    description: "Async daily notes from the maintainers.",
    participants: ["dvibd", "priya.a", "zoe.n"],
    messages: [
      {
        author: "priya.a",
        text: "Standup: reviewed the migration plan, nothing blocked.",
        ageHours: 20,
      },
      {
        author: "dvibd",
        text: "Notes from the scroll audit are attached, the sticky headers behave on every viewport.",
        ageHours: 18,
        attachment: ATTACHMENT_SCROLL_NOTES,
      },
      {
        author: "zoe.n",
        text: "Standup: keyboard pass on the composer, two focus fixes queued.",
        ageHours: 16,
      },
    ],
  },
  {
    community: "Design Tokens",
    slug: "design-critique",
    title: "design-critique",
    description: "Weekly reviews of in-progress design work.",
    participants: ["sofia.reyes", "isla.r", "norah", "felixb"],
    messages: [
      {
        author: "sofia.reyes",
        text: "Proposal for the panel radius scale is ready for critique.",
        ageHours: 7,
      },
      {
        author: "isla.r",
        text: "Ran the token rename across the message app, no visual drift.",
        ageHours: 6.5,
      },
      {
        author: "norah",
        text: "The preview below shows how the conversation panel reads at 1440.",
        ageHours: 6,
        attachment: ATTACHMENT_LAYOUT_IMAGE,
      },
      {
        author: "felixb",
        text: "Sketch file for the presence dot spec is attached.",
        ageHours: 5,
        attachment: ATTACHMENT_PRESENCE_SKETCH,
      },
      {
        author: "sofia.reyes",
        text: "Motion sample for the unread badge is attached, it settles in 200ms.",
        ageHours: 4,
        attachment: ATTACHMENT_BADGE_MOTION,
      },
    ],
  },
  {
    community: "Design Tokens",
    slug: "accessibility",
    title: "accessibility",
    description: "Audits, WCAG notes, and focus state reviews.",
    participants: ["sofia.reyes", "ava.l", "felixb", "norah"],
    messages: [
      {
        author: "ava.l",
        text: "Findings from the usability round are attached, heading order is the main issue.",
        ageHours: 50,
        attachment: ATTACHMENT_USABILITY_XLSX,
      },
      {
        author: "norah",
        text: "Quick reference for the contrast rules is here if anyone needs it.",
        ageHours: 46,
        attachment: ATTACHMENT_WCAG_LINK,
      },
      {
        author: "felixb",
        text: "Contrast on secondary badges is now above 4.5:1 in both themes.",
        ageHours: 30,
      },
      {
        author: "sofia.reyes",
        text: "Focus rings are consistent across every control now.",
        ageHours: 12,
      },
    ],
  },
  {
    community: "Design Tokens",
    slug: "release-announcements",
    title: "release-announcements",
    description: "Token releases and changelog notes.",
    participants: ["norah", "sofia.reyes", "calebs"],
    messages: [
      {
        author: "norah",
        text: "Tokens v2.4 is out, the palette JSON is attached.",
        ageHours: 30,
        attachment: ATTACHMENT_TOKEN_PALETTE,
      },
      {
        author: "calebs",
        text: "Bumped the design package and regenerated the CSS modules.",
        ageHours: 28,
      },
      {
        author: "sofia.reyes",
        text: "No visual regressions in the message app after the update.",
        ageHours: 26,
      },
    ],
  },
  {
    community: "Indie Hacking",
    slug: "api-design",
    title: "api-design",
    description: "REST and GraphQL contracts for small teams.",
    participants: ["marcuslee", "noahb", "jonahr"],
    messages: [
      {
        author: "marcuslee",
        text: "Pagination draft for v2 is ready for comments.",
        ageHours: 40,
      },
      {
        author: "noahb",
        text: "Schema lives here if you want to see the relations.",
        ageHours: 36,
        attachment: ATTACHMENT_PRISMA_LINK,
      },
      {
        author: "jonahr",
        text: "Cursor pagination fits our event pipeline better than offsets.",
        ageHours: 33,
      },
      {
        author: "marcuslee",
        text: "Agreed, switching the draft to cursors.",
        ageHours: 8,
      },
    ],
  },
  {
    community: "Indie Hacking",
    slug: "changelog",
    title: "changelog",
    description: "Release notes from the small teams in this community.",
    participants: ["mia.ortiz", "marcuslee", "noahb"],
    messages: [
      {
        author: "mia.ortiz",
        text: "Release notes for this week are up.",
        ageHours: 96,
        attachment: ATTACHMENT_REPO_LINK,
      },
      {
        author: "marcuslee",
        text: "Nice, the migration note is the important part for self-hosted users.",
        ageHours: 92,
      },
      {
        author: "noahb",
        text: "Hotfix for the connection pool landed after that.",
        ageHours: 88,
      },
    ],
  },
  {
    community: "Indie Hacking",
    slug: "random",
    title: "random",
    description: "Off-topic chatter and side projects.",
    participants: ["noahb", "mia.ortiz", "jonahr"],
    messages: [
      {
        author: "jonahr",
        text: "Anyone else trying the new font pairing for their side project?",
        ageHours: 60,
      },
      {
        author: "mia.ortiz",
        text: "Lexend for headings and Rethink Sans for body, it reads well at small sizes.",
        ageHours: 57,
      },
      {
        author: "noahb",
        text: "Screenshot of the landing page draft, still deciding on the spacing.",
        ageHours: 54,
        attachment: ATTACHMENT_INFO_IMAGE,
      },
      {
        author: "jonahr",
        text: "Exported a small avatar set for the community, use it however you like.",
        ageHours: 50,
        attachment: ATTACHMENT_AVATARS_SVG,
      },
      {
        author: "mia.ortiz",
        text: "Design jam on Friday again?",
        ageHours: 26,
      },
      {
        author: "noahb",
        text: "I am in, same time as last week.",
        ageHours: 24,
      },
    ],
  },
];

function hoursAgo(hours: number, now: Date): Date {
  return new Date(now.getTime() - hours * HOUR_MS);
}

function requireCommunity(
  name: string,
  communities: Map<string, CommunityRow>,
): CommunityRow {
  const community: CommunityRow | undefined = communities.get(name);
  if (community === undefined) {
    throw new Error(
      `Missing social fixture community "${name}". Run \`cd social && npm run db:seed\` first.`,
    );
  }
  return community;
}

function requireUser(
  username: string,
  users: Map<string, UserRow>,
): UserRow {
  const user: UserRow | undefined = users.get(username);
  if (user === undefined) {
    throw new Error(
      `Missing social fixture user "${username}". Run \`cd social && npm run db:seed\` first.`,
    );
  }
  return user;
}

async function backfillHeadlines(
  users: Map<string, UserRow>,
): Promise<number> {
  let updated: number = 0;
  for (const role of FIXTURE_ROLES) {
    const user: UserRow = requireUser(role.username, users);
    if (user.headline !== null) {
      continue;
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { headline: role.headline },
    });
    updated += 1;
  }
  return updated;
}

async function backfillCommunityAvatars(
  communities: Map<string, CommunityRow>,
): Promise<number> {
  let updated: number = 0;
  for (const fixture of COMMUNITY_FIXTURES) {
    const community: CommunityRow = requireCommunity(fixture.name, communities);
    if (community.avatarUrl !== null) {
      continue;
    }
    await prisma.community.update({
      where: { id: community.id },
      data: { avatarUrl: fixture.avatarUrl },
    });
    updated += 1;
  }
  return updated;
}

function refreshCommunityAvatars(
  communities: Map<string, CommunityRow>,
): void {
  for (const fixture of COMMUNITY_FIXTURES) {
    const community: CommunityRow = requireCommunity(fixture.name, communities);
    if (community.avatarUrl === null) {
      community.avatarUrl = fixture.avatarUrl;
    }
  }
}

async function channelsComplete(
  communities: Map<string, CommunityRow>,
): Promise<boolean> {
  for (const channel of SEED_CHANNELS) {
    const community: CommunityRow = requireCommunity(channel.community, communities);
    const conversation: { _count: { messages: number } } | null =
      await prisma.conversation.findUnique({
        where: {
          communityId_slug: {
            communityId: community.id,
            slug: channel.slug,
          },
        },
        select: { _count: { select: { messages: true } } },
      });
    if (conversation === null || conversation._count.messages === 0) {
      return false;
    }
  }
  return true;
}

async function seedChannels(
  communities: Map<string, CommunityRow>,
  users: Map<string, UserRow>,
  now: Date,
): Promise<void> {
  let participantCount: number = 0;
  let messageCount: number = 0;
  let receiptCount: number = 0;
  let attachmentCount: number = 0;
  let skippedChannels: number = 0;

  for (const channel of SEED_CHANNELS) {
    const community: CommunityRow = requireCommunity(channel.community, communities);
    const conversation: { id: string } = await prisma.conversation.upsert({
      where: {
        communityId_slug: { communityId: community.id, slug: channel.slug },
      },
      create: {
        kind: "CHANNEL",
        communityId: community.id,
        slug: channel.slug,
        title: channel.title,
        description: channel.description,
        avatarUrl: community.avatarUrl,
        directKey: null,
        isFallback: true,
      },
      update: {
        title: channel.title,
        description: channel.description,
        avatarUrl: community.avatarUrl,
      },
      select: { id: true },
    });

    const existingMessages: number = await prisma.message.count({
      where: { conversationId: conversation.id },
    });
    if (existingMessages > 0) {
      skippedChannels += 1;
      continue;
    }

    const oldestAgeHours: number = channel.messages.reduce(
      (oldest: number, message: SeedMessage) =>
        Math.max(oldest, message.ageHours),
      0,
    );
    const joinedAt: Date = hoursAgo(oldestAgeHours + 48, now);

    const participantRows: ParticipantRow[] = channel.participants.map(
      (username: string): ParticipantRow => ({
        conversationId: conversation.id,
        userId: requireUser(username, users).id,
        role: "MEMBER",
        joinedAt: joinedAt,
      }),
    );
    await prisma.conversationParticipant.createMany({
      data: participantRows,
      skipDuplicates: true,
    });
    participantCount += participantRows.length;

    let lastMessageAt: Date = joinedAt;

    for (const [index, message] of channel.messages.entries()) {
      const createdAt: Date = hoursAgo(message.ageHours, now);
      const sender: UserRow = requireUser(message.author, users);
      const created: { id: string } = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: sender.id,
          text: message.text,
          createdAt: createdAt,
          isFallback: true,
        },
        select: { id: true },
      });
      messageCount += 1;
      if (createdAt.getTime() > lastMessageAt.getTime()) {
        lastMessageAt = createdAt;
      }

      if (message.attachment !== undefined) {
        const attachment: SeedAttachment = message.attachment;
        await prisma.messageAttachment.create({
          data: {
            messageId: created.id,
            kind: attachment.kind,
            url: attachment.url,
            name: attachment.name,
            mimeType: attachment.mimeType,
            sizeBytes: attachment.sizeBytes,
            extension: attachment.extension,
            domain: attachment.domain,
            createdAt: createdAt,
            isFallback: true,
          },
        });
        attachmentCount += 1;
      }

      const receiptRows: ReceiptRow[] = channel.participants.flatMap(
        (username: string, participantIndex: number): ReceiptRow[] => {
          if (username === message.author) {
            return [];
          }
          const deliveredAt: Date = new Date(
            createdAt.getTime() + (5 + participantIndex * 7) * MINUTE_MS,
          );
          const readAt: Date | null =
            (index + participantIndex) % 3 === 0
              ? null
              : new Date(
                  createdAt.getTime() + (12 + participantIndex * 9) * MINUTE_MS,
                );
          return [
            {
              messageId: created.id,
              userId: requireUser(username, users).id,
              deliveredAt: deliveredAt,
              readAt: readAt,
            },
          ];
        },
      );
      if (receiptRows.length > 0) {
        await prisma.messageReceipt.createMany({
          data: receiptRows,
          skipDuplicates: true,
        });
        receiptCount += receiptRows.length;
      }
    }

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: lastMessageAt },
    });
  }

  console.log(
    `Message seed complete: ${SEED_CHANNELS.length} channels across ${COMMUNITY_FIXTURES.length} communities, ${skippedChannels} skipped, ${participantCount} participants, ${messageCount} messages, ${receiptCount} receipts, ${attachmentCount} attachments.`,
  );
}

async function main(): Promise<void> {
  const communityRows: CommunityRow[] = await prisma.community.findMany({
    where: {
      name: { in: COMMUNITY_FIXTURES.map((fixture) => fixture.name) },
    },
    select: { id: true, name: true, avatarUrl: true },
  });
  const communities: Map<string, CommunityRow> = new Map(
    communityRows.map((row: CommunityRow) => [row.name, row]),
  );
  for (const fixture of COMMUNITY_FIXTURES) {
    requireCommunity(fixture.name, communities);
  }

  const userRows: UserRow[] = await prisma.user.findMany({
    where: { username: { in: FIXTURE_ROLES.map((role) => role.username) } },
    select: { id: true, username: true, headline: true },
  });
  const users: Map<string, UserRow> = new Map(
    userRows.map((row: UserRow) => [row.username, row]),
  );
  const missing: string[] = FIXTURE_ROLES.flatMap((role) =>
    users.has(role.username) ? [] : [role.username],
  );
  if (missing.length > 0) {
    throw new Error(
      `Missing ${missing.length} social fixture users (${missing.join(", ")}). Run \`cd social && npm run db:seed\` first.`,
    );
  }

  const headlineBackfills: number = await backfillHeadlines(users);
  const avatarBackfills: number = await backfillCommunityAvatars(communities);
  refreshCommunityAvatars(communities);
  console.log(
    `Backfill: ${headlineBackfills} headlines, ${avatarBackfills} community avatars.`,
  );

  const complete: boolean = await channelsComplete(communities);
  if (complete) {
    console.log(
      `Message seed skipped: all ${SEED_CHANNELS.length} channels already have messages.`,
    );
    return;
  }

  const now: Date = new Date();
  await seedChannels(communities, users, now);
}

async function run(): Promise<void> {
  try {
    await main();
  } catch (error: unknown) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void run();
