import { createEffect, createSignal, Show, type JSX } from "solid-js";
import { useSubmission } from "@solidjs/router";
import { createPost } from "../../server/posts";
import { useAuth } from "../../contexts/AuthContext";
import {
  MAX_STAT_LENGTH,
  type CreatePostResult,
} from "../../types/social";
import imageIcon from "../../assets/components/(home)/composer/image.svg?raw";
import style from "../../styles/components/(home)/Composer.module.css";

interface ComposerProps {
  action?: typeof createPost;
  parentId?: string;
  placeholder?: string;
  ariaLabel?: string;
  submitLabel?: string;
  pendingLabel?: string;
  errorMessage?: string;
}

export default function Composer(props: ComposerProps): JSX.Element {
  const { user } = useAuth();
  const submitAction: typeof createPost = props.action ?? createPost;
  const submission = useSubmission(submitAction);
  const [text, setText] = createSignal<string>("");

  const avatar = (): string => user()?.avatarUrl ?? "/profile-picture.svg";
  const name = (): string =>
    user()?.displayName ?? user()?.username ?? "You";
  const placeholder = (): string => props.placeholder ?? "What's happening?";
  const ariaLabel = (): string => props.ariaLabel ?? "Post text";
  const submitLabel = (): string => props.submitLabel ?? "Post";
  const pendingLabel = (): string => props.pendingLabel ?? "Posting...";
  const errorMessage = (): string =>
    props.errorMessage ?? "Could not publish your post. Try again.";
  const pending = (): boolean => submission.pending === true;
  const canSubmit = (): boolean => text().trim().length > 0 && !pending();
  const error = (): string | undefined => {
    if (submission.error !== undefined) {
      return errorMessage();
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
    <form id={style.composer} action={submitAction} method="post">
      <Show when={props.parentId !== undefined}>
        <input type="hidden" name="parentId" value={props.parentId ?? ""} />
      </Show>
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
          placeholder={placeholder()}
          aria-label={ariaLabel()}
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
              {pending() ? pendingLabel() : submitLabel()}
            </button>
          </div>
        </footer>
      </div>
    </form>
  );
}
