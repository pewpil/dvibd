import type {
  Attachment,
  Contact,
  EmailMessage,
  Label,
  Thread,
} from "./types.ts";

const AVATAR: string = "/profile-picture.svg";

export const currentUser: Contact = {
  id: "user-alex",
  name: "Alex Rivera",
  email: "alex@dvibd.dev",
  avatar: AVATAR,
};

export const fallbackContacts = {
  elena: {
    id: "contact-elena",
    name: "Elena Rostova",
    email: "elena@dvibd.dev",
    avatar: AVATAR,
  },
  marcus: {
    id: "contact-marcus",
    name: "Marcus Webb",
    email: "marcus@dvibd.dev",
    avatar: AVATAR,
  },
  priya: {
    id: "contact-priya",
    name: "Priya Nair",
    email: "priya@dvibd.dev",
    avatar: AVATAR,
  },
  ci: {
    id: "contact-ci",
    name: "dvibd CI",
    email: "ci-bot@dvibd.dev",
    avatar: AVATAR,
  },
  billing: {
    id: "contact-billing",
    name: "Stripe Billing",
    email: "receipts@stripe.com",
    avatar: AVATAR,
  },
  digest: {
    id: "contact-digest",
    name: "Svelte Weekly",
    email: "hello@svelte.weekly",
    avatar: AVATAR,
  },
} satisfies Record<string, Contact>;

export const fallbackLabels = {
  sprints: { id: "label-sprints", name: "Sprints", color: "#10b981" },
  product: { id: "label-product", name: "Product", color: "#e11d48" },
  billing: { id: "label-billing", name: "Billing", color: "#f59e0b" },
  onboarding: { id: "label-onboarding", name: "Onboarding", color: "#0284c7" },
} satisfies Record<string, Label>;

export const labelList: Label[] = Object.values(fallbackLabels);

const schemaFile: Attachment = {
  id: "a-schema",
  name: "schema.prisma",
  ext: "prisma",
  size: "18 KB",
};

const ciLog: Attachment = {
  id: "a-cilog",
  name: "ci-run-4821.log",
  ext: "log",
  size: "4 KB",
};

const invoiceFile: Attachment = {
  id: "a-invoice",
  name: "invoice-oct-2026.pdf",
  ext: "pdf",
  size: "242 KB",
};

const inviteFile: Attachment = {
  id: "a-invite",
  name: "release-review.ics",
  ext: "ics",
  size: "2 KB",
};

const tokensImage: Attachment = {
  id: "a-tokens",
  name: "indigo-dusk-palette.png",
  ext: "png",
  size: "96 KB",
};

function message(input: EmailMessage): EmailMessage {
  return input;
}

const prismaRollout: EmailMessage[] = [
  message({
    id: "m-1-1",
    threadId: "t-1",
    sender: fallbackContacts.elena,
    to: [currentUser],
    cc: [],
    timestamp: "Oct 17, 2:14 PM",
    body: [
      "The Prisma 8 side-by-side guide is ready to run against dvibd. Phase 1 touches only the schema and the three generator blocks, so the client surfaces stay on 7 until each app opts in.",
      "I pinned the blockers from the RC notes: P2002 usage in three apps, and the missing $extends and nested-write paths. Both have workarounds now, but they gate the message and social cutover.",
      "Can you take the hold-and-harden pass on orm/ first? Nothing else needs to move this week.",
    ],
    quoted: null,
    attachments: [],
    isRead: false,
    isDraft: false,
    isOutgoing: false,
  }),
  message({
    id: "m-1-2",
    threadId: "t-1",
    sender: fallbackContacts.marcus,
    to: [fallbackContacts.elena, currentUser],
    cc: [],
    timestamp: "Oct 17, 2:41 PM",
    body: [
      "Confirming from the database side: the Supavisor session pooler holds the migration lock fine, so the 5-phase timeline does not need a maintenance window.",
      "Current schema attached for reference, unchanged since the message parity work.",
    ],
    quoted: "On Oct 17, 2:14 PM, Elena Rostova wrote:\nCan you take the hold-and-harden pass on orm/ first?",
    attachments: [schemaFile],
    isRead: false,
    isDraft: false,
    isOutgoing: false,
  }),
  message({
    id: "m-1-3",
    threadId: "t-1",
    sender: currentUser,
    to: [fallbackContacts.elena, fallbackContacts.marcus],
    cc: [],
    timestamp: "Oct 17, 3:05 PM",
    body: [
      "Taking it. I will run the phase 1 generate against a scratch branch tomorrow morning and post counts before touching anywhere real.",
    ],
    quoted: "On Oct 17, 2:41 PM, Marcus Webb wrote:\nCurrent schema attached for reference.",
    attachments: [],
    isRead: true,
    isDraft: false,
    isOutgoing: true,
  }),
];

