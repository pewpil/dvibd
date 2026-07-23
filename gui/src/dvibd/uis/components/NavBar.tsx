import type { JSX } from "solid-js";
import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "@src/dvibd/contexts/AuthContext";

import Button from "@src/dvibd/uis/components/Button";
import avatar from "@src/dvibd/assets/avatar.png";
import styles from "@src/dvibd/styles/components/NavBar.module.css";

const links = [
  { label: "about", href: "/about" },
  { label: "products", href: "/products" },
  { label: "contact", href: "/contact" },
];

function NavBar(): JSX.Element {
  const { user, isAuthenticated, clearUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  let profileRef: HTMLDivElement | undefined;

  function toggleDropdown(): void {
    setDropdownOpen(!dropdownOpen());
  }

  function handleClickOutside(e: MouseEvent): void {
    if (profileRef && !profileRef.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return (
    <header class={styles.nav}>
      <div class={styles.inner}>
        <div class={styles.left}>
          <A class={styles.brand} href="/">
            dvibd
          </A>
          <nav class={styles.links}>
            {links.map((link) => (
              <A class={styles.link} href={link.href}>
                {link.label}
              </A>
            ))}
          </nav>
        </div>

        <div class={styles.right}>
          <Show
            when={isAuthenticated()}
            fallback={
              <>
                <Button variant="ghost" href="/auth/login">
                  Log in
                </Button>
                <Button variant="primary" href="/auth/signup">
                  Sign up
                </Button>
              </>
            }
          >
            <div
              class={styles.profileArea}
              ref={profileRef}
              onClick={toggleDropdown}
            >
              <img class={styles.profileImg} src={avatar} alt="Your profile" />
              <span class={styles.username}>{user()?.username}</span>
              <Show when={dropdownOpen()}>
                <div class={styles.dropdown}>
                  <button class={styles.dropdownItem} onClick={clearUser}>
                    Log out
                  </button>
                </div>
              </Show>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
