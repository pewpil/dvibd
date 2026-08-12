import { A } from "@solidjs/router";
import bookmarks from "../assets/components/sideNav/bookmarks.svg";
import explore from "../assets/components/sideNav/explore.svg";
import home from "../assets/components/sideNav/home.svg";
import notifications from "../assets/components/sideNav/notifications.svg";
import profile from "../assets/components/sideNav/profile.svg";
import settings from "../assets/components/sideNav/settings.svg";
import style from "../styles/components/SideNav.module.css";

function SideNav() {
  return (
    <nav id={style.sideNav} aria-label="Primary">
      <ul id={style.navList}>
        <li>
          <A href="/" end aria-label="Home">
            <img src={home} />
          </A>
        </li>
        <li>
          <A href="/explore" aria-label="Explore">
            <img src={explore} />
          </A>
        </li>
        <li>
          <A href="/notifications" aria-label="Notifications">
            <img src={notifications} />
          </A>
        </li>
        <li>
          <A href="/bookmarks" aria-label="Bookmarks">
            <img src={bookmarks} />
          </A>
        </li>
        {/* <li> */}
        {/*   <A href="/profile" aria-label="Profile"> */}
        {/*     <img src={profile} /> */}
        {/*   </A> */}
        {/* </li> */}
        <li>
          <A href="/settings" aria-label="Settings">
            <img src={settings} />
          </A>
        </li>
      </ul>
      <A id={style.navProfile} href="/profile" aria-label="Profile">
        <img src="/profile-picture.svg" alt="profile picture" />
      </A>
    </nav>
  );
}

export default SideNav;
