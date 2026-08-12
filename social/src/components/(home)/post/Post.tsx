import { Show } from "solid-js";
import Actions from "./Actions";
import Header from "./Header";
import MediaPlaceholder from "./MediaPlaceholder";
import style from "../../../styles/components/(home)/post/Post.module.css";

interface PostProps {
  name: string;
  handle: string;
  time: string;
  avatar?: string;
  text: string;
  media?: { count: number };
  reply: number;
  repost: number;
  like: number;
  save: number;
}

export default function Post(props: PostProps) {
  return (
    <article id={style.post}>
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
        reply={props.reply}
        repost={props.repost}
        like={props.like}
        save={props.save}
      />
    </article>
  );
}