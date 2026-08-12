import { communities } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/Community.module.css";

interface CommunityProps {
  community: (typeof communities)[number];
}

export default function Community({ community }: CommunityProps) {
  return (
    <li class={style.communityItem}>
      <img src="/community-profile.svg" alt={`${community.name} avatar`} />
      <div>
        <p>{community.name}</p>
        <p>{community.members}</p>
      </div>
      <button type="button">Join</button>
    </li>
  );
}