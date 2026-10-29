import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import logo from "../../../../assets/pages/dvibd/home/logo.svg";
import { useAuth } from "../../../contexts/dvibd/AuthContext";
import ThemeToggle from "./ThemeToggle.tsx";
import style from "../../../../styles/components/dvibd/home/NavBar.module.css";

function NavBar() {
  const auth = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = createSignal<boolean>(false);
  const [profileOpen, setProfileOpen] = createSignal<boolean>(false);
  let navBar: HTMLElement | undefined;

  const closeAll = (): void => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  createEffect((): void => {
    location.pathname;
    closeAll();
  });

  onMount((): void => {
    const handlePointer = (event: PointerEvent): void => {
      if (
        navBar !== undefined &&
        event.target instanceof Node &&
        !navBar.contains(event.target)
      ) {
        closeAll();
      }
    };
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeAll();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    onCleanup((): void => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    });
  });

  return (
    <nav
      id={style.navBar}
      aria-label="Site"
      ref={(element: HTMLElement): void => {
        navBar = element;
      }}
    >
      <div id={style.navInner}>
        <A id={style.brand} href="/" end>
          <img id={style.brandMark} src={logo} alt="" width="64" height="64" />
          <span id={style.brandName}>
            dvibd<span id={style.brandDot}>.</span>
          </span>
        </A>
        <ul id={style.navLinks}>
          <li>
            <A href="/products" activeClass={style.navLinkActive}>
              Products
            </A>
          </li>
          <li>
            <A href="/about" activeClass={style.navLinkActive}>
              About
            </A>
          </li>
          <li>
            <A href="/contact" activeClass={style.navLinkActive}>
              Contact
            </A>
          </li>
        </ul>
        <div id={style.navActions}>
          <ThemeToggle />
          <Show
            when={auth.session() === null}
            fallback={
              <div id={style.navProfile}>
                <button
                  id={style.profileToggle}
                  type="button"
                  aria-label="Account menu"
                  aria-expanded={profileOpen()}
                  aria-controls={style.profileMenu}
                  onClick={() => setProfileOpen(!profileOpen())}
                >
                  @{auth.session()?.username}
                </button>
                <div id={style.profileMenu} hidden={!profileOpen()}>
                  <button
                    id={style.profileSignOut}
                    type="button"
                    onClick={() => {
                      closeAll();
                      auth.logout();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            }
          >
            <A href="/login">
              Log in
            </A>
            <A href="/signup">
              Sign up
            </A>
          </Show>
        </div>
        <button
          id={style.menuButton}
          type="button"
          aria-expanded={menuOpen()}
          aria-controls={style.mobilePanel}
          onClick={() => setMenuOpen(!menuOpen())}
        >
          {menuOpen() ? "Close" : "Menu"}
        </button>
      </div>
      <div
        id={style.mobilePanel}
        role="region"
        aria-label="Site menu"
        hidden={!menuOpen()}
      >
        <ul id={style.mobileLinks}>
          <li>
            <A href="/products" activeClass={style.navLinkActive}>
              Products
            </A>
          </li>
          <li>
            <A href="/about" activeClass={style.navLinkActive}>
              About
            </A>
          </li>
          <li>
            <A href="/contact" activeClass={style.navLinkActive}>
              Contact
            </A>
          </li>
        </ul>
        <div id={style.mobileAuth}>
          <Show
            when={auth.session() === null}
            fallback={
              <button
                id={style.mobileSignOut}
                type="button"
                onClick={() => {
                  closeAll();
                  auth.logout();
                }}
              >
                Sign out
              </button>
            }
          >
            <A href="/login">
              Log in
            </A>
            <A href="/signup">
              Sign up
            </A>
          </Show>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
