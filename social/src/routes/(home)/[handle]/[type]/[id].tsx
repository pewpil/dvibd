import { Title } from "@solidjs/meta";
import {
  A,
  createAsync,
  useAction,
  useParams,
  type RouteDefinition,
} from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createSignal,
  on,
  onMount,
  type JSX,
} from "solid-js";
import { createReply, getPostThread, recordView } from "../../../../server/posts";
import FeedHeader from "../../../../components/(home)/FeedHeader";
import Composer from "../../../../components/(home)/Composer";
import Post from "../../../../components/(home)/post/Post";
import { useAuth } from "../../../../contexts/AuthContext";
import style from "../../../../styles/pages/(home)/postThread.module.css";

export const route: RouteDefinition = {
  matchFilters: {
    handle: /^@.+$/,
    type: /^status$/,
  },
};

export default function PostPage(): JSX.Element {
  const params = useParams<{ handle: string; type: string; id: string }>();
  const { loggedIn } = useAuth();
  let threadTitle!: HTMLHeadingElement;
  const [missingHeading, setMissingHeading] =
    createSignal<HTMLHeadingElement>();
  const [viewOverride, setViewOverride] = createSignal<number | null>(null);
  const viewPost = useAction(recordView);
  const page = createAsync(() =>
    getPostThread(params.handle, params.type, params.id),
  );

  const pageTitle = (): string => {
    const data = page();
    if (data === null) {
      return "Post not found · social";
    }
    if (data === undefined) {
      return "Post · social";
    }
    return `Post by @${data.post.handle}, ${data.post.time} · social`;
  };

  onMount(() => {
    threadTitle.focus({ preventScroll: true });
  });

  createEffect(
    on(
      () => `${params.handle}/${params.type}/${params.id}`,
      () => {
        threadTitle.focus({ preventScroll: true });
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => `${params.handle}/${params.type}/${params.id}`,
      () => {
        const handle: string = params.handle;
        const type: string = params.type;
        const id: string = params.id;
        setViewOverride(null);
        void viewPost(handle, type, id).then((result) => {
          if (
            params.handle === handle &&
            params.type === type &&
            params.id === id &&
            result.ok
          ) {
            setViewOverride(result.views);
          }
        });
      },
    ),
  );

  createEffect(() => {
    if (page() === null) {
      queueMicrotask(() => {
        missingHeading()?.focus({ preventScroll: true });
      });
    }
  });

  createEffect(() => {
    document.title = pageTitle();
  });

  return [
    <Title>{pageTitle()}</Title>,
    <FeedHeader>
      <h1 id={style.threadTitle} tabindex="-1" ref={threadTitle}>
        Post
      </h1>
    </FeedHeader>,
    <Show when={page() === null}>
      <section id={style.postMissing}>
        <h2
          id={style.postMissingTitle}
          tabindex="-1"
          ref={setMissingHeading}
        >
          This post doesn't exist
        </h2>
        <p id={style.postMissingText}>
          The link may be broken, or the post may have been removed.
        </p>
        <A id={style.postMissingLink} href="/">
          Back to home
        </A>
      </section>
    </Show>,
    <Show when={page()}>
      {(data) => [
        <Post
          id={data().post.id}
          type={data().post.type}
          name={data().post.name}
          handle={data().post.handle}
          time={data().post.time}
          avatar={data().post.avatar}
          text={data().post.text}
          media={data().post.media}
          views={viewOverride() ?? data().post.views}
          repost={data().post.repost}
          like={data().post.like}
          save={data().post.save}
          permalink={false}
        />,
        <section
          id={style.threadReplies}
          aria-labelledby={style.repliesTitle}
        >
          <Show when={loggedIn()}>
            <Composer
              action={createReply}
              parentId={data().post.id}
              placeholder="Reply"
              ariaLabel="Reply text"
              submitLabel="Reply"
              pendingLabel="Replying..."
              errorMessage="Could not publish your reply. Try again."
            />
          </Show>
          <h2 id={style.repliesTitle}>Replies</h2>
          <Show
            when={data().replies.length > 0}
            fallback={<p id={style.repliesEmpty}>No replies yet.</p>}
          >
            <For each={data().replies}>
              {(reply) => (
                <Post
                  id={reply.id}
                  type={reply.type}
                  name={reply.name}
                  handle={reply.handle}
                  time={reply.time}
                  avatar={reply.avatar}
                  text={reply.text}
                  media={reply.media}
                  views={reply.views}
                  repost={reply.repost}
                  like={reply.like}
                  save={reply.save}
                />
              )}
            </For>
          </Show>
        </section>,
      ]}
    </Show>,
  ];
}
