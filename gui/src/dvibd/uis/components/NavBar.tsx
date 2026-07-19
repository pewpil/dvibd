import type { Component } from "solid-js";
import { A } from "@solidjs/router";

import Button from "@src/dvibd/uis/components/Button";
import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";
import styles from "@src/dvibd/styles/components/NavBar.module.css";

const links = [
  { label: "about", href: "/about" },
  { label: "products", href: "/products" },
  { label: "contact", href: "/contact" },
];

const NavBar: Component = () => {
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
        </div>
        <span class={styles.themeSlot}>
          <ThemeToggle />
        </span>
      </div>
    </header>
  );
};

export default NavBar;
