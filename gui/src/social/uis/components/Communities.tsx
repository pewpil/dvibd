import { For, type JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/Communities.module.css";

type SuggestedCommunity = {
  name: string;
  members: number;
};

const fallbackCommunities: SuggestedCommunity[] = [
  { name: "SolidJS Devs", members: 3420 },
  { name: "UI Design", members: 8910 },
  { name: "TypeScript", members: 12450 },
];

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