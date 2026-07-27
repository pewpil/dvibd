import { Show, type JSX } from "solid-js";

import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import heartIcon from "@src/social/assets/heart.svg";
import commentIcon from "@src/social/assets/comment.svg";
import repostIcon from "@src/social/assets/repost.svg";
import shareIcon from "@src/social/assets/share.svg";
import saveIcon from "@src/social/assets/save.svg";
import MediaPlaceholder from "@src/social/uis/components/MediaPlaceholder";
import styles from "@src/social/styles/components/Status.module.css";

export type MediaType = "none" | "single" | "multi";

type StatusProps = {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  media?: MediaType;
  mediaCount?: number;
  mediaActiveIndex?: number;
  likes?: number;
  comments?: number;
  reposts?: number;
};

function Status(props: StatusProps): JSX.Element {
  const mediaType = () => props.media ?? "none";

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
          <span class={styles.dot}>&middot;</span>
          <span class={styles.time}>{props.time}</span>
        </div>
        <p class={styles.content}>{props.content}</p>
        <Show when={mediaType() !== "none"}>
          <MediaPlaceholder
            type={mediaType() as "single" | "multi"}
            count={props.mediaCount}
            activeIndex={props.mediaActiveIndex}
          />
        </Show>
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
