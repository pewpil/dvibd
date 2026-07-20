import type { JSX } from "solid-js";
import { A } from "@solidjs/router";

import Button from "@src/dvibd/uis/components/Button";
import avatar from "@src/dvibd/assets/avatar.png";
import styles from "@src/dvibd/styles/components/NavBar.module.css";

const links = [
  { label: "about", href: "/about" },
  { label: "products", href: "/products" },
  { label: "contact", href: "/contact" },
];

function NavBar(): JSX.Element {
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
          <Button variant="ghost" href="/auth/login">
            Log in
          </Button>
          <Button variant="primary" href="/auth/signup">
            Sign up
          </Button>
          {/* Profile picture — shown when the user is logged in. Hidden for now
              until auth wiring is ready.
          <A class={styles.profile} href="/">
            <img class={styles.profileImg} src={avatar} alt="Your profile" />
          </A>
          */}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
