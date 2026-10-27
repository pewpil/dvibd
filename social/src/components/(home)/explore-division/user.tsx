import { Show, type JSX } from "solid-js";
import { useSubmission } from "@solidjs/router";
import { setFollow } from "../../../server/follows";
import type { FollowResult, SuggestedProfile } from "../../../types/social";
import style from "../../../styles/components/(home)/explore-division/user.module.css";

interface UserProps {
  user: SuggestedProfile;
}

export default function User(props: UserProps): JSX.Element {
  const submission = useSubmission(setFollow);

  const pending = (): boolean => submission.pending === true;

  const followError = (): string | undefined => {
    if (submission.error !== undefined) {
      return "Could not follow this account. Try again.";
    }
    const result: FollowResult | undefined = submission.result;
    if (result !== undefined && !result.ok) {
      return result.error;
    }
    return undefined;
  };

  return (
    <li id={style.userItem}>
      <img src="/profile-picture.svg" alt={`${props.user.name} avatar`} />
      <div>
        <p>{props.user.name}</p>
        <p>@{props.user.handle}</p>
      </div>
      <form id={style.userFollowForm} action={setFollow} method="post">
        <input type="hidden" name="handle" value={props.user.handle} />
        <input type="hidden" name="intent" value="follow" />
        <button
          type="submit"
          disabled={pending()}
          aria-busy={pending()}
          aria-label={`Follow @${props.user.handle}`}
        >
          {pending() ? "Following..." : "Follow"}
        </button>
        <Show when={followError() !== undefined}>
          <p id={style.userFollowError} role="alert">
            {followError()}
          </p>
        </Show>
      </form>
    </li>
  );
}
