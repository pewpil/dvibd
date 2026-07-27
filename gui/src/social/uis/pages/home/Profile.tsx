import { createSignal, For, onMount, type JSX } from "solid-js";
import { A } from "@solidjs/router";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import Status from "@src/social/uis/components/Status";
import CoverPhoto from "@src/social/uis/components/profile/CoverPhoto";
import Card from "@src/social/uis/components/profile/card/Card";
import arrowLeftIcon from "@src/social/assets/arrow-left.svg";
import styles from "@src/social/styles/pages/home/Profile.module.css";

type ProfileTab = "posts" | "replies" | "media" | "likes";

const fallbackPosts = [
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "2h",
    content:
      "just shipped the new social feed layout. feeling good about this one.",
    media: "single" as const,
    likes: 24,
    comments: 7,
    reposts: 3,
  },
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "5h",
    content:
      "solid state management is underrated. the ecosystem around it is maturing fast.",
    likes: 56,
    comments: 12,
    reposts: 4,
  },
  {
    name: "Alex Rivera",
    handle: "alexrivera",
    time: "1d",
    content:
      "took a walk and thought about nothing but CSS variables for an hour. highly recommend.",
    media: "multi" as const,
    mediaCount: 3,
    mediaActiveIndex: 0,
    likes: 134,
    comments: 28,
    reposts: 11,
  },
];

function Profile(): JSX.Element {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = createSignal<ProfileTab>("posts");
  const [isStuck, setIsStuck] = createSignal(false);
  let sentinel!: HTMLDivElement;

  const username = () => user()?.username ?? "profile";
  const displayName = () => user()?.username ?? "User";

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
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
