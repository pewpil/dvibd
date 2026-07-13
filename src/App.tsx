import { Suspense, type JSX } from 'solid-js';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import styles from './App.module.css';

export default function App(props: { children?: JSX.Element }) {
  return (
    <div class={styles.app}>
      <NavBar />
      <main class={styles.main}>
        <Suspense>{props.children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}
