import type { ReactNode } from "react";
import style from "./page.module.css";

export default function HomePage(): ReactNode {
  return (
    <main id={style.home}>
      <h1 id={style.title}>Messages</h1>
      <p id={style.subtitle}>Your conversations will appear here.</p>
    </main>
  );
}