const invitations: EmailMessage[] = [
  message({
    id: "m-4-1",
    threadId: "t-4",
    sender: fallbackContacts.priya,
    to: [currentUser],
    cc: [fallbackContacts.marcus],
    timestamp: "Oct 16, 11:08 AM",
    body: [
      "Release review moved to Thursday at 4. Calendar file attached; the room booking followed the move already.",
    ],
    quoted: null,
    attachments: [inviteFile],
    isRead: true,
    isDraft: false,
    isOutgoing: false,
  }),
  message({
    id: "m-4-2",
    threadId: "t-4",
    sender: currentUser,
    to: [fallbackContacts.priya],
    cc: [fallbackContacts.marcus],
    timestamp: "Oct 16, 11:20 AM",
    body: ["Works. I accepted in the app, the invite shows one conflict with the social deploy window that I will swap."],
    quoted: "On Oct 16, 11:08 AM, Priya Nair wrote:\nRelease review moved to Thursday at 4.",
    attachments: [],
    isRead: true,
    isDraft: false,
    isOutgoing: true,
  }),
];

const tokensReview: EmailMessage[] = [
  message({
    id: "m-5-1",
    threadId: "t-5",
    sender: fallbackContacts.elena,
    to: [currentUser],
    cc: [fallbackContacts.marcus],
    timestamp: "Oct 15, 9:02 AM",
    body: [
      "The Indigo dusk palette exported from the landing set: both swatch sheets sit in the attached canvas. The reduced-transparency ladder rederived cleanly on the blue tints.",
      "Once mail adopts the structure, the three GUIs share the token names again.",
    ],
    quoted: null,
    attachments: [tokensImage],
    isRead: true,
    isDraft: false,
    isOutgoing: false,
  }),
];

const reschedule: EmailMessage[] = [
  message({
    id: "m-7-1",
    threadId: "t-7",
    sender: currentUser,
    to: [fallbackContacts.priya],
    cc: [],
    timestamp: "Oct 14, 8:47 AM",
    body: ["Pushing standup to 10:30 on the days the Netlify deploys run. Shout if that clashes with the message build."],
    quoted: null,
    attachments: [],
    isRead: true,
    isDraft: false,
    isOutgoing: true,
  }),
  message({
    id: "m-7-2",
    threadId: "t-7",
    sender: currentUser,
    to: [fallbackContacts.priya],
    cc: [fallbackContacts.elena],
    timestamp: "Oct 14, 4:12 PM",
    body: ["Reminder on the above, the deploy window moved again after the edge function fix."],
    quoted: null,
    attachments: [],
    isRead: true,
    isDraft: false,
    isOutgoing: true,
  }),
];

