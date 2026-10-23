import { createAsync } from "@solidjs/router";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { getProfilePage } from "../../server/profiles";
import type { PostCard, ProfilePage } from "../../types/social";
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
  const page = createAsync(() => getProfilePage());
  let headerEl!: HTMLElement;

  const measureHeader = () => {
    if (!tabsStuck() && headerEl) setHeaderHeight(headerEl.offsetHeight);
  };

  onMount(() => {
    measureHeader();
    window.addEventListener("resize", measureHeader);
    onCleanup(() => window.removeEventListener("resize", measureHeader));
  });

  const visible = (): PostCard[] => {
    const data: ProfilePage | null | undefined = page();
    if (data === null || data === undefined) {
      return [];
    }
    switch (tab()) {
      case "Likes":
        return data.likes;
      case "Replies":
        return data.replies;
      case "Media":
        return data.media;
      default:
        return data.posts;
    }
  };

  return [
    <FeedHeader ref={(el) => (headerEl = el)} noBottomBorder={tabsStuck()}>
      <h1 id={style.profileTitle}>@{page()?.profile.handle ?? ""}</h1>
      <Show when={tabsStuck()}>
        <ProfileTabs
          tabs={profileTabs}
          value={tab()}
          onChange={setTab}
          inHeader
        />
      </Show>
    </FeedHeader>,
    <Show when={page()?.profile}>
      {(profile) => (
        <section id={style.profileSection}>
          <img id={style.cover} src={profile().cover} alt="" />
          <ProfileCard user={profile()} complete={tabsStuck()} />
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
                  name={post.name}
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
        </section>
      )}
    </Show>,
  ];
}
