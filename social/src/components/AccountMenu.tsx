import { A } from "@solidjs/router";
import { currentUser } from "../data/social";
import profileIcon from "../assets/components/(home)/sidenav/profile.svg?raw";
import addAccountIcon from "../assets/components/(home)/sidenav/add-account.svg?raw";
import signoutIcon from "../assets/components/(home)/sidenav/signout.svg?raw";
import style from "../styles/components/AccountMenu.module.css";

interface AccountMenuProps {
  onClose: () => void;
}

export default function AccountMenu(props: AccountMenuProps) {
  return [
    <div id={style.menuBackdrop} role="presentation" onClick={props.onClose} />,
    <div id={style.accountMenu} role="menu">
      <A
        href="/profile"
        id={style.menuAccount}
        role="menuitem"
        onClick={props.onClose}
      >
        <img src={currentUser.avatar} alt="" />
        <span id={style.menuAccountText}>
          <span id={style.menuName}>{currentUser.name}</span>
          <span id={style.menuHandle}>@{currentUser.handle}</span>
        </span>
      </A>
      <hr id={style.menuDivider} />
      <A
        href="/profile"
        id={style.menuItem}
        role="menuitem"
        onClick={props.onClose}
      >
        <span id={style.menuIcon} innerHTML={profileIcon} />
        Go to profile
      </A>
      <button type="button" id={style.menuItem} role="menuitem">
        <span id={style.menuIcon} innerHTML={addAccountIcon} />
        Add another account
      </button>
      <button type="button" id={style.menuItem} role="menuitem">
        <span id={style.menuIcon} innerHTML={signoutIcon} />
        Sign out
      </button>
    </div>,
  ];
}
