import { For, Show } from "solid-js";
import image from "../../../assets/components/post/mediaPlacholder/image.svg";
import style from "../../../styles/components/(home)/post/MediaPlaceholder.module.css";

interface MediaPlaceholderProps {
  count?: number;
}

export default function MediaPlaceholder({ count = 1 }: MediaPlaceholderProps) {
  const dots = () => {
    const total = Math.min(count, 5);
    const overflow = count > 5;
    return Array.from({ length: total }, (_, i) => ({
      edge: overflow && (i === 0 || i === total - 1),
      active: overflow ? i === 2 : i === 0,
    }));
  };

  return (
    <figure id={style.mediaPlaceholder}>
      <img id={style.mediaIcon} src={image} alt="" />
      <Show when={count > 1}>
        <ol id={style.mediaDots}>
          <For each={dots()}>
            {(dot) => (
              <li
                classList={{
                  [style.mediaDot]: true,
                  [style.mediaDotEdge]: dot.edge,
                  [style.mediaDotActive]: dot.active,
                }}
              />
            )}
          </For>
        </ol>
      </Show>
    </figure>
  );
}