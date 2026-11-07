import { Title } from "@solidjs/meta";
import {
  A,
  createAsync,
  revalidate,
  useAction,
  useNavigate,
  useParams,
  type RouteDefinition,
} from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  type JSX,
} from "solid-js";
import { createReply, getPostThread, recordView } from "../../../../server/posts";
import type { PostCard } from "../../../../types/social";
import { postPath } from "../../../../lib/postPath";
import BackButton from "../../../../components/(home)/BackButton";
import FeedHeader from "../../../../components/(home)/FeedHeader";
import Composer from "../../../../components/(home)/Composer";
import Post from "../../../../components/(home)/post/Post";
import ThreadTrail from "../../../../components/(home)/post/ThreadTrail";
import { useAuth } from "../../../../contexts/AuthContext";
import style from "../../../../styles/pages/(home)/postThread.module.css";

export const route: RouteDefinition = {
  matchFilters: {
    handle: /^@.+$/,
    type: /^status$/,
  },
};

interface RailMetrics {
  visible: boolean;
  top: number;
  left: number;
  height: number;
}

const railMatches = (current: RailMetrics, next: RailMetrics): boolean => {
  if (current.visible !== next.visible) {
    return false;
  }
  return (
    Math.abs(current.top - next.top) < 0.5 &&
    Math.abs(current.left - next.left) < 0.5 &&
    Math.abs(current.height - next.height) < 0.5
  );
};

export default function PostPage(): JSX.Element {
  const params = useParams<{ handle: string; type: string; id: string }>();
  const navigate = useNavigate();
  const { loggedIn } = useAuth();
  let threadTitle!: HTMLHeadingElement;
  let chainEl: HTMLDivElement | undefined;
  let railObserver: ResizeObserver | undefined;
  const [missingHeading, setMissingHeading] =
    createSignal<HTMLHeadingElement>();
  const [viewOverride, setViewOverride] = createSignal<number | null>(null);
  const [trail, setTrail] = createSignal<PostCard[]>([]);
  const [rail, setRail] = createSignal<RailMetrics>({
    visible: false,
    top: 0,
    left: 0,
    height: 0,
  });
  const viewPost = useAction(recordView);
  const page = createAsync(() =>
    getPostThread(params.handle, params.type, params.id),
  );

  const currentTrailIndex = (): number =>
    trail().findIndex((entry) => entry.id === params.id);
  const trailDepth = (): number => Math.max(0, currentTrailIndex());

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

  const applyRail = (next: RailMetrics): void => {
    if (railMatches(rail(), next)) {
      return;
    }
    setRail(next);
  };

  const hideRail = (): void => {
    applyRail({ visible: false, top: 0, left: 0, height: 0 });
  };

  const measureRail = (): void => {
    if (chainEl === undefined || trailDepth() === 0) {
      hideRail();
      return;
    }
    const firstAvatar =
      chainEl.querySelector<HTMLImageElement>("[data-trail-avatar]");
    const currentAvatar =
      chainEl.querySelector<HTMLImageElement>("article > header > img");
    if (firstAvatar === null || currentAvatar === null) {
      hideRail();
      return;
    }
    const chainRect = chainEl.getBoundingClientRect();
    const firstRect = firstAvatar.getBoundingClientRect();
    const lastRect = currentAvatar.getBoundingClientRect();
    const top = firstRect.top - chainRect.top + firstRect.height / 2;
    const left = firstRect.left - chainRect.left + firstRect.width / 2;
    const bottom = lastRect.top - chainRect.top + lastRect.height / 2;
    if (bottom <= top) {
      hideRail();
      return;
    }
    applyRail({ visible: true, top, left, height: bottom - top });
  };

  const setChainElement = (el: HTMLDivElement): void => {
    chainEl = el;
    railObserver?.disconnect();
    railObserver = new ResizeObserver(() => measureRail());
    railObserver.observe(el);
    measureRail();
  };

  const railStyle = (): JSX.CSSProperties => ({
    top: `${rail().top}px`,
    left: `${rail().left}px`,
    height: `${rail().height}px`,
  });

  const refetchThread = (): void => {
    void revalidate(
      getPostThread.keyFor(params.handle, params.type, params.id),
    );
  };

  const openReply = (reply: PostCard): boolean => {
    if (reply.type !== "stat") {
      return false;
    }
    const existing: number = trail().findIndex(
      (entry) => entry.id === reply.id,
    );
    if (existing !== -1) {
      navigate(postPath(reply));
      return true;
    }
    const currentIndex: number = currentTrailIndex();
    const currentPost: PostCard | undefined = page()?.post;
    const base: PostCard[] =
      currentIndex >= 0
        ? trail().slice(0, currentIndex + 1)
        : currentPost !== undefined
          ? [currentPost]
          : [];
    setTrail([...base, reply]);
    navigate(postPath(reply));
    return true;
  };

  const goToTrail = (index: number): void => {
    const entry: PostCard | undefined = trail()[index];
    if (entry === undefined) {
      return;
    }
    navigate(postPath(entry));
  };

  onMount(() => {
    threadTitle.focus({ preventScroll: true });
  });

  onCleanup(() => {
    railObserver?.disconnect();
  });

  createEffect(
    on(
      () => page()?.post.id,
      (postId, previousId) => {
        if (postId === undefined || postId === previousId) {
          return;
        }
        const data = page();
        if (data === null || data === undefined) {
          return;
        }
        if (currentTrailIndex() === -1) {
          setTrail([data.post]);
        }
        measureRail();
      },
    ),
  );

  createEffect(
    on(
      () => `${params.handle}/${params.type}/${params.id}`,
      () => {
        const handle: string = params.handle;
        const type: string = params.type;
        const id: string = params.id;
        threadTitle.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "instant" });
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
      <div id={style.threadHeaderRow}>
        <BackButton />
        <h1 id={style.threadTitle} tabindex="-1" ref={threadTitle}>
          Post
        </h1>
      </div>
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
    <Show when={page() !== null}>
      <div id={style.threadChain} ref={setChainElement}>
        <Show when={rail().visible}>
          <div
            id={style.threadRail}
            style={railStyle()}
            aria-hidden="true"
          />
        </Show>
        <Show when={trailDepth() > 0}>
          <ThreadTrail
            entries={trail().slice(0, trailDepth())}
            onSelect={goToTrail}
          />
        </Show>
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
                aria-label={`Replies to @${data().post.handle}`}
              >
                <h2 id={style.repliesTitle}>Replies</h2>
                <Show when={loggedIn()}>
                  <Show when={data().post.id} keyed>
                    {(postId) => (
                      <Composer
                        action={createReply}
                        parentId={postId}
                        parentHandle={data().post.handle}
                        placeholder="Reply"
                        ariaLabel="Reply text"
                        submitLabel="Reply"
                        pendingLabel="Replying..."
                        errorMessage="Could not publish your reply. Try again."
                        onPosted={refetchThread}
                      />
                    )}
                  </Show>
                </Show>
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
                        onOpen={() => openReply(reply)}
                      />
                    )}
                  </For>
                </Show>
              </section>,
            ]}
          </Show>
      </div>
    </Show>,
  ];
}
