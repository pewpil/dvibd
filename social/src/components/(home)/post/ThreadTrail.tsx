import { A } from "@solidjs/router";
import { For, Show, type JSX } from "solid-js";
import { postPath } from "../../../lib/postPath";
import type { PostCard } from "../../../types/social";
import style from "../../../styles/components/(home)/post/ThreadTrail.module.css";

interface ThreadTrailProps {
  entries: PostCard[];
  onSelect: (index: number) => void;
}

export default function ThreadTrail(props: ThreadTrailProps): JSX.Element {
  const excerpt = (text: string): string =>
    text.replace(/\s+/g, " ").trim().slice(0, 60);
  const linkLabel = (entry: PostCard): string => {
    const base: string = `Open earlier post by ${entry.name} (@${entry.handle}), ${entry.time}`;
    const text: string = excerpt(entry.text);
    return text === "" ? base : `${base}: ${text}`;
  };

  const handleSelect = (
    index: number,
    event: MouseEvent & { currentTarget: HTMLAnchorElement },
  ): void => {
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    props.onSelect(index);
  };

  return (
    <nav id={style.threadTrail} aria-label="Clicked reply chain">
      <ol>
        <For each={props.entries}>
          {(entry, index) => (
            <li>
              <A
                id={style.threadTrailRow}
                href={postPath(entry)}
                aria-label={linkLabel(entry)}
                onClick={(event) => handleSelect(index(), event)}
              >
                <img
                  id={style.threadTrailAvatar}
                  data-trail-avatar="true"
                  src={entry.avatar ?? "/profile-picture.svg"}
                  alt=""
                />
                <span id={style.threadTrailBody}>
                  <span id={style.threadTrailMeta}>
                    <span id={style.threadTrailName}>{entry.name}</span>
                    <span id={style.threadTrailHandle}>@{entry.handle}</span>
                    <span id={style.threadTrailTime}>{entry.time}</span>
                  </span>
                  <Show when={excerpt(entry.text) !== ""}>
                    <span id={style.threadTrailExcerpt}>
                      {excerpt(entry.text)}
                    </span>
                  </Show>
                </span>
              </A>
            </li>
          )}
        </For>
      </ol>
    </nav>
  );
}
