import { createSignal, For, Show } from "solid-js";
import { posts } from "../../data/social";
import FeedHeader from "../../components/(home)/FeedHeader";
import BookmarksHeader from "../../components/(home)/BookmarksHeader";
import Post from "../../components/(home)/post/Post";
import style from "../../styles/pages/(home)/bookmarks.module.css";

export default function Bookmarks() {
  const [tab, setTab] = createSignal<"stat" | "article">("stat");
  const [query, setQuery] = createSignal("");

  const visible = () =>
    posts.filter(
      (post) =>
        post.type === tab() &&
        (query() === "" ||
          post.text.toLowerCase().includes(query().toLowerCase())),
    );

  return [
    <FeedHeader>
      <BookmarksHeader
        tab={tab()}
        onTab={setTab}
        query={query()}
        onQuery={setQuery}
      />
    </FeedHeader>,
    <Show
      when={visible().length > 0}
      fallback={
        <section id={style.noBookmarks}>
          <h2 id={style.noBookmarksTitle}>No bookmarks yet</h2>
          <p id={style.noBookmarksText}>
            Stats and articles you save will be kept here for later.
          </p>
        </section>
      }
    >
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
    </Show>,
  ];
}