import { For, type JSX } from "solid-js";

import Status from "@src/social/uis/components/Status";
import styles from "@src/social/styles/pages/home/Feed.module.css";

type StatusData = {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  likes?: number;
  comments?: number;
  reposts?: number;
};

type FeedProps = {
  statuses?: StatusData[];
};

const fallbackStatuses: StatusData[] = [
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "2h",
    content: "just shipped the new social feed layout. feeling good about this one.",
    likes: 24,
    comments: 7,
    reposts: 3,
  },
  {
    name: "Sam Chen",
    handle: "samchen",
    time: "4h",
    content: "does anyone else think nested CSS is the best thing to happen to frontend?",
    likes: 142,
    comments: 31,
    reposts: 12,
  },
  {
    name: "Jordan Taylor",
    handle: "jordant",
    time: "6h",
    content: "working on a side project with SolidJS. the signals model is incredibly clean.",
    likes: 89,
    comments: 14,
    reposts: 6,
  },
];

function Feed(props: FeedProps): JSX.Element {
  const items = () => props.statuses ?? fallbackStatuses;

  return (
    <div class={styles.feed}>
      <For each={items()}>
        {(status) => (
          <Status
            avatar={status.avatar}
            name={status.name}
            handle={status.handle}
            time={status.time}
            content={status.content}
            likes={status.likes}
            comments={status.comments}
            reposts={status.reposts}
          />
        )}
      </For>
    </div>
  );
}

export default Feed;