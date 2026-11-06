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
  save: number;
  permalink?: boolean;
}

export default function Post(props: PostProps): JSX.Element {
  const canPermalink = (): boolean =>
    props.permalink !== false && props.type === "stat";

  return (
    <article
      id={style.post}
      data-permalink={canPermalink() ? "true" : undefined}
    >
      <Show when={canPermalink()}>
        <A
          id={style.postPermalink}
          href={postPath({ id: props.id, handle: props.handle, type: props.type })}
          aria-label={`Open post by ${props.name} (@${props.handle}), ${props.time}`}
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
        views={props.views}
        repost={props.repost}
        like={props.like}
        save={props.save}
      />
    </article>
  );
}
