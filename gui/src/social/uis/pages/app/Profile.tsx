import type { JSX } from 'solid-js';
import { createSignal, For } from 'solid-js';
import { A } from '@solidjs/router';
import { User } from 'lucide-solid';
import { Action } from '~/social/uis/components/Action';
import { Icon } from '~/social/uis/components/Icon';
import { PostCard } from '~/social/uis/components/PostCard';
import { isAuthenticated, currentUser, logout } from '~/social/auth';
import type { Post } from '~/social/types';
import styles from '~/social/styles/pages/app/Profile.module.css';

const mine: Post[] = [
  {
    id: 'm1',
    author: { id: 'me', email: 'me@dvibd.app', username: 'you' },
    content: 'This is your profile. Posts you write will show up here.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: 5,
    likedByMe: false,
    comments: 1,
    reposts: 0,
  },
  {
    id: 'm2',
    author: { id: 'me', email: 'me@dvibd.app', username: 'you' },
    content: 'Calm, private, chronological. No algorithmic surprises.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    likes: 12,
    likedByMe: true,
    comments: 2,
    reposts: 0,
  },
];

export default function Profile(): JSX.Element {
  const [posts, setPosts] = createSignal<Post[]>(mine);

  const toggleLike = (id: string): void => {
    setPosts(
      posts().map((p) =>
        p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  };

  if (!isAuthenticated()) {
    return (
      <div class={styles.page}>
        <div class={`container ${styles.gate}`}>
          <Icon name="user" size={28} />
          <h1 class={styles.title}>Your profile</h1>
          <p class={styles.lead}>Log in to see your posts and account.</p>
          <div class={styles.gateActions}>
            <Action href="/login" variant="primary" color="purple">
              Log in
            </Action>
            <Action href="/signup" variant="secondary">
              Sign up
            </Action>
          </div>
        </div>
      </div>
    );
  }

  const me = currentUser();
  const username: string = me?.username ?? 'you';

  return (
    <div class={styles.page}>
      <header class={`container ${styles.head}`}>
        <div class={styles.avatar} aria-hidden="true">
          <User size={28} />
        </div>
        <div class={styles.id}>
          <h1 class={styles.title}>@{username}</h1>
          <p class={styles.lead}>{me?.email ?? ''}</p>
        </div>
        <div class={styles.headActions}>
          <Action href="/" variant="ghost" color="purple">
            Back to dvibd
          </Action>
          <Action variant="ghost" color="purple" onClick={() => logout()}>
            <Icon name="logout" size={16} />
            Log out
          </Action>
        </div>
      </header>

      <div class={`container ${styles.feed}`}>
        <For each={posts()}>
          {(post) => <PostCard post={post} onLike={toggleLike} />}
        </For>
      </div>
    </div>
  );
}
