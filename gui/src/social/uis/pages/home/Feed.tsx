import { createSignal, For, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import Status from "@src/social/uis/components/Status";
import styles from "@src/social/styles/pages/home/Feed.module.css";

type StatusData = {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  likes?: number;
  comments?: number;
  reposts?: number;
};

type FeedProps = {
  statuses?: StatusData[];
};

const fallbackStatuses: StatusData[] = [
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "2h",
    content: "just shipped the new social feed layout. feeling good about this one.",
    likes: 24,
    comments: 7,
    reposts: 3,
  },
  {
    name: "Sam Chen",
    handle: "samchen",
    time: "4h",
    content: "does anyone else think nested CSS is the best thing to happen to frontend?",
    likes: 142,
    comments: 31,
    reposts: 12,
  },
  {
    name: "Jordan Taylor",
    handle: "jordant",
    time: "6h",
    content: "working on a side project with SolidJS. the signals model is incredibly clean.",
    likes: 89,
    comments: 14,
    reposts: 6,
  },
  {
    name: "Morgan Foster",
    handle: "morganf",
    time: "8h",
    content: "just finished reading 'Designing Data-Intensive Applications'. mind officially blown.",
    likes: 210,
    comments: 45,
    reposts: 28,
  },
  {
    name: "Taylor Reed",
    handle: "taylorr",
    time: "10h",
    content: "hot take: tailwind is fine but people should learn actual CSS first.",
    likes: 67,
    comments: 89,
    reposts: 15,
  },
  {
    name: "Jamie Lin",
    handle: "jamelin",
    time: "12h",
    content: "spent the weekend rewriting my portfolio in Solid. signals make state management feel like cheating.",
    likes: 156,
    comments: 23,
    reposts: 9,
  },
  {
    name: "Avery Wright",
    handle: "averyw",
    time: "14h",
    content: "there's something satisfying about deleting 500 lines of code and replacing it with 50.",
    likes: 312,
    comments: 41,
    reposts: 34,
  },
  {
    name: "Riley Cooper",
    handle: "rileyc",
    time: "1d",
    content: "just discovered CSS accent-color. why did nobody tell me this existed?",
    likes: 78,
    comments: 12,
    reposts: 5,
  },
  {
    name: "Quinn Davis",
    handle: "quinnd",
    time: "1d",
    content: "started using container queries in production. feels like the future has finally arrived.",
    likes: 94,
    comments: 18,
    reposts: 7,
  },
  {
    name: "Dakota Moore",
    handle: "dakotam",
    time: "1d",
    content: "me: i'll keep this project simple\nalso me: adds TypeScript, tests, CI, a monorepo, and three databases",
    likes: 445,
    comments: 67,
    reposts: 52,
  },
  {
    name: "Skyler Park",
    handle: "skylarp",
    time: "2d",
    content: "pair programming > solo programming. fight me.",
    likes: 189,
    comments: 73,
    reposts: 21,
  },
  {
    name: "Emerson Blake",
    handle: "emersonb",
    time: "2d",
    content: "the best code is the code you don't have to write. but sometimes you gotta write it anyway.",
    likes: 134,
    comments: 22,
    reposts: 11,
  },
];

function Feed(props: FeedProps): JSX.Element {
  const [activeTab, setActiveTab] = createSignal<"discover" | "following">("discover");
  const items = () => props.statuses ?? fallbackStatuses;

  return (
    <div class={styles.feed}>
      <div class={styles.header}>
        <button
          class={styles.tab}
          classList={{ [styles.tabActive]: activeTab() === "discover" }}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        <button
          class={styles.tab}
          classList={{ [styles.tabActive]: activeTab() === "following" }}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>
      <div class={styles.hero}>
        <h2 class={styles.heroTitle}>Welcome to social</h2>
        <p class={styles.heroText}>
          Follow the people and communities that matter. Share your thoughts,
          discover new ideas, and stay connected.
        </p>
        <div class={styles.heroActions}>
          <A class={styles.heroPrimary} href="/auth/signup">
            Create account
          </A>
          <A class={styles.heroGhost} href="/auth/login">
            Sign in
          </A>
        </div>
      </div>
      <For each={items()}>
        {(status) => (
          <Status
            avatar={status.avatar}
            name={status.name}
            handle={status.handle}
            time={status.time}
            content={status.content}
            likes={status.likes}
            comments={status.comments}
            reposts={status.reposts}
          />
        )}
      </For>
    </div>
  );
}

export default Feed;