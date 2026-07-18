import type { Component } from "solid-js";

import Button from "@src/dvibd/uis/components/Button";
import ThemeToggle from "@src/dvibd/uis/components/ThemeToggle";
import styles from "@src/dvibd/styles/components/NavBar.module.css";

const links = [
  { label: "about", href: "#about" },
  { label: "products", href: "#products" },
  { label: "contact", href: "#contact" },
];

const NavBar: Component = () => {
  return (
    <header class={styles.nav}>
      <div class={styles.inner}>
        <div class={styles.left}>
          <a class={styles.brand} href="/">
            dvibd
          </a>
          <nav class={styles.links}>
            {links.map((link) => (
              <a class={styles.link} href={link.href}>
                {link.label}
              </a>
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
          <span class={styles.themeSlot}>
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
