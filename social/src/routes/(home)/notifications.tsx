import { createAsync } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import settingsIcon from "../../assets/components/(home)/notification/settings.svg?raw";
import { getNotifications } from "../../server/notifications";
import type { NotificationCard } from "../../types/social";
import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import NotificationItem from "../../components/(home)/notification/NotificationItem";
import style from "../../styles/pages/(home)/notifications.module.css";

export default function Notifications() {
  const [tab, setTab] = createSignal("All");
  const notifications = createAsync(() => getNotifications());
  const visible = (): NotificationCard[] => {
    const items: NotificationCard[] = notifications() ?? [];
    if (tab() === "Mentions") {
      return items.filter(
        (item) =>
          item.kind === "MENTIONED" || item.kind === "MENTIONED_COMMUNITY",
      );
    }
    return items;
  };

  return [
    <FeedHeader>
      <div id={style.headerTop}>
        <h1 id={style.headerTitle}>Notifications</h1>
        <button type="button" aria-label="Settings" id={style.headerSettings}>
          <span id={style.settingsIcon} innerHTML={settingsIcon} />
        </button>
      </div>
      <FeedTabs tabs={["All", "Mentions"]} value={tab()} onChange={setTab} />
    </FeedHeader>,
    <Show when={visible().length === 0}>
      <section id={style.emptyState}>
        <h2 id={style.emptyTitle}>No notifications</h2>
        <p id={style.emptyText}>
          You're all caught up. New likes, replies and follows will show up
          here.
        </p>
      </section>
    </Show>,
    <ul id={style.notificationList}>
      <For each={visible()}>
        {(notification) => (
          <NotificationItem notification={notification} />
        )}
      </For>
    </ul>,
  ];
}
