import { createSignal, For, onMount, Show, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import { fetchStatuses, type ApiStatus } from "@src/social/lib/api";
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

function mapApiStatusToUI(api: ApiStatus): StatusData {
  return {
    name: api.author?.username ?? "unknown",
    handle: api.author?.username ?? "unknown",
    time: formatRelativeTime(api.createdAt),
    content: api.content,
  };
}

function formatRelativeTime(iso: string): string {
  const diff: number = Date.now() - new Date(iso).getTime();
  const minutes: number = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours: number = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days: number = Math.floor(hours / 24);
  return `${days}d`;
}

function Feed(): JSX.Element {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = createSignal<"discover" | "following">("discover");
  const [isStuck, setIsStuck] = createSignal(false);
  const [statuses, setStatuses] = createSignal<StatusData[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  let sentinel!: HTMLDivElement;

  const loadStatuses = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data: ApiStatus[] = await fetchStatuses(1, 50);
      setStatuses(data.map(mapApiStatusToUI));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusCreated = () => {
    loadStatuses();
  };

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    loadStatuses();
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
        <CreateStatus onStatusCreated={handleStatusCreated} />
      </Show>
      <Show
        when={!loadError()}
        fallback={
          <div class={styles.state}>
            <p>{loadError()}</p>
            <button class={styles.stateBtn} onClick={loadStatuses}>
              Retry
            </button>
          </div>
        }
      >
        <Show
          when={!isLoading()}
          fallback={null}
        >
          <Show
            when={statuses().length > 0}
            fallback={
              <div class={styles.state}>
                <p>No statuses yet. Be the first to share!</p>
              </div>
            }
          >
            <For each={statuses()}>
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
        </Show>
      </Show>
    </div>
  );
}

export default Feed;
