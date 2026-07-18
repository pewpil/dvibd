import type { JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { User } from 'lucide-solid';
import { Icon } from '~/social/uis/components/Icon';
import styles from '~/social/styles/components/Composer.module.css';

type Props = {
  onSubmit: (content: string) => void;
};

const MAX: number = 280;

export function Composer(props: Props): JSX.Element {
  const [content, setContent] = createSignal('');

  const submit = (e: Event): void => {
    e.preventDefault();
    const value: string = content().trim();
    if (value.length === 0) return;
    props.onSubmit(value);
    setContent('');
  };

  return (
    <form class={styles.composer} onSubmit={submit}>
      <div class={styles.avatar} aria-hidden="true">
        <User size={18} />
      </div>
      <div class={styles.body}>
        <textarea
          class={styles.input}
          rows={2}
          maxLength={MAX}
          value={content()}
          onInput={(e) => setContent(e.currentTarget.value)}
          placeholder="What's on your mind?"
        />
        <div class={styles.actions}>
          <Icon name="image" size={18} />
          <span class={styles.count}>{content().length}/{MAX}</span>
          <button type="submit" class={styles.post} disabled={content().trim().length === 0}>
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
