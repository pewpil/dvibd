import { A } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import logo from "../../../../assets/pages/dvibd/home/logo.svg";
import { useAuth } from "../../../contexts/dvibd/AuthContext";
import style from "../../../../styles/components/dvibd/home/NavBar.module.css";

function NavBar() {
  const { session, logout } = useAuth();
  const [profileOpen, setProfileOpen] = createSignal(false);

  return (
    <nav id={style.navBar}>
      <div id={style.navInner}>
        <A id={style.brand} href="/" end>
          <img src={logo} alt="dvibd logo" />
          <span id={style.brandName}>
            dvibd<span id={style.brandDot}>.</span>
          </span>
        </A>
        <ul id={style.navLinks}>
          <li>
            <A href="/products">Products</A>
          </li>
          <li>
            <A href="/about">About</A>
          </li>
          <li>
            <A href="/contact">Contact</A>
          </li>
        </ul>
        <div id={style.navAuth}>
          <Show when={session() === null}>
            <A id={style.navLogIn} href="/login">
              Log in
            </A>
            <A id={style.navSignUp} href="/signup">
              Sign up
            </A>
          </Show>
          <Show when={session() !== null}>
            <div id={style.navProfile}>
              <button
                id={style.profileToggle}
                type="button"
                onClick={() => setProfileOpen(!profileOpen())}
                aria-expanded={profileOpen()}
                aria-label="Profile"
              >
                <img src="/profile-picture.svg" alt="profile picture" />
                <span id={style.profileUsername}>
                  @{session()?.username}
                </span>
              </button>
              <Show when={profileOpen()}>
                <div id={style.profileMenu}>
                  <button
                    id={style.profileSignOut}
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;