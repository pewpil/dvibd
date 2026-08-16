import { createSignal, onCleanup, onMount, ParentProps } from "solid-js";
import style from "../../styles/components/(home)/FeedHeader.module.css";

interface FeedHeaderProps extends ParentProps {
  noBottomBorder?: boolean;
  ref?: (el: HTMLElement) => void;
}

export default function FeedHeader(props: FeedHeaderProps) {
  const [stuck, setStuck] = createSignal(false);
  let header!: HTMLElement;

  onMount(() => {
    const onScroll = () => setStuck(header.getBoundingClientRect().top <= 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  const headerClass = () =>
    [
      stuck() ? style.stuck : null,
      props.noBottomBorder ? style.noBottomBorder : null,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <header
      id={style.feedHeader}
      ref={(el) => {
        header = el;
        props.ref?.(el);
      }}
      class={headerClass()}
    >
      {props.children}
    </header>
  );
}