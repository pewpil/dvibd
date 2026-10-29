import { createSignal } from "solid-js";
import socialMark from "../../../../../assets/components/dvibd/home/landing/product/social.svg";
import { SOCIAL_URL } from "../../../../lib/dvibd";
import style from "../../../../../styles/components/dvibd/home/fragments/SocialPost.module.css";

interface SocialPostProps {
  author: string;
  handle: string;
  role: string;
  community: string;
  time: string;
  body: string;
}

function initialsOf(name: string): string {
  const parts: string[] = name
    .split(" ")
    .filter((part: string): boolean => part.length > 0);
  const first: string = parts[0] ?? "";
  const last: string = parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function SocialPost(props: SocialPostProps) {
  const [liked, setLiked] = createSignal<boolean>(false);

  return (
    <article id={style.post} data-ui="true">
      <header id={style.header}>
        <span id={style.avatar} aria-hidden="true">
          {initialsOf(props.author)}
        </span>
        <span id={style.identity}>
          <span id={style.author}>{props.author}</span>
          <span id={style.meta}>
            <span>{props.handle}</span>
            <span id={style.role}>{props.role}</span>
            <span id={style.community}>
              <img src={socialMark} alt="" width="64" height="64" />
              {props.community}
            </span>
            <span>{props.time}</span>
          </span>
        </span>
      </header>
      <p id={style.body}>
        {props.body}{" "}
        <a id={style.tag} href={SOCIAL_URL}>
          #dvibd
        </a>
      </p>
      <div id={style.actions}>
        <button
          id={style.like}
          type="button"
          classList={{ [style.likeOn]: liked() }}
          aria-pressed={liked()}
          onClick={() => setLiked(!liked())}
        >
          Like
        </button>
        <button
          type="button"
          disabled
          aria-label="Reply, not available in this preview"
        >
          Reply
        </button>
        <button
          type="button"
          disabled
          aria-label="Share to Message, not available in this preview"
        >
          Share to Message
        </button>
      </div>
    </article>
  );
}

export default SocialPost;
