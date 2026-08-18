import { For, Show } from "solid-js";
import { posts } from "../../data/social";
import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import Hero from "../../components/(home)/Hero";
import Post from "../../components/(home)/post/Post";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { loggedIn } = useAuth();

  return [
    <Show when={loggedIn()}>
      <FeedHeader>
        <FeedTabs tabs={["Discover", "Following"]} />
      </FeedHeader>
    </Show>,
    <Hero />,
    <For each={posts}>
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
    </For>,
  ];
}