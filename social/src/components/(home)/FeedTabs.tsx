import { createSignal, For } from "solid-js";
import style from "../../styles/components/(home)/FeedTabs.module.css";

interface FeedTabsProps {
  tabs: string[];
  initial?: string;
}

export default function FeedTabs(props: FeedTabsProps) {
  const [active, setActive] = createSignal(props.initial ?? props.tabs[0]);

  return (
    <div id={style.feedTabs}>
      <For each={props.tabs}>
        {(tab) => (
          <button
            type="button"
            class={active() === tab ? style.activeTab : undefined}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        )}
      </For>
    </div>
  );
}