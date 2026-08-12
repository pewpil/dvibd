import { createSignal } from "solid-js";
import replyIcon from "../../../assets/components/post/actions/reply.svg?raw";
import repostIcon from "../../../assets/components/post/actions/repost.svg?raw";
import likeIcon from "../../../assets/components/post/actions/like.svg?raw";
import saveIcon from "../../../assets/components/post/actions/save.svg?raw";
import shareIcon from "../../../assets/components/post/actions/share.svg?raw";
import style from "../../../styles/components/(home)/post/Actions.module.css";

interface ActionsProps {
  reply: number;
  repost: number;
  like: number;
  save: number;
}

export default function Actions(props: ActionsProps) {
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
      <button type="button" aria-label="Reply">
        <span id={style.actionIcon} innerHTML={replyIcon} />
        <span>{props.reply}</span>
      </button>
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
      <button type="button" aria-label="Share" class={style.shareAction}>
        <span id={style.actionIcon} innerHTML={shareIcon} />
      </button>
    </footer>
  );
}