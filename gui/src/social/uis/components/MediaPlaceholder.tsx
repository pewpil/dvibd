import { For, Show, type JSX } from "solid-js";

import imageIcon from "@src/social/assets/image.svg";
import styles from "@src/social/styles/components/MediaPlaceholder.module.css";

type MediaPlaceholderProps = {
  type: "single" | "multi";
  count?: number;
  activeIndex?: number;
};

function buildDots(count: number, active: number) {
  const MAX_VISIBLE = 4;
  const dots: { index: number; shrunk: boolean }[] = [];

  if (count <= MAX_VISIBLE) {
    for (let i = 0; i < count; i++) {
      dots.push({ index: i, shrunk: false });
    }
    return dots;
  }

  let a: number;
  let b: number;

  if (active <= 1) {
    a = 1;
    b = 2;
  } else if (active >= count - 2) {
    a = count - 3;
    b = count - 2;
  } else {
    a = active;
    b = active + 1;
  }

  dots.push({ index: 0, shrunk: active !== 0 });
  dots.push({ index: a, shrunk: false });
  dots.push({ index: b, shrunk: false });
  dots.push({ index: count - 1, shrunk: active !== count - 1 });

  return dots;
}

function MediaPlaceholder(props: MediaPlaceholderProps): JSX.Element {
  const count = () => props.count ?? 1;
  const active = () => props.activeIndex ?? 0;

  return (
    <div class={styles.placeholder}>
      <div class={styles.mediaContent}>
        <img class={styles.mediaIcon} src={imageIcon} alt="" />
      </div>
      <Show when={props.type === "multi" && count() > 1}>
        <div class={styles.dots}>
          <For each={buildDots(count(), active())}>
            {(dot) => (
              <div
                class={styles.dot}
                classList={{
                  [styles.active]: dot.index === active(),
                  [styles.shrunk]: dot.shrunk,
                }}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default MediaPlaceholder;
