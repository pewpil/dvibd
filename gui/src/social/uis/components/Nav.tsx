import type { JSX } from "solid-js";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import homeIcon from "@src/social/assets/home.svg";
import exploreIcon from "@src/social/assets/explore.svg";
import communitiesIcon from "@src/social/assets/communities.svg";
import notificationsIcon from "@src/social/assets/notifications.svg";
import bookmarksIcon from "@src/social/assets/save.svg";
import styles from "@src/dvibd/styles/components/Nav.module.css";

function Nav(): JSX.Element {
  const { user } = useAuth();

  return (
    <nav class={styles.nav}>
      <a class={styles.link} href="/social" title="Home">
        <img src={homeIcon} alt="Home" />
      </a>
      <a class={styles.link} href="/social/explore" title="Explore">
        <img src={exploreIcon} alt="Explore" />
      </a>
      <a class={styles.link} href="/social/communities" title="Communities">
        <img src={communitiesIcon} alt="Communities" />
      </a>
      <a class={styles.link} href="/social/notifications" title="Notifications">
        <img src={notificationsIcon} alt="Notifications" />
      </a>
      <a class={styles.link} href="/social/bookmarks" title="Bookmarks">
        <img src={bookmarksIcon} alt="Bookmarks" />
      </a>
      <a href={`/social/@${user()?.username ?? "profile"}`} title="Profile">
        <img class={styles.profile} src={defaultPfp} alt="Profile" />
      </a>
    </nav>
  );
}

export default Nav;