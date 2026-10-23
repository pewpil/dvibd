import { createAsync } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { getFeed } from "../../server/posts";
import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import Hero from "../../components/(home)/Hero";
import Post from "../../components/(home)/post/Post";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { loggedIn } = useAuth();
  const [tab, setTab] = createSignal("Discover");
  const feed = createAsync(() =>
    getFeed(tab() === "Following" ? "following" : "discover"),
  );

  return [
    <Show when={loggedIn()}>
      <FeedHeader>
        <FeedTabs
          tabs={["Discover", "Following"]}
          value={tab()}
          onChange={setTab}
        />
      </FeedHeader>
    </Show>,
    <Show when={!loggedIn()}>
      <Hero />
    </Show>,
    <For each={feed() ?? []}>
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
    </For>,
  ];
}
