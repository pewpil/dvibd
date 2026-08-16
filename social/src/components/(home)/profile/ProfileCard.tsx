import type { CurrentUser } from "../../../data/social";
import moreIcon from "../../../assets/components/post/header/more.svg?raw";
import linkIcon from "../../../assets/components/(home)/profile/link.svg?raw";
import style from "../../../styles/components/(home)/profile/ProfileCard.module.css";

interface ProfileCardProps {
  user: CurrentUser;
  complete?: boolean;
}

const formatCount = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(".0", "")}k`
    : String(count);

export default function ProfileCard(props: ProfileCardProps) {
  return (
    <div
      id={style.profileCard}
      class={props.complete ? style.completeCard : undefined}
    >
      <img id={style.avatar} src={props.user.avatar} alt={props.user.name} />
      <div id={style.actions}>
        <button type="button" id={style.followButton}>
          Follow
        </button>
        <button type="button" id={style.moreButton} aria-label="More options">
          <span id={style.moreIcon} innerHTML={moreIcon} />
        </button>
      </div>
      <div id={style.identity}>
        <h2>{props.user.name}</h2>
        <span>@{props.user.handle}</span>
      </div>
      <p id={style.bio}>{props.user.bio}</p>
      <a
        id={style.website}
        href={`https://${props.user.website}`}
        target="_blank"
        rel="noreferrer"
      >
        <span id={style.websiteIcon} innerHTML={linkIcon} />
        {props.user.website}
      </a>
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