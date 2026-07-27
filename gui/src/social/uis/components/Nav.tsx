import { createSignal, onCleanup, Show, type JSX } from "solid-js";

import { useAuth } from "@src/dvibd/contexts/AuthContext";
import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import homeIcon from "@src/social/assets/home.svg";
import exploreIcon from "@src/social/assets/explore.svg";
import communitiesIcon from "@src/social/assets/communities.svg";
import notificationsIcon from "@src/social/assets/notifications.svg";
import bookmarksIcon from "@src/social/assets/save.svg";
import userIcon from "@src/social/assets/user.svg";
import plusIcon from "@src/social/assets/plus.svg";
import logoutIcon from "@src/social/assets/logout.svg";
import styles from "@src/social/styles/components/Nav.module.css";

function Nav(): JSX.Element {
  const { user, clearUser } = useAuth();
  const [menuOpen, setMenuOpen] = createSignal(false);
  let menuRef!: HTMLDivElement;

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    clearUser();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef && !menuRef.contains(e.target as Node)) {
      closeMenu();
    }
  };

  document.addEventListener("click", handleClickOutside);
  onCleanup(() => document.removeEventListener("click", handleClickOutside));

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
      <div class={styles.profileWrap} ref={menuRef}>
        <button class={styles.profileBtn} onClick={toggleMenu} title="Profile menu">
          <img class={styles.profile} src={defaultPfp} alt="Profile" />
        </button>
        <Show when={menuOpen()}>
          <div class={styles.dropdown}>
            <h3 class={styles.dropdownHeading}>Accounts</h3>
            <div class={styles.dropdownHeader}>
              <img class={styles.dropdownAvatar} src={defaultPfp} alt="Avatar" />
              <div class={styles.dropdownUser}>
                <span class={styles.dropdownName}>{user()?.username ?? "User"}</span>
                <span class={styles.dropdownHandle}>@{user()?.username ?? "user"}</span>
              </div>
            </div>
            <div class={styles.dropdownDivider} />
            <a href={`/social/@${user()?.username ?? "profile"}`} class={styles.dropdownItem} onClick={closeMenu}>
              <img class={styles.dropdownItemIcon} src={userIcon} alt="" />
              Go to profile
            </a>
            <a href="/auth/login" class={styles.dropdownItem} onClick={closeMenu}>
              <img class={styles.dropdownItemIcon} src={plusIcon} alt="" />
              Add account
            </a>
            <button class={styles.dropdownItem} onClick={handleLogout}>
              <img class={styles.dropdownItemIcon} src={logoutIcon} alt="" />
              Log out
            </button>
          </div>
        </Show>
      </div>
    </nav>
  );
}

export default Nav;