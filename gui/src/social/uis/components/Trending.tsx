import { For, type JSX } from "solid-js";

import styles from "@src/dvibd/styles/components/Trending.module.css";

type TrendingTopic = {
  tag: string;
  posts: number;
};

const fallbackTopics: TrendingTopic[] = [
  { tag: "#solidjs", posts: 1240 },
  { tag: "#webdev", posts: 3420 },
  { tag: "#uiux", posts: 2150 },
  { tag: "#opensource", posts: 1890 },
  { tag: "#typescript", posts: 2860 },
];

function Trending(): JSX.Element {
  return (
    <div class={styles.trending}>
      <h3 class={styles.heading}>Trending</h3>
      <div class={styles.list}>
        <For each={fallbackTopics}>
          {(topic) => (
            <div>
              <span class={styles.tag}>{topic.tag}</span>
              <span class={styles.count}>{topic.posts} posts</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Trending;