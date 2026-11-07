import { createEffect, createSignal, on, Show, type JSX } from "solid-js";
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
  parentHandle?: string;
  placeholder?: string;
  ariaLabel?: string;
  submitLabel?: string;
  pendingLabel?: string;
  errorMessage?: string;
  successMessage?: string;
  onPosted?: () => void;
}

export default function Composer(props: ComposerProps): JSX.Element {
  const { user } = useAuth();
  const submitAction: typeof createPost = props.action ?? createPost;
  const parentId: string | undefined = props.parentId;
  const submissionMatchesParent = (input: unknown): boolean => {
    if (parentId === undefined) {
      return true;
    }
    const candidate: unknown = Array.isArray(input) ? input[0] : input;
    if (candidate instanceof URLSearchParams) {
      return candidate.get("parentId") === parentId;
    }
    if (candidate instanceof FormData) {
      const value: FormDataEntryValue | null = candidate.get("parentId");
      return typeof value === "string" ? value === parentId : false;
    }
    return false;
  };
  const submission = useSubmission(
    submitAction,
    parentId === undefined ? undefined : submissionMatchesParent,
  );
  const [text, setText] = createSignal<string>("");
  const [posted, setPosted] = createSignal<boolean>(false);

  const avatar = (): string => user()?.avatarUrl ?? "/profile-picture.svg";
  const name = (): string =>
    user()?.displayName ?? user()?.username ?? "You";
  const placeholder = (): string => props.placeholder ?? "What's happening?";
  const ariaLabel = (): string => {
    const base: string = props.ariaLabel ?? "Post text";
    return props.parentHandle !== undefined
      ? `${base} to @${props.parentHandle}`
      : base;
  };
  const submitLabel = (): string => props.submitLabel ?? "Post";
  const pendingLabel = (): string => props.pendingLabel ?? "Posting...";
  const errorMessage = (): string =>
    props.errorMessage ?? "Could not publish your post. Try again.";
  const successText = (): string => {
    if (props.successMessage !== undefined) {
      return props.successMessage;
    }
    return parentId !== undefined ? "Reply posted." : "Post published.";
  };
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
  const idBase = (): string => `${style.composer}-${parentId ?? "composer"}`;
  const textId = (): string => `${idBase()}-text`;
  const countId = (): string => `${idBase()}-count`;
  const errorId = (): string => `${idBase()}-error`;
  const statusId = (): string => `${idBase()}-status`;
  const describedBy = (): string => {
    const ids: string[] = [countId()];
    if (error() !== undefined) {
      ids.push(errorId());
    }
    return ids.join(" ");
  };
  const statusText = (): string => {
    if (pending()) {
      return parentId !== undefined ? "Sending reply..." : "Publishing post...";
    }
    if (posted()) {
      return successText();
    }
    return "";
  };

  createEffect(
    on(
      () => submission.result,
      (result) => {
        if (result?.ok !== true) {
          return;
        }
        setText("");
        setPosted(true);
        props.onPosted?.();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(pending, (isPending) => {
      if (isPending) {
        setPosted(false);
      }
    }),
  );

  const handleInput = (
    event: InputEvent & { currentTarget: HTMLTextAreaElement; target: Element },
  ): void => {
    setText(event.currentTarget.value);
    setPosted(false);
    if (submission.result !== undefined || submission.error !== undefined) {
      submission.clear();
    }
  };

  const handleSubmit = (
    event: SubmitEvent & { currentTarget: HTMLFormElement; target: Element },
  ): void => {
    if (!canSubmit()) {
      event.preventDefault();
    }
  };

  return (
    <form
      id={style.composer}
      action={submitAction}
      method="post"
      onSubmit={handleSubmit}
    >
      <Show when={parentId !== undefined}>
        <input type="hidden" name="parentId" value={parentId ?? ""} />
      </Show>
      <img
        id={style.composerAvatar}
        src={avatar()}
        alt={`${name()} avatar`}
      />
      <div id={style.composerBody}>
        <textarea
          id={textId()}
          name="text"
          rows="2"
          maxLength={MAX_STAT_LENGTH}
          placeholder={placeholder()}
          aria-label={ariaLabel()}
          aria-invalid={error() !== undefined ? "true" : undefined}
          aria-describedby={describedBy()}
          value={text()}
          onInput={handleInput}
          readOnly={pending() ? true : undefined}
        />
        <Show when={error() !== undefined}>
          <p id={errorId()} role="alert">
            {error()}
          </p>
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
            <span id={countId()}>
              {text().length}/{MAX_STAT_LENGTH}
            </span>
            <button
              id={style.composerSubmit}
              type="submit"
              aria-disabled={!canSubmit() ? "true" : undefined}
              aria-label={
                props.parentHandle !== undefined
                  ? `Reply to @${props.parentHandle}`
                  : undefined
              }
            >
              {pending() ? pendingLabel() : submitLabel()}
            </button>
          </div>
        </footer>
      </div>
      <p id={statusId()} role="status" aria-live="polite">
        {statusText()}
      </p>
    </form>
  );
}
