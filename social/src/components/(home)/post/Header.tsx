import moreIcon from "../../../assets/components/post/header/more.svg?raw";
import style from "../../../styles/components/(home)/post/Header.module.css";

interface HeaderProps {
  avatar?: string;
  name: string;
  handle: string;
  time: string;
}

export default function Header({
  avatar = "/profile-picture.svg",
  name,
  handle,
  time,
}: HeaderProps) {
  return (
    <header id={style.postHeader}>
      <img id={style.postHeaderAvatar} src={avatar} alt={`${name} avatar`} />
      <div id={style.postHeaderMeta}>
        <p id={style.postHeaderName}>{name}</p>
        <p id={style.postHeaderTime}>
          @{handle} · {time}
        </p>
      </div>
      <button type="button" aria-label="More options" id={style.postHeaderMore}>
        <span id={style.moreIcon} innerHTML={moreIcon} />
      </button>
    </header>
  );
}