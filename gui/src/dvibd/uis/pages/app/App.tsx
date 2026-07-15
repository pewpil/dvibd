import { Suspense, type JSX } from 'solid-js';
import { NavBar } from '~/dvibd/uis/components/NavBar';
import { Footer } from '~/dvibd/uis/components/Footer';
import styles from '~/dvibd/styles/pages/app/App.module.css';

export default function App(props: { children?: JSX.Element }): JSX.Element {
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
