import { createSignal, For, onMount, type JSX } from "solid-js";

import NotificationItem, {
  type NotificationItemProps,
} from "@src/social/uis/components/notifications/NotificationItem";
import settingsIcon from "@src/social/assets/settings.svg";
import styles from "@src/social/styles/pages/home/Notifications.module.css";

type NotificationsProps = {
  notifications?: NotificationItemProps[];
};

function Notifications(props: NotificationsProps): JSX.Element {
  const [activeTab, setActiveTab] = createSignal<"all" | "mentions">("all");
  const [isStuck, setIsStuck] = createSignal(false);
  const items = () => props.notifications ?? [];
  let sentinel!: HTMLDivElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
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
          <a
            href="/social/notifications/settings"
            class={styles.settingsLink}
            title="Notification settings"
          >
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
