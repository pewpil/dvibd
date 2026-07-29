import { createSignal, type JSX } from "solid-js";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import { createStatus } from "@src/social/lib/api";
import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import imageIcon from "@src/social/assets/image.svg";
import styles from "@src/social/styles/components/CreateStatus.module.css";

type CreateStatusProps = {
  onStatusCreated?: () => void;
};

function CreateStatus(props: CreateStatusProps): JSX.Element {
  const { user } = useAuth();
  const [content, setContent] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const remaining = (): number => 256 - content().length;
  const overLimit = (): boolean => remaining() < 0;

  const handleSubmit = async () => {
    const text: string = content().trim();
    if (text.length === 0 || overLimit() || isSubmitting()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createStatus(text);
      setContent("");
      props.onStatusCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div class={styles.composer}>
      <img
        class={styles.avatar}
        src={defaultPfp}
        alt={user()?.username ?? "Your avatar"}
      />
      <div class={styles.body}>
        <textarea
          class={styles.textarea}
          value={content()}
          onInput={(e) => setContent(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's on your mind?"
          maxlength={300}
          rows={3}
          disabled={isSubmitting()}
        />
        <div class={styles.footer}>
          <div class={styles.left}>
            <button type="button" class={styles.mediaBtn} title="Add media">
              <img src={imageIcon} alt="Media" />
            </button>
          </div>
          <div
            class={styles.counter}
            classList={{ [styles.over]: overLimit() }}
          >
            {remaining()}/256
          </div>
          <button
            type="button"
            class={styles.submit}
            disabled={
              content().trim().length === 0 || overLimit() || isSubmitting()
            }
            onClick={handleSubmit}
          >
            {isSubmitting() ? "Posting..." : "Post"}
          </button>
        </div>
        {error() && <div class={styles.error}>{error()}</div>}
      </div>
    </div>
  );
}

export default CreateStatus;
