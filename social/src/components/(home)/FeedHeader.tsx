import { createSignal, onCleanup, onMount, ParentProps } from "solid-js";
import style from "../../styles/components/(home)/FeedHeader.module.css";

export default function FeedHeader(props: ParentProps) {
  const [stuck, setStuck] = createSignal(false);
  let header!: HTMLElement;

  onMount(() => {
    const onScroll = () => setStuck(header.getBoundingClientRect().top <= 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  return (
    <header
      id={style.feedHeader}
      ref={header}
      class={stuck() ? style.stuck : undefined}
    >
      {props.children}
    </header>
  );
}