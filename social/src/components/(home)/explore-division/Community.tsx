import { communities } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/Community.module.css";

interface CommunityProps {
  community: (typeof communities)[number];
}

export default function Community(props: CommunityProps) {
  return (
    <li id={style.communityItem}>
      <img src="/community-profile.svg" alt={`${props.community.name} avatar`} />
      <div>
        <p>{props.community.name}</p>
        <p>{props.community.members}</p>
      </div>
      <button type="button">Join</button>
    </li>
  );
}
