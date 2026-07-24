import type { JSX } from "solid-js";

import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import heartIcon from "@src/social/assets/heart.svg";
import commentIcon from "@src/social/assets/comment.svg";
import repostIcon from "@src/social/assets/repost.svg";
import shareIcon from "@src/social/assets/share.svg";
import saveIcon from "@src/social/assets/save.svg";
import styles from "@src/social/styles/components/Status.module.css";

type StatusProps = {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  likes?: number;
  comments?: number;
  reposts?: number;
};

function Status(props: StatusProps): JSX.Element {
  return (
    <article class={styles.status}>
      <img
        class={styles.avatar}
        src={props.avatar ?? defaultPfp}
        alt={`${props.name}'s avatar`}
      />
      <div class={styles.body}>
        <div class={styles.header}>
          <span class={styles.name}>{props.name}</span>
          <span class={styles.handle}>@{props.handle}</span>
          <span class={styles.dot}>·</span>
          <span class={styles.time}>{props.time}</span>
        </div>
        <p class={styles.content}>{props.content}</p>
        <div class={styles.actions}>
          <div class={styles.actionsLeft}>
            <button class={styles.action}>
              <img class={styles.icon} src={heartIcon} alt="Like" />
              {props.likes ?? 0}
            </button>
            <button class={styles.action}>
              <img class={styles.icon} src={commentIcon} alt="Comment" />
              {props.comments ?? 0}
            </button>
            <button class={styles.action}>
              <img class={styles.icon} src={repostIcon} alt="Repost" />
              {props.reposts ?? 0}
            </button>
          </div>
          <div class={styles.actionsRight}>
            <button class={styles.action}>
              <img class={styles.icon} src={shareIcon} alt="Share" />
            </button>
            <button class={styles.action}>
              <img class={styles.icon} src={saveIcon} alt="Save" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default Status;
