import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { currentUser, posts } from "../../data/social";
import FeedHeader from "../../components/(home)/FeedHeader";
import ProfileCard from "../../components/(home)/profile/ProfileCard";
import ProfileTabs from "../../components/(home)/profile/ProfileTabs";
import Post from "../../components/(home)/post/Post";
import style from "../../styles/pages/(home)/profile.module.css";

const profileTabs = ["Posts", "Likes", "Replies", "Media"];

export default function Profile() {
  const [tab, setTab] = createSignal("Posts");
  const [tabsStuck, setTabsStuck] = createSignal(false);
  const [headerHeight, setHeaderHeight] = createSignal(0);
  let headerEl!: HTMLElement;

  const measureHeader = () => {
    if (!tabsStuck() && headerEl) setHeaderHeight(headerEl.offsetHeight);
  };

  onMount(() => {
    measureHeader();
    window.addEventListener("resize", measureHeader);
    onCleanup(() => window.removeEventListener("resize", measureHeader));
  });

  const visible = () => {
    switch (tab()) {
      case "Likes":
        return posts.filter((post) => post.likedByUser);
      case "Replies":
        return posts.filter(
          (post) => post.handle === currentUser.handle && post.replyTo,
        );
      case "Media":
        return posts.filter(
          (post) => post.handle === currentUser.handle && post.media,
        );
      default:
        return posts.filter((post) => post.handle === currentUser.handle);
    }
  };

  return [
    <FeedHeader
      ref={(el) => (headerEl = el)}
      noBottomBorder={tabsStuck()}
    >
      <h1 id={style.profileTitle}>@{currentUser.handle}</h1>
      <Show when={tabsStuck()}>
        <ProfileTabs
          tabs={profileTabs}
          value={tab()}
          onChange={setTab}
          inHeader
        />
      </Show>
    </FeedHeader>,
    <section id={style.profileSection}>
      <img id={style.cover} src={currentUser.cover} alt="" />
      <ProfileCard user={currentUser} complete={tabsStuck()} />
      <ProfileTabs
        tabs={profileTabs}
        value={tab()}
        onChange={setTab}
        headerHeight={headerHeight()}
        onStuckChange={setTabsStuck}
      />
      <div id={style.profilePosts}>
        <For each={visible()}>
          {(post) => (
            <Post
              name={post.author}
              handle={post.handle}
              time={post.time}
              avatar={post.avatar}
              text={post.text}
              media={post.media}
              reply={post.reply}
              repost={post.repost}
              like={post.like}
              save={post.save}
            />
          )}
        </For>
      </div>
    </section>,
  ];
}