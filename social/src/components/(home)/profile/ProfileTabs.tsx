import { createSignal, For, onCleanup, onMount } from "solid-js";
import style from "../../../styles/components/(home)/profile/ProfileTabs.module.css";

interface ProfileTabsProps {
  tabs: string[];
  value: string;
  onChange: (tab: string) => void;
  headerHeight?: number;
  onStuckChange?: (stuck: boolean) => void;
  inHeader?: boolean;
}

export default function ProfileTabs(props: ProfileTabsProps) {
  const [stuck, setStuck] = createSignal(false);
  let tabsEl!: HTMLDivElement;

  const tabsClass = () =>
    [
      props.inHeader ? style.inHeader : undefined,
      stuck() ? style.hiddenTabs : undefined,
    ]
      .filter(Boolean)
      .join(" ");

  onMount(() => {
    const onScroll = () => {
      if (!props.headerHeight) return;
      const rect = tabsEl.getBoundingClientRect();
      if (rect.top <= props.headerHeight) setStuck(true);
      else if (rect.top >= props.headerHeight + rect.height) setStuck(false);
      props.onStuckChange?.(stuck());
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    onCleanup(() => window.removeEventListener("scroll", onScroll));
  });

  return (
    <div
      id={style.profileTabs}
      ref={tabsEl}
      class={tabsClass()}
      role="tablist"
    >
      <For each={props.tabs}>
        {(tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={props.value === tab}
            class={props.value === tab ? style.activeTab : undefined}
            onClick={() => props.onChange(tab)}
          >
            {tab}
          </button>
        )}
      </For>
    </div>
  );
}