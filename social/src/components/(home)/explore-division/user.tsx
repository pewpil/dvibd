import { suggestedUsers } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/user.module.css";

interface UserProps {
  user: (typeof suggestedUsers)[number];
}

export default function User(props: UserProps) {
  return (
    <li id={style.userItem}>
      <img src="/profile-picture.svg" alt={`${props.user.name} avatar`} />
      <div>
        <p>{props.user.name}</p>
        <p>@{props.user.handle}</p>
      </div>
      <button type="button">Follow</button>
    </li>
  );
}
