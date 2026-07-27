import { createSignal, For, onMount, type JSX } from "solid-js";

import NotificationItem, { type NotificationItemProps } from "@src/social/uis/components/notifications/NotificationItem";
import settingsIcon from "@src/social/assets/settings.svg";
import styles from "@src/social/styles/pages/home/Notifications.module.css";

type NotificationsProps = {
  notifications?: NotificationItemProps[];
};

const fallbackNotifications: NotificationItemProps[] = [
  {
    name: "Alex Rivera",
    type: "follow",
    time: "2m",
  },
  {
    name: "Sam Chen",
    type: "like",
    time: "12m",
    preview: "does anyone else think nested CSS is the best thing to happen to frontend?",
  },
  {
    name: "Jordan Taylor",
    type: "repost",
    time: "45m",
    preview: "working on a side project with SolidJS. the signals model is incredibly clean.",
  },
  {
    name: "Morgan Foster",
    type: "comment",
    time: "1h",
    preview: "couldn't agree more. the ergonomics are unreal compared to what we had before.",
  },
  {
    name: "Taylor Reed",
    type: "mention",
    time: "2h",
    preview: "@user totally agree with your point about learning fundamentals first.",
  },
  {
    name: "Jamie Lin",
    type: "like",
    time: "3h",
    preview: "spent the weekend rewriting my portfolio in Solid. signals make state management feel like cheating.",
  },
  {
    name: "Avery Wright",
    type: "follow",
    time: "4h",
  },
  {
    name: "Riley Cooper",
    type: "repost",
    time: "6h",
    preview: "just discovered CSS accent-color. why did nobody tell me this existed?",
  },
  {
    name: "Dakota Moore",
    type: "like",
    time: "8h",
    preview: "me: i'll keep this project simple\nalso me: adds TypeScript, tests, CI, a monorepo, and three databases",
  },
  {
    name: "Quinn Davis",
    type: "comment",
    time: "10h",
    preview: "container queries were worth the wait. been using them for a month now.",
  },
  {
    name: "Skyler Park",
    type: "follow",
    time: "1d",
  },
  {
    name: "Emerson Blake",
    type: "mention",
    time: "2d",
    preview: "@user have you tried the new view transitions API? game changer.",
  },
];

function Notifications(props: NotificationsProps): JSX.Element {
  const [activeTab, setActiveTab] = createSignal<"all" | "mentions">("all");
  const [isStuck, setIsStuck] = createSignal(false);
  const items = () => props.notifications ?? fallbackNotifications;
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
        <div class={styles.titleRow}>
          <h2 class={styles.title}>Notifications</h2>
          <a href="/social/notifications/settings" class={styles.settingsLink} title="Notification settings">
            <img src={settingsIcon} alt="Settings" />
          </a>
        </div>
        <div class={styles.tabs}>
          <button
            class={styles.tab}
            classList={{ [styles.tabActive]: activeTab() === "all" }}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            class={styles.tab}
            classList={{ [styles.tabActive]: activeTab() === "mentions" }}
            onClick={() => setActiveTab("mentions")}
          >
            Mentions
          </button>
        </div>
      </div>
      <For each={items()}>
        {(notification) => (
          <NotificationItem
            name={notification.name}
            type={notification.type}
            time={notification.time}
            preview={notification.preview}
          />
        )}
      </For>
    </div>
  );
}

export default Notifications;
