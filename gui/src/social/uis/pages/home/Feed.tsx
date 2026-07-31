import { createSignal, For, onMount, Show, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import Status from "@src/social/uis/components/Status";
import CreateStatus from "@src/social/uis/components/CreateStatus";
import styles from "@src/social/styles/pages/home/Feed.module.css";

type StatusData = {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  media?: "none" | "single" | "multi";
  mediaCount?: number;
  mediaActiveIndex?: number;
  likes?: number;
  comments?: number;
  reposts?: number;
};

const emptyStatuses: StatusData[] = [];

function Feed(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = createSignal<"discover" | "following">("discover");
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
    <div class={styles.feed}>
      <div ref={sentinel} class={styles.sentinel} />
      <Show when={isAuthenticated()}>
        <div class={styles.header} classList={{ [styles.stuck]: isStuck() }}>
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
      </Show>
      <Show when={!isAuthenticated()}>
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
      </Show>
      <Show when={isAuthenticated()}>
        <CreateStatus />
      </Show>
      <Show
        when={emptyStatuses.length > 0}
        fallback={
          <div class={styles.state}>
            <p>No statuses yet. Be the first to share!</p>
          </div>
        }
      >
        <For each={emptyStatuses}>
          {(status) => (
            <Status
              avatar={status.avatar}
              name={status.name}
              handle={status.handle}
              time={status.time}
              content={status.content}
              media={status.media}
              mediaCount={status.mediaCount}
              mediaActiveIndex={status.mediaActiveIndex}
              likes={status.likes}
              comments={status.comments}
              reposts={status.reposts}
            />
          )}
        </For>
      </Show>
    </div>
  );
}

export default Feed;
