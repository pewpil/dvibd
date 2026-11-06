import { createSignal, type JSX } from "solid-js";
import likeIcon from "../../../assets/components/post/actions/like.svg?raw";
import repostIcon from "../../../assets/components/post/actions/repost.svg?raw";
import saveIcon from "../../../assets/components/post/actions/save.svg?raw";
import shareIcon from "../../../assets/components/post/actions/share.svg?raw";
import viewIcon from "../../../assets/components/post/actions/view.svg?raw";
import style from "../../../styles/components/(home)/post/Actions.module.css";

interface ActionsProps {
  views: number;
  repost: number;
  like: number;
  save: number;
}

export default function Actions(props: ActionsProps): JSX.Element {
  const [liked, setLiked] = createSignal(false);
  const [saved, setSaved] = createSignal(false);
  const [reposted, setReposted] = createSignal(false);

  const likeCount = () => props.like + (liked() ? 1 : 0);
  const saveCount = () => props.save + (saved() ? 1 : 0);
  const repostCount = () => props.repost + (reposted() ? 1 : 0);

  return (
    <footer id={style.postActions}>
      <button
        type="button"
        aria-label="Like"
        aria-pressed={liked()}
        class={liked() ? style.activeLike : undefined}
        onClick={() => setLiked(!liked())}
      >
        <span id={style.actionIcon} innerHTML={likeIcon} />
        <span>{likeCount()}</span>
      </button>
      <span id={style.postViews}>
        <span id={style.viewIcon} aria-hidden="true" innerHTML={viewIcon} />
        <span>{props.views}</span>
        <span id={style.viewsSrOnly}>
          {" "}
          {props.views === 1 ? "view" : "views"}
        </span>
      </span>
      <button
        type="button"
        aria-label="Repost"
        class={reposted() ? style.activeRepost : undefined}
        onClick={() => setReposted(!reposted())}
      >
        <span id={style.actionIcon} innerHTML={repostIcon} />
        <span>{repostCount()}</span>
      </button>
      <button
        type="button"
        aria-label="Save"
        aria-pressed={saved()}
        class={saved() ? style.activeSave : undefined}
        onClick={() => setSaved(!saved())}
      >
        <span id={style.actionIcon} innerHTML={saveIcon} />
        <span>{saveCount()}</span>
      </button>
      <button type="button" aria-label="Share">
        <span id={style.actionIcon} innerHTML={shareIcon} />
      </button>
    </footer>
  );
}