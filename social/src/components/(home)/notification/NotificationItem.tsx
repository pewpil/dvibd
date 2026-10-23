import { Show } from "solid-js";
import type { NotificationCard } from "../../../types/social";
import style from "../../../styles/components/(home)/notification/NotificationItem.module.css";
interface NotificationItemProps {
  notification: NotificationCard;
}

export default function NotificationItem(props: NotificationItemProps) {
  return (
    <li id={style.notificationItem}>
      <img
        src={props.notification.avatar ?? "/profile-picture.svg"}
        alt={`${props.notification.actor} avatar`}
      />
      <div id={style.notificationBody}>
        <p id={style.notificationText}>
          <span id={style.notificationActor}>
            {props.notification.actor}
          </span>{" "}
          {props.notification.action}
        </p>
        <p id={style.notificationTime}>
          {props.notification.time}
          <Show when={props.notification.isFallback}>
            <span id={style.demoTag}>Demo</span>
          </Show>
        </p>
      </div>
    </li>
  );
}
