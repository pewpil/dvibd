import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { currentUser } from "../data/social";
import AccountMenu from "./AccountMenu";
import { useAuth } from "../contexts/AuthContext";
import style from "../styles/components/SideNav.module.css";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 11.5 12 4.5l8 7" />
      <path d="M6.5 9.5V21h11V9.5" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-1.5 4.5-3.5 1.5 1.5-4.5z" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 4a6 6 0 0 1 6 6v4l1.5 2.5h-15L6 14v-4a6 6 0 0 1 6-6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function BookmarksIcon() {
  return (
    <svg {...iconProps}>
      <path d="M7 4h10v17l-5-3.5L7 21z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

function SideNav() {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const { loggedIn } = useAuth();

  return (
    <nav id={style.sideNav} aria-label="Primary">
      <Show
        when={loggedIn()}
        fallback={
          <A href="/login" id={style.navLogin} aria-label="Log in" data-tooltip="Log in">
            <LoginIcon />
          </A>
        }
      >
        <ul id={style.navList}>
        <li>
          <A href="/" end aria-label="Home" data-tooltip="Home">
            <HomeIcon />
          </A>
        </li>
        <li>
          <A href="/explore" aria-label="Explore" data-tooltip="Explore">
            <ExploreIcon />
          </A>
        </li>
        <li>
          <A href="/notifications" aria-label="Notifications" data-tooltip="Notifications">
            <NotificationsIcon />
          </A>
        </li>
        <li>
          <A href="/bookmarks" aria-label="Bookmarks" data-tooltip="Bookmarks">
            <BookmarksIcon />
          </A>
        </li>
        {/* <li> */}
        {/*   <A href="/profile" aria-label="Profile"> */}
        {/*     <ProfileIcon /> */}
        {/*   </A> */}
        {/* </li> */}
        <li>
          <A href="/settings" aria-label="Settings" data-tooltip="Settings">
            <SettingsIcon />
          </A>
        </li>
      </ul>
      <button
        type="button"
        id={style.navProfile}
        aria-haspopup="menu"
        aria-expanded={menuOpen()}
        aria-label="Account menu"
        data-tooltip={`@${currentUser.handle}`}
        onClick={() => setMenuOpen(!menuOpen())}
      >
        <img src={currentUser.avatar} alt="profile picture" />
      </button>
      <Show when={menuOpen()}>
        <AccountMenu onClose={() => setMenuOpen(false)} />
      </Show>
      </Show>
    </nav>
  );
}

export default SideNav;