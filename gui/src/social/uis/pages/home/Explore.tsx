import { createSignal, For, onMount, Show, type JSX } from "solid-js";

import Status, { type MediaType } from "@src/social/uis/components/Status";
import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import searchIcon from "@src/social/assets/search.svg";
import filterIcon from "@src/social/assets/filter.svg";
import styles from "@src/social/styles/pages/home/Explore.module.css";

const trendingTags = [
  { tag: "#solidjs", posts: 1240 },
  { tag: "#webdev", posts: 3420 },
  { tag: "#uiux", posts: 2150 },
  { tag: "#opensource", posts: 1890 },
  { tag: "#typescript", posts: 2860 },
];

const happenings = [
  { title: "SolidJS 2.0 release candidate", meta: "Trending in Technology · 14.2K posts" },
  { title: "State of CSS 2026 survey drops", meta: "Trending in Design · 8.7K posts" },
];

const peopleToFollow = [
  { name: "Elena Vargas", handle: "elenacodes" },
  { name: "Marcus Lee", handle: "marcusl" },
  { name: "Priya Kapoor", handle: "priyadesigns" },
];

const communitiesToJoin = [
  { name: "TypeScript Enthusiasts", members: "34.2K members" },
  { name: "CSS Art Community", members: "18.7K members" },
  { name: "Indie Hackers", members: "52.1K members" },
];

type DiscoverPost = {
  name: string;
  handle: string;
  time: string;
  content: string;
  media?: MediaType;
  mediaCount?: number;
  mediaActiveIndex?: number;
  likes: number;
  comments: number;
  reposts: number;
};

const discoverPosts: DiscoverPost[] = [
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
    media: "multi",
    mediaCount: 4,
    mediaActiveIndex: 2,
    likes: 89,
    comments: 14,
    reposts: 6,
  },
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "2h",
    content: "just shipped the new social feed layout. feeling good about this one.",
    media: "single",
    likes: 24,
    comments: 7,
    reposts: 3,
  },
  {
    name: "Dakota Moore",
    handle: "dakotam",
    time: "1d",
    content: "me: i'll keep this project simple\nalso me: adds TypeScript, tests, CI, a monorepo, and three databases",
    media: "multi",
    mediaCount: 7,
    mediaActiveIndex: 3,
    likes: 445,
    comments: 67,
    reposts: 52,
  },
];

function Explore(): JSX.Element {
  const [filtersOpen, setFiltersOpen] = createSignal(false);
  const [isStuck, setIsStuck] = createSignal(false);
  let sentinel!: HTMLDivElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  return (
    <div class={styles.page}>
      <div ref={sentinel} class={styles.sentinel} />
      <div class={styles.header} classList={{ [styles.stuck]: isStuck() }}>
        <div class={styles.searchRow}>
          <div class={styles.searchBar}>
            <img src={searchIcon} alt="Search" />
            <input type="text" placeholder="Search posts, users, communities..." />
          </div>
          <button class={styles.filterBtn} onClick={() => setFiltersOpen((o) => !o)} title="Filters">
            <img src={filterIcon} alt="Filters" />
          </button>
        </div>
        <Show when={filtersOpen()}>
          <div class={styles.filters}>
            <button class={styles.filterChip}>All</button>
            <button class={styles.filterChip}>Posts</button>
            <button class={styles.filterChip}>Users</button>
            <button class={styles.filterChip}>Communities</button>
            <button class={styles.filterChip}>Latest</button>
            <button class={styles.filterChip}>Popular</button>
          </div>
        </Show>
      </div>

      <div class={styles.section}>
        <h2 class={styles.sectionTitle}>Trending</h2>
        <div class={styles.card}>
          <div class={styles.tagList}>
            <For each={trendingTags}>
              {(topic) => (
                <div class={styles.tagRow}>
                  <span class={styles.tag}>{topic.tag}</span>
                  <span class={styles.count}>{topic.posts} posts</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class={styles.section}>
        <h2 class={styles.sectionTitle}>What's happening</h2>
        <div class={styles.card}>
          <div class={styles.eventList}>
            <For each={happenings}>
              {(event) => (
                <div class={styles.event}>
                  <p class={styles.eventTitle}>{event.title}</p>
                  <span class={styles.eventMeta}>{event.meta}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class={styles.section}>
        <h2 class={styles.sectionTitle}>Who to follow</h2>
        <div class={styles.card}>
          <div class={styles.peopleList}>
            <For each={peopleToFollow}>
              {(person) => (
                <div class={styles.person}>
                  <img class={styles.avatar} src={defaultPfp} alt={`${person.name}'s avatar`} />
                  <div class={styles.info}>
                    <span class={styles.name}>{person.name}</span>
                    <span class={styles.handle}>@{person.handle}</span>
                  </div>
                  <button class={styles.follow}>Follow</button>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class={styles.section}>
        <h2 class={styles.sectionTitle}>Where to belong</h2>
        <div class={styles.card}>
          <div class={styles.communityList}>
            <For each={communitiesToJoin}>
              {(community) => (
                <div class={styles.community}>
                  <div class={styles.icon} />
                  <div class={styles.info}>
                    <span class={styles.name}>{community.name}</span>
                    <span class={styles.members}>{community.members}</span>
                  </div>
                  <button class={styles.join}>Join</button>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>

      <div class={styles.section}>
        <h2 class={styles.sectionTitle}>Discover</h2>
        <For each={discoverPosts}>
          {(post) => (
            <Status
              name={post.name}
              handle={post.handle}
              time={post.time}
              content={post.content}
              media={post.media}
              mediaCount={post.mediaCount}
              mediaActiveIndex={post.mediaActiveIndex}
              likes={post.likes}
              comments={post.comments}
              reposts={post.reposts}
            />
          )}
        </For>
      </div>
    </div>
  );
}

export default Explore;
