import { createAsync, useParams } from "@solidjs/router";
import {
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  type JSX,
} from "solid-js";
import { useAuth } from "../../../contexts/AuthContext";
import { getProfilePage } from "../../../server/profiles";
import type { PostCard, ProfilePage } from "../../../types/social";
import BackButton from "../../../components/(home)/BackButton";
import FeedHeader from "../../../components/(home)/FeedHeader";
import ProfileCard from "../../../components/(home)/profile/ProfileCard";
import ProfileTabs from "../../../components/(home)/profile/ProfileTabs";
import Post from "../../../components/(home)/post/Post";
import style from "../../../styles/pages/(home)/profile.module.css";

const profileTabs = ["Posts", "Likes", "Replies", "Media"];

export default function Profile(): JSX.Element {
  const params = useParams<{ handle: string }>();
  const { user } = useAuth();
  const [tab, setTab] = createSignal("Posts");
  const [tabsStuck, setTabsStuck] = createSignal(false);
  const [headerHeight, setHeaderHeight] = createSignal(0);
  const handle = (): string => {
    const raw: string = params.handle;
    return raw.startsWith("@") ? raw.slice(1) : "";
  };
  const requestedHandle = (): string => {
    const raw: string = params.handle;
    return raw.startsWith("@") ? raw : `@${raw}`;
  };
  const page = createAsync(() => getProfilePage(handle()));
  let headerEl!: HTMLElement;

  const pageTitle = (): string => {
    const data: ProfilePage | null | undefined = page();
    if (data === null || data === undefined) {
      return requestedHandle();
    }
    return `@${data.profile.handle}`;
  };

  const ownProfile = (): boolean => {
    const data: ProfilePage | null | undefined = page();
    const current = user();
    if (data === null || data === undefined) {
      return false;
    }
    if (current === null || current === undefined) {
      return false;
    }
    return data.profile.handle.toLowerCase() === current.username.toLowerCase();
  };

  const measureHeader = (): void => {
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
      <div id={style.profileHeaderRow}>
        <BackButton />
        <h1 id={style.profileTitle}>{pageTitle()}</h1>
      </div>
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
          <ProfileCard
            user={profile()}
            complete={tabsStuck()}
            own={ownProfile()}
          />
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
                  id={post.id}
                  type={post.type}
                  name={post.name}
                  handle={post.handle}
                  time={post.time}
                  avatar={post.avatar}
                  text={post.text}
                  media={post.media}
                  views={post.views}
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
    <Show when={page() === null}>
      <section id={style.profileMissing}>
        <h2 id={style.profileMissingTitle}>This account doesn't exist</h2>
        <p id={style.profileMissingText}>
          The handle {requestedHandle()} is not attached to an account.
        </p>
      </section>
    </Show>,
  ];
}
