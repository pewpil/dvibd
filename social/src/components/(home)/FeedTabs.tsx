import { createSignal, For } from "solid-js";
import style from "../../styles/components/(home)/FeedTabs.module.css";

interface FeedTabsProps {
  tabs: string[];
  initial?: string;
  value?: string;
  onChange?: (tab: string) => void;
}

export default function FeedTabs(props: FeedTabsProps) {
  const [internal, setInternal] = createSignal(props.initial ?? props.tabs[0]);
  const active = () => props.value ?? internal();
  const select = (tab: string) => {
    if (props.onChange) props.onChange(tab);
    else setInternal(tab);
  };

  return (
    <div id={style.feedTabs}>
      <For each={props.tabs}>
        {(tab) => (
          <button
            type="button"
            class={active() === tab ? style.activeTab : undefined}
            onClick={() => select(tab)}
          >
            {tab}
          </button>
        )}
      </For>
    </div>
  );
}