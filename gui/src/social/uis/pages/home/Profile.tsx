import { createSignal, For, onMount, type JSX } from "solid-js";
import { A, useParams } from "@solidjs/router";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import Status, { type MediaType } from "@src/social/uis/components/Status";
import CoverPhoto from "@src/social/uis/components/profile/CoverPhoto";
import Card from "@src/social/uis/components/profile/card/Card";
import arrowLeftIcon from "@src/social/assets/arrow-left.svg";
import styles from "@src/social/styles/pages/home/Profile.module.css";

type ProfileTab = "posts" | "replies" | "media" | "likes";

const fallbackPosts: {
  name: string;
  handle: string;
  time: string;
  content: string;
  media?: MediaType;
  mediaCount?: number;
  mediaActiveIndex?: number;
  likes: number;
  comments: number;
  reposts: number;
}[] = [];

function Profile(): JSX.Element {
  const params = useParams<{ username: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = createSignal<ProfileTab>("posts");
  const [isStuck, setIsStuck] = createSignal(false);
  let sentinel!: HTMLDivElement;

  const username = (): string =>
    params.username ?? user()?.username ?? "profile";
  const displayName = (): string =>
    params.username ?? user()?.username ?? "User";

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });

  return (
    <div class={styles.page}>
      <div ref={sentinel} class={styles.sentinel} />
      <div class={styles.header} classList={{ [styles.stuck]: isStuck() }}>
        <A href="/social" class={styles.backBtn} title="Back">
          <img src={arrowLeftIcon} alt="Back" />
        </A>
        <span class={styles.headerHandle}>@{username()}</span>
      </div>
      <div class={styles.profileContainer}>
        <CoverPhoto />
        <Card
          name={displayName()}
          handle={username()}
          active="2h ago"
          bio="building things on the web. SolidJS enthusiast. design &amp; dev. coffee keeps me going."
          website="https://alexrivera.dev"
          activeTab={activeTab()}
          onTabChange={setActiveTab}
        />
      </div>
      <For each={fallbackPosts}>
        {(post) => (
          <Status
            name={post.name}
            handle={post.handle}
            time={post.time}
            content={post.content}
            media={post.media}
            mediaCount={post.mediaCount}
            mediaActiveIndex={post.mediaActiveIndex}
            likes={post.likes}
            comments={post.comments}
            reposts={post.reposts}
          />
        )}
      </For>
    </div>
  );
}

export default Profile;
