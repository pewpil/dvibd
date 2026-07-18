import type { JSX } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { A, useNavigate } from '@solidjs/router';
import { Icon } from '~/social/uis/components/Icon';
import { Composer } from '~/social/uis/components/Composer';
import { PostCard } from '~/social/uis/components/PostCard';
import { isAuthenticated, currentUser } from '~/social/auth';
import type { Post } from '~/social/types';
import styles from '~/social/styles/pages/app/Feed.module.css';

const seed: Post[] = [
  {
    id: 'p1',
    author: { id: 'u1', email: 'ada@dvibd.app', username: 'ada' },
    content:
      'Shipped my first calm little side project this weekend. No notifications, no streaks — just a place to write things down. Feels good.',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    likes: 24,
    likedByMe: false,
    comments: 3,
    reposts: 1,
  },
  {
    id: 'p2',
    author: { id: 'u2', email: 'lin@dvibd.app', username: 'lin' },
    content:
      'Hot take: the best social app is the one you forget to check. Building toward that over here.',
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    likes: 61,
    likedByMe: true,
    comments: 12,
    reposts: 4,
  },
  {
    id: 'p3',
    author: { id: 'u3', email: 'grace@dvibd.app', username: 'grace' },
    content:
      'Reminder that your feed is someone else’s business model. Ours is just a quiet room with good light.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likes: 140,
    likedByMe: false,
    comments: 9,
    reposts: 18,
  },
];

export default function Feed(): JSX.Element {
  const navigate = useNavigate();
  const [posts, setPosts] = createSignal<Post[]>(seed);

  const addPost = (content: string): void => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    const me = currentUser();
    if (!me) return;
    const post: Post = {
      id: `local-${Date.now()}`,
      author: me,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByMe: false,
      comments: 0,
      reposts: 0,
    };
    setPosts([post, ...posts()]);
  };

  const toggleLike = (id: string): void => {
    setPosts(
      posts().map((p) =>
        p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  };

  return (
    <div class={styles.page}>
      <header class={`container ${styles.head}`}>
        <h1 class={styles.title}>Home</h1>
        <p class={styles.lead}>The latest from the people you follow.</p>
      </header>

      <div class={`container ${styles.feed}`}>
        {isAuthenticated() ? (
          <Composer onSubmit={addPost} />
        ) : (
          <div class={styles.gate}>
            <Icon name="social" size={28} />
            <p>Log in to post and join the conversation.</p>
            <A href="/login" class={styles.gateLink}>
              Log in <Icon name="arrow" size={16} />
            </A>
          </div>
        )}

        <For each={posts()}>
          {(post) => <PostCard post={post} onLike={toggleLike} />}
        </For>
      </div>
    </div>
  );
}
