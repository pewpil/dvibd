import { For } from "solid-js";
import settingsIcon from "../../../assets/components/(home)/notification/settings.svg?raw";
import { notifications } from "../../../data/social";
import FeedHeader from "../../../components/(home)/FeedHeader";
import FeedTabs from "../../../components/(home)/FeedTabs";
import style from "../../../styles/pages/(home)/notifications.module.css";

export default function Notifications() {
  return [
    <FeedHeader>
      <div id={style.headerTop}>
        <h1 id={style.headerTitle}>Notifications</h1>
        <button type="button" aria-label="Settings" id={style.headerSettings}>
          <span id={style.settingsIcon} innerHTML={settingsIcon} />
        </button>
      </div>
      <FeedTabs tabs={["All", "Mentions"]} />
    </FeedHeader>,
    <section id={style.emptyState}>
      <h2 id={style.emptyTitle}>No notifications</h2>
      <p id={style.emptyText}>
        You're all caught up. New likes, replies and follows will show up here.
      </p>
    </section>,
    <ul id={style.notificationList}>
      <For each={notifications}>
        {(notification) => (
          <li class={style.notificationItem}>
            <img
              src={notification.avatar ?? "/profile-picture.svg"}
              alt={`${notification.actor} avatar`}
            />
            <div>
              <p id={style.notificationText}>
                <span id={style.notificationActor}>
                  {notification.actor}
                </span>{" "}
                {notification.action}
              </p>
              <p id={style.notificationTime}>{notification.time}</p>
            </div>
          </li>
        )}
      </For>
    </ul>,
  ];
}