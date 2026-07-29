import { For, type JSX } from "solid-js";

import styles from "@src/social/styles/components/panel/Communities.module.css";

type SuggestedCommunity = {
  name: string;
  members: number;
};

const fallbackCommunities: SuggestedCommunity[] = [];

function Communities(): JSX.Element {
  return (
    <div class={styles.communities}>
      <h3 class={styles.heading}>Communities</h3>
      <div class={styles.list}>
        <For each={fallbackCommunities}>
          {(community) => (
            <div class={styles.community}>
              <div class={styles.icon} />
              <div class={styles.info}>
                <span class={styles.name}>{community.name}</span>
                <span class={styles.members}>{community.members.toLocaleString()} members</span>
              </div>
              <button class={styles.join}>Join</button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Communities;