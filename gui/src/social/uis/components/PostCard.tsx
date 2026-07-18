import type { JSX } from 'solid-js';
import { User } from 'lucide-solid';
import { Icon } from '~/social/uis/components/Icon';
import type { Post } from '~/social/types';
import styles from '~/social/styles/components/PostCard.module.css';

type Props = {
  post: Post;
  onLike: (id: string) => void;
};

function timeAgo(iso: string): string {
  const then: number = new Date(iso).getTime();
  const diff: number = Date.now() - then;
  const mins: number = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours: number = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days: number = Math.floor(hours / 24);
  return `${days}d`;
}

export function PostCard(props: Props): JSX.Element {
  const post: Post = props.post;
  return (
    <article class={styles.card}>
      <div class={styles.avatar} aria-hidden="true">
        <User size={18} />
      </div>
      <div class={styles.body}>
        <div class={styles.head}>
          <span class={styles.author}>@{post.author.username}</span>
          <span class={styles.dot}>·</span>
          <span class={styles.time}>{timeAgo(post.createdAt)}</span>
        </div>
        <p class={styles.content}>{post.content}</p>
        <div class={styles.meta}>
          <button
            class={`${styles.action} ${post.likedByMe ? styles.liked : ''}`}
            onClick={() => props.onLike(post.id)}
          >
            <Icon name="heart" size={16} />
            <span>{post.likes}</span>
          </button>
          <span class={styles.action}>
            <Icon name="comment" size={16} />
            <span>{post.comments}</span>
          </span>
          <span class={styles.action}>
            <Icon name="repost" size={16} />
            <span>{post.reposts}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
