import { suggestedUsers } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/user.module.css";

interface UserProps {
  user: (typeof suggestedUsers)[number];
}

export default function User({ user }: UserProps) {
  return (
    <li class={style.userItem}>
      <img src="/profile-picture.svg" alt={`${user.name} avatar`} />
      <div>
        <p>{user.name}</p>
        <p>@{user.handle}</p>
      </div>
      <button type="button">Follow</button>
    </li>
  );
}