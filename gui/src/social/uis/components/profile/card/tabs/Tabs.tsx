import { For, type JSX } from "solid-js";

import styles from "@src/social/styles/components/profile/card/tabs/Tabs.module.css";

type Tab = "posts" | "replies" | "media" | "likes";

type TabsProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabLabels: Record<Tab, string> = {
  posts: "Posts",
  replies: "Replies",
  media: "Media",
  likes: "Likes",
};

const tabs = Object.keys(tabLabels) as Tab[];

function Tabs(props: TabsProps): JSX.Element {
  return (
    <div class={styles.tabs}>
      <For each={tabs}>
        {(tab) => (
          <button
            class={styles.tab}
            classList={{ [styles.tabActive]: props.active === tab }}
            onClick={() => props.onChange(tab)}
          >
            {tabLabels[tab]}
          </button>
        )}
      </For>
    </div>
  );
}

export default Tabs;
