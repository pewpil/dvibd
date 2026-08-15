import { For } from "solid-js";
import { posts } from "../../data/social";
import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import Hero from "../../components/(home)/Hero";
import Post from "../../components/(home)/post/Post";

export default function Home() {
  return [
    <FeedHeader>
      <FeedTabs tabs={["Discover", "Following"]} />
    </FeedHeader>,
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