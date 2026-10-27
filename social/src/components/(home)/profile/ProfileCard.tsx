import { Show } from "solid-js";
import { A, useSubmission } from "@solidjs/router";
import { setFollow } from "../../../server/follows";
import type { FollowResult, ProfileView } from "../../../types/social";
import moreIcon from "../../../assets/components/post/header/more.svg?raw";
import linkIcon from "../../../assets/components/(home)/profile/link.svg?raw";
import style from "../../../styles/components/(home)/profile/ProfileCard.module.css";

interface ProfileCardProps {
  user: ProfileView;
  complete?: boolean;
  own?: boolean;
}

const formatCount = (count: number): string =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(".0", "")}k`
    : String(count);

const websiteHref = (value: string): string =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const websiteLabel = (value: string): string =>
  value.replace(/^https?:\/\//i, "");

export default function ProfileCard(props: ProfileCardProps) {
  const submission = useSubmission(setFollow);

  const pending = (): boolean => submission.pending === true;

  const followError = (): string | undefined => {
    if (props.own === true) {
      return undefined;
    }
    if (submission.error !== undefined) {
      return "Could not update follow state. Try again.";
    }
    const result: FollowResult | undefined = submission.result;
    if (result !== undefined && !result.ok) {
      return result.error;
    }
    return undefined;
  };

  const followLabel = (): string => {
    const action: string = props.user.isFollowing ? "Unfollow" : "Follow";
    return `${action} @${props.user.handle}`;
  };

  return (
    <div
      id={style.profileCard}
      class={props.complete ? style.completeCard : undefined}
    >
      <img id={style.avatar} src={props.user.avatar} alt={props.user.name} />
      <div id={style.actions}>
        <Show
          when={props.own}
          fallback={
            <form id={style.followForm} action={setFollow} method="post">
              <input type="hidden" name="handle" value={props.user.handle} />
              <input
                type="hidden"
                name="intent"
                value={props.user.isFollowing ? "unfollow" : "follow"}
              />
              <button
                type="submit"
                id={style.followButton}
                disabled={pending()}
                aria-busy={pending()}
                aria-label={followLabel()}
              >
                {pending()
                  ? "Saving..."
                  : props.user.isFollowing
                    ? "Unfollow"
                    : "Follow"}
              </button>
            </form>
          }
        >
          <A href="/settings" id={style.followButton}>
            Edit profile
          </A>
        </Show>
        <button type="button" id={style.moreButton} aria-label="More options">
          <span id={style.moreIcon} innerHTML={moreIcon} />
        </button>
      </div>
      <Show when={followError() !== undefined}>
        <p id={style.followError} role="alert">
          {followError()}
        </p>
      </Show>
      <div id={style.identity}>
        <h2>{props.user.name}</h2>
        <span>@{props.user.handle}</span>
      </div>
      <Show when={props.user.bio !== ""}>
        <p id={style.bio}>{props.user.bio}</p>
      </Show>
      <Show when={props.user.website !== ""}>
        <a
          id={style.website}
          href={websiteHref(props.user.website)}
          target="_blank"
          rel="noreferrer"
        >
          <span id={style.websiteIcon} innerHTML={linkIcon} />
          {websiteLabel(props.user.website)}
        </a>
      </Show>
      <div id={style.counts}>
        <span>
          <strong>{formatCount(props.user.following)}</strong> Following
        </span>
        <span>
          <strong>{formatCount(props.user.followers)}</strong> Followers
        </span>
      </div>
    </div>
  );
}
