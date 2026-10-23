import { createEffect, createSignal, Show } from "solid-js";
import { useSubmission } from "@solidjs/router";
import { createPost } from "../../server/posts";
import { useAuth } from "../../contexts/AuthContext";
import {
  MAX_STAT_LENGTH,
  type CreatePostResult,
} from "../../types/social";
import imageIcon from "../../assets/components/(home)/composer/image.svg?raw";
import style from "../../styles/components/(home)/Composer.module.css";

export default function Composer() {
  const { user } = useAuth();
  const submission = useSubmission(createPost);
  const [text, setText] = createSignal<string>("");

  const avatar = (): string => user()?.avatarUrl ?? "/profile-picture.svg";
  const name = (): string =>
    user()?.displayName ?? user()?.username ?? "You";
  const pending = (): boolean => submission.pending === true;
  const canSubmit = (): boolean => text().trim().length > 0 && !pending();
  const error = (): string | undefined => {
    if (submission.error !== undefined) {
      return "Could not publish your post. Try again.";
    }
    const result: CreatePostResult | undefined = submission.result;
    if (result !== undefined && !result.ok) {
      return result.error;
    }
    return undefined;
  };

  createEffect(() => {
    const result: CreatePostResult | undefined = submission.result;
    if (result?.ok === true) {
      setText("");
    }
  });

  const handleInput = (
    event: InputEvent & { currentTarget: HTMLTextAreaElement; target: Element },
  ): void => {
    setText(event.currentTarget.value);
    if (submission.result !== undefined) {
      submission.clear();
    }
  };

  return (
    <form id={style.composer} action={createPost} method="post">
      <img
        id={style.composerAvatar}
        src={avatar()}
        alt={`${name()} avatar`}
      />
      <div id={style.composerBody}>
        <textarea
          id={style.composerText}
          name="text"
          rows="2"
          maxLength={MAX_STAT_LENGTH}
          placeholder="What's happening?"
          aria-label="Post text"
          value={text()}
          onInput={handleInput}
          disabled={pending()}
        />
        <Show when={error() !== undefined}>
          <p id={style.composerError}>{error()}</p>
        </Show>
        <footer id={style.composerFooter}>
          <button
            id={style.composerMedia}
            type="button"
            aria-label="Add image"
            title="Image attachments are coming soon"
            disabled
          >
            <span id={style.composerMediaIcon} innerHTML={imageIcon} />
          </button>
          <div id={style.composerEnd}>
            <span id={style.composerCount}>
              {text().length}/{MAX_STAT_LENGTH}
            </span>
            <button
              id={style.composerSubmit}
              type="submit"
              disabled={!canSubmit()}
            >
              {pending() ? "Posting..." : "Post"}
            </button>
          </div>
        </footer>
      </div>
    </form>
  );
}
