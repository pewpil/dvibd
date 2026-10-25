import { A } from "@solidjs/router";
import moreIcon from "../../../assets/components/post/header/more.svg?raw";
import style from "../../../styles/components/(home)/post/Header.module.css";

interface HeaderProps {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
}

export default function Header(props: HeaderProps) {
  const avatar = (): string => props.avatar ?? "/profile-picture.svg";
  const profileHref = (): string => `/@${encodeURIComponent(props.handle)}`;
  return (
    <header id={style.postHeader}>
      <img id={style.postHeaderAvatar} src={avatar()} alt={`${props.name} avatar`} />
      <div id={style.postHeaderMeta}>
        <p id={style.postHeaderName}>
          <A id={style.postHeaderNameLink} href={profileHref()}>
            {props.name}
          </A>
        </p>
        <p id={style.postHeaderTime}>
          <A id={style.postHeaderHandle} href={profileHref()}>
            @{props.handle}
          </A>
          <span>{props.time}</span>
        </p>
      </div>
      <button type="button" aria-label="More options" id={style.postHeaderMore}>
        <span id={style.moreIcon} innerHTML={moreIcon} />
      </button>
    </header>
  );
}
