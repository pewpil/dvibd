import { A } from "@solidjs/router";
import { Show, type JSX } from "solid-js";
import Header from "./Header";
import Actions from "./Actions";
import MediaPlaceholder from "./MediaPlaceholder";
import { postPath } from "../../../lib/postPath";
import type { PostCard } from "../../../types/social";
import style from "../../../styles/components/(home)/post/Post.module.css";

interface PostProps {
  id: string;
  name: string;
  handle: string;
  type: PostCard["type"];
  time: string;
  avatar?: string;
  text: string;
  media?: { count: number };
  views: number;
  repost: number;
  like: number;
  liked: boolean;
  save: number;
  permalink?: boolean;
  onOpen?: () => boolean | void;
}

export default function Post(props: PostProps): JSX.Element {
  const canPermalink = (): boolean =>
    props.permalink !== false && props.type === "stat";
  const excerpt = (): string =>
    props.text.replace(/\s+/g, " ").trim().slice(0, 60);
  const permalinkLabel = (): string => {
    const base: string = `Open post by ${props.name} (@${props.handle}), ${props.time}`;
    const text: string = excerpt();
    return text === "" ? base : `${base}: ${text}`;
  };

  const handlePermalinkClick = (
    event: MouseEvent & { currentTarget: HTMLAnchorElement },
  ): void => {
    if (props.onOpen === undefined) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const handled: boolean | void = props.onOpen();
    if (handled === false) return;
    event.preventDefault();
  };

  return (
    <article
      id={style.post}
      data-permalink={canPermalink() ? "true" : undefined}
    >
      <Show when={canPermalink()}>
        <A
          id={style.postPermalink}
          href={postPath({ id: props.id, handle: props.handle, type: props.type })}
          aria-label={permalinkLabel()}
          onClick={handlePermalinkClick}
        />
      </Show>
      <Header
        name={props.name}
        handle={props.handle}
        time={props.time}
        avatar={props.avatar}
      />
      <p id={style.postText}>{props.text}</p>
      <Show when={props.media}>
        <MediaPlaceholder count={props.media!.count} />
      </Show>
      <Actions
        id={props.id}
        views={props.views}
        repost={props.repost}
        like={props.like}
        liked={props.liked}
        save={props.save}
      />
    </article>
  );
}
