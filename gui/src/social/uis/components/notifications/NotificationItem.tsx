import type { JSX } from "solid-js";

import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import styles from "@src/social/styles/components/notifications/NotificationItem.module.css";

export type NotificationType = "follow" | "like" | "repost" | "comment" | "mention";

export type NotificationItemProps = {
  avatar?: string;
  name: string;
  type: NotificationType;
  time: string;
  preview?: string;
};

const actionLabel: Record<NotificationType, string> = {
  follow: "started following you",
  like: "liked your post",
  repost: "reposted your post",
  comment: "replied to your post",
  mention: "mentioned you",
};

function NotificationItem(props: NotificationItemProps): JSX.Element {
  return (
    <article class={styles.item}>
      <img
        class={styles.avatar}
        src={props.avatar ?? defaultPfp}
        alt={`${props.name}'s avatar`}
      />
      <div class={styles.body}>
        <div class={styles.main}>
          <span class={styles.name}>{props.name}</span>
          <span class={styles.action}>{actionLabel[props.type]}</span>
          <span class={styles.dot}>&middot;</span>
          <span class={styles.time}>{props.time}</span>
        </div>
        {props.preview && <p class={styles.preview}>{props.preview}</p>}
      </div>
    </article>
  );
}

export default NotificationItem;
