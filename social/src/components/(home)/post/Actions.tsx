import { useAction, useNavigate } from "@solidjs/router";
import {
  createEffect,
  createSignal,
  on,
  onMount,
  type JSX,
} from "solid-js";
import { setLike } from "../../../server/likes";
import { useAuth } from "../../../contexts/AuthContext";
import type { LikeResult } from "../../../types/social";
import likeIcon from "../../../assets/components/post/actions/like.svg?raw";
import repostIcon from "../../../assets/components/post/actions/repost.svg?raw";
import saveIcon from "../../../assets/components/post/actions/save.svg?raw";
import shareIcon from "../../../assets/components/post/actions/share.svg?raw";
import viewIcon from "../../../assets/components/post/actions/view.svg?raw";
import style from "../../../styles/components/(home)/post/Actions.module.css";

interface ActionsProps {
  id: string;
  views: number;
  repost: number;
  like: number;
  liked: boolean;
  save: number;
}

interface LikeOverride {
  liked: boolean;
  likes: number;
}

const [likeStatuses, setLikeStatuses] = createSignal<Record<string, string>>(
  {},
);
const [savedStates, setSavedStates] = createSignal<Record<string, boolean>>({});
const [repostedStates, setRepostedStates] = createSignal<
  Record<string, boolean>
>({});
const focusAfterLike = new Map<string, number>();
const statusTimers = new Map<string, ReturnType<typeof setTimeout>>();

export default function Actions(props: ActionsProps): JSX.Element {
  const [likeOverride, setLikeOverride] =
    createSignal<LikeOverride | null>(null);
  const [likeBusy, setLikeBusy] = createSignal<boolean>(false);
  const sendLike = useAction(setLike);
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  let likeButton!: HTMLButtonElement;

  const restoreLikeFocus = (): void => {
    const pendingAt = focusAfterLike.get(props.id);
    if (pendingAt === undefined) {
      return;
    }
    focusAfterLike.delete(props.id);
    const active: Element | null = document.activeElement;
    if (
      active !== null &&
      active !== document.body &&
      active !== likeButton
    ) {
      return;
    }
    if (Date.now() - pendingAt < 15000) {
      likeButton?.focus({ preventScroll: true });
    }
  };

  onMount(restoreLikeFocus);

  createEffect(
    on([() => props.like, () => props.liked], () => {
      setLikeOverride(null);
      restoreLikeFocus();
    }),
  );

  const liked = (): boolean => likeOverride()?.liked ?? props.liked;
  const likeCount = (): number => likeOverride()?.likes ?? props.like;
  const saved = (): boolean => savedStates()[props.id] ?? false;
  const reposted = (): boolean => repostedStates()[props.id] ?? false;
  const saveCount = (): number => props.save + (saved() ? 1 : 0);
  const repostCount = (): number => props.repost + (reposted() ? 1 : 0);
  const likeStatus = (): string => likeStatuses()[props.id] ?? "";
  const setLikeStatus = (value: string): void => {
    const existing = statusTimers.get(props.id);
    if (existing !== undefined) {
      clearTimeout(existing);
      statusTimers.delete(props.id);
    }
    setLikeStatuses((current) => ({ ...current, [props.id]: value }));
    if (value === "") {
      return;
    }
    const timer = setTimeout(() => {
      setLikeStatuses((current) => {
        const next = { ...current };
        delete next[props.id];
        return next;
      });
      statusTimers.delete(props.id);
    }, 8000);
    statusTimers.set(props.id, timer);
  };
  const likeLabel = (): string => {
    const action: string =
      loggedIn() === false
        ? "Sign in to like posts"
        : liked()
          ? "Unlike post"
          : "Like post";
    return `${action}, ${likeCount()} ${likeCount() === 1 ? "like" : "likes"}`;
  };
  const toggleSaved = (): void => {
    setSavedStates((current) => ({ ...current, [props.id]: !saved() }));
  };
  const toggleReposted = (): void => {
    setRepostedStates((current) => ({ ...current, [props.id]: !reposted() }));
  };

  const toggleLike = async (): Promise<void> => {
    if (likeBusy()) {
      return;
    }
    if (loggedIn() !== true) {
      if (loggedIn() === false) {
        navigate("/login");
      }
      return;
    }
    focusAfterLike.set(props.id, Date.now());
    const next: boolean = !liked();
    setLikeOverride({
      liked: next,
      likes: Math.max(0, likeCount() + (next ? 1 : -1)),
    });
    setLikeBusy(true);
    setLikeStatus("");
    try {
      const result: LikeResult = await sendLike(
        props.id,
        next ? "like" : "unlike",
      );
      if (result.ok) {
        setLikeOverride({ liked: result.liked, likes: result.likes });
        setLikeStatus(result.liked ? "Post liked." : "Like removed.");
      } else {
        focusAfterLike.delete(props.id);
        setLikeOverride(null);
        setLikeStatus(result.error);
      }
    } catch {
      focusAfterLike.delete(props.id);
      setLikeOverride(null);
      setLikeStatus("Could not update your like. Try again.");
    } finally {
      setLikeBusy(false);
    }
  };

  return (
    <footer id={style.postActions}>
      <button
        type="button"
        ref={likeButton}
        aria-label={likeLabel()}
        title={loggedIn() === false ? "Sign in to like posts" : undefined}
        aria-pressed={liked()}
        aria-busy={likeBusy() ? "true" : undefined}
        aria-disabled={likeBusy() ? "true" : undefined}
        class={liked() ? style.activeLike : undefined}
        onClick={toggleLike}
      >
        <span id={style.actionIcon} innerHTML={likeIcon} />
        <span id={style.likeCount}>{likeCount()}</span>
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
        onClick={toggleReposted}
      >
        <span id={style.actionIcon} innerHTML={repostIcon} />
        <span>{repostCount()}</span>
      </button>
      <button
        type="button"
        aria-label="Save"
        aria-pressed={saved()}
        class={saved() ? style.activeSave : undefined}
        onClick={toggleSaved}
      >
        <span id={style.actionIcon} innerHTML={saveIcon} />
        <span>{saveCount()}</span>
      </button>
      <button type="button" aria-label="Share">
        <span id={style.actionIcon} innerHTML={shareIcon} />
      </button>
      <span id={style.likeStatus} role="status">
        {likeStatus()}
      </span>
    </footer>
  );
}