export const fallbackThreads: Thread[] = [
  {
    id: "t-1",
    subject: "Prisma 8 rollout plan",
    folder: "inbox",
    labels: [fallbackLabels.product],
    isStarred: true,
    snippet: "The Prisma 8 side-by-side guide is ready to run against dvibd.",
    messages: prismaRollout,
  },
  {
    id: "t-2",
    subject: "Build failed: social deploy",
    folder: "inbox",
    labels: [fallbackLabels.sprints],
    isStarred: false,
    snippet: "Phase 34 failed at the edge bundle step, run 4821.",
    messages: [
      message({
        id: "m-2-1",
        threadId: "t-2",
        sender: fallbackContacts.ci,
        to: [currentUser],
        cc: [],
        timestamp: "Oct 19, 7:31 AM",
        body: [
          "Phase 34 failed at the edge bundle step, run 4821. The middleware graph pulled a file that reaches the database module.",
          "Suspect the missing icon.svg exemption again, same signature as the message fix from last week.",
        ],
        quoted: null,
        attachments: [ciLog],
        isRead: false,
        isDraft: false,
        isOutgoing: false,
      }),
    ],
  },
  {
    id: "t-3",
    subject: "Your October invoice is ready",
    folder: "inbox",
    labels: [fallbackLabels.billing],
    isStarred: false,
    snippet: "Amount due by November 5 for the current billing period.",
    messages: [
      message({
        id: "m-3-1",
        threadId: "t-3",
        sender: fallbackContacts.billing,
        to: [currentUser],
        cc: [],
        timestamp: "Oct 19, 6:00 AM",
        body: ["Amount due by November 5 for the current billing period. The invoice breaks down the Supabase instance and the two domain fees."],
        quoted: null,
        attachments: [invoiceFile],
        isRead: false,
        isDraft: false,
        isOutgoing: false,
      }),
    ],
  },
  {
    id: "t-4",
    subject: "Release review moved",
    folder: "inbox",
    labels: [fallbackLabels.sprints],
    isStarred: false,
    snippet: "Release review moved to Thursday at 4, invite attached.",
    messages: invitations,
  },
  {
    id: "t-5",
    subject: "Indigo dusk palette export",
    folder: "inbox",
    labels: [fallbackLabels.product],
    isStarred: true,
    snippet: "Both swatch sheets sit in the attached canvas.",
    messages: tokensReview,
  },
  {
    id: "t-6",
    subject: "Svelte Weekly 71",
    folder: "inbox",
    labels: [],
    isStarred: false,
    snippet: "This week: runes deep dive, a11y tooling, and the attach pattern.",
    messages: [
      message({
        id: "m-6-1",
        threadId: "t-6",
        sender: fallbackContacts.digest,
        to: [currentUser],
        cc: [],
        timestamp: "Oct 18, 6:30 AM",
        body: [
          "This week: runes deep dive, a11y tooling roundup, and the attach pattern for third-party widgets.",
          "The unsubscribe link is in the footer of the web version.",
        ],
        quoted: null,
        attachments: [],
        isRead: true,
        isDraft: false,
        isOutgoing: false,
      }),
    ],
  },
  {
    id: "t-7",
    subject: "Rescheduling standup",
    folder: "sent",
    labels: [fallbackLabels.sprints],
    isStarred: false,
    snippet: "Pushing standup to 10:30 on the days the Netlify deploys run.",
    messages: reschedule,
  },
  {
    id: "t-8",
    subject: "Router spike notes",
    folder: "drafts",
    labels: [],
    isStarred: false,
    snippet: "Draft: comparing the hand-rolled routes approach against a dependency.",
    messages: [
      message({
        id: "m-8-1",
        threadId: "t-8",
        sender: currentUser,
        to: [fallbackContacts.elena],
        cc: [],
        timestamp: "Oct 19, 10:02 AM",
        body: [
          "Draft: comparing the hand-rolled routes approach against a dependency. Leaning hand-rolled since the app has three routes and the History API covers deep links.",
          "Open question below: how login redirects should hand the return path to the mail page.",
        ],
        quoted: null,
        attachments: [],
        isRead: false,
        isDraft: true,
        isOutgoing: true,
      }),
    ],
  },
  {
    id: "t-9",
    subject: "Onboarding kickoff notes",
    folder: "archive",
    labels: [fallbackLabels.onboarding],
    isStarred: false,
    snippet: "Recording, checklist, and the first-week pairing rota attached.",
    messages: [
      message({
        id: "m-9-1",
        threadId: "t-9",
        sender: fallbackContacts.priya,
        to: [currentUser],
        cc: [],
        timestamp: "Oct 6, 4:44 PM",
        body: ["Recording, checklist, and the first-week pairing rota are all agreed. Archiving until kickoff week."],
        quoted: null,
        attachments: [],
        isRead: true,
        isDraft: false,
        isOutgoing: false,
      }),
    ],
  },
  {
    id: "t-10",
    subject: "Extend your Postgres trial today",
    folder: "junk",
    labels: [],
    isStarred: false,
    snippet: "Last chance to keep your data at a special price, reply now.",
    messages: [
      message({
        id: "m-10-1",
        threadId: "t-10",
        sender: {
          id: "contact-sales",
          name: "Postgres Deals",
          email: "offers@postgres-deals.example",
          avatar: AVATAR,
        },
        to: [currentUser],
        cc: [],
        timestamp: "Oct 10, 5:20 AM",
        body: ["Last chance to keep your data at a special price, reply now."],
        quoted: null,
        attachments: [],
        isRead: false,
        isDraft: false,
        isOutgoing: false,
      }),
    ],
  },
  {
    id: "t-11",
    subject: "Test invites (old)",
    folder: "trash",
    labels: [],
    isStarred: false,
    snippet: "Leftover test invites from the message smoke run.",
    messages: [
      message({
        id: "m-11-1",
        threadId: "t-11",
        sender: currentUser,
        to: [fallbackContacts.marcus],
        cc: [],
        timestamp: "Sep 29, 1:15 PM",
        body: ["Leftover test invites from the message smoke run, safe to drop."],
        quoted: null,
        attachments: [],
        isRead: true,
        isDraft: false,
        isOutgoing: true,
      }),
    ],
  },
];
