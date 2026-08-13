import { createSignal, onCleanup, onMount } from "solid-js";
import style from "../../styles/components/(home)/FeedHeader.module.css";

export default function FeedHeader() {
  const [active, setActive] = createSignal<"discover" | "following">("discover");
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
      <button
        type="button"
        class={active() === "discover" ? style.activeTab : undefined}
        onClick={() => setActive("discover")}
      >
        Discover
      </button>
      <button
        type="button"
        class={active() === "following" ? style.activeTab : undefined}
        onClick={() => setActive("following")}
      >
        Following
      </button>
    </header>
  );
}