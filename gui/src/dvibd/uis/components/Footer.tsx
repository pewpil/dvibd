import { For, type Component } from "solid-js";
import { A } from "@solidjs/router";

import brandIcon from "@src/dvibd/assets/dvibd.ico";
import styles from "@src/dvibd/styles/components/Footer.module.css";

const columns = [
  {
    heading: "Products",
    links: [
      { label: "social", href: "/products" },
      { label: "message", href: "/products" },
      { label: "suite", href: "/products" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/auth/login" },
      { label: "Sign up", href: "/auth/signup" },
    ],
  },
];

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={styles.inner}>
        <div class={styles.brandBlock}>
          <A class={styles.brand} href="/">
            <img class={styles.brandIcon} src={brandIcon} alt="dvibd logo" />
            <span class={styles.brandName}>dvibd</span>
          </A>
          <p class={styles.tagline}>
            Social, message, and suite — one platform, many ways to connect.
          </p>
        </div>

        <nav class={styles.columns}>
          <For each={columns}>
            {(column) => (
              <div class={styles.column}>
                <span class={styles.heading}>{column.heading}</span>
                <ul class={styles.links}>
                  <For each={column.links}>
                    {(link) => (
                      <li>
                        <A class={styles.link} href={link.href}>
                          {link.label}
                        </A>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </nav>
      </div>

      <div class={styles.bottom}>
        <span class={styles.copy}>
          © {new Date().getFullYear()} dvibd. All rights reserved.
        </span>
        <div class={styles.legal}>
          <A class={styles.legalLink} href="/">
            Privacy
          </A>
          <A class={styles.legalLink} href="/">
            Terms
          </A>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
