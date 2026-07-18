import { Suspense, type JSX } from 'solid-js';
import { NavBar } from '~/social/uis/components/NavBar';
import { RightPanel } from '~/social/uis/components/RightPanel';
import { Footer } from '~/social/uis/components/Footer';
import styles from '~/social/styles/pages/app/App.module.css';

export default function App(props: { children?: JSX.Element }): JSX.Element {
  return (
    <div class={styles.app}>
      <NavBar />
      <div class={styles.shell}>
        <main class={styles.main}>
          <Suspense>{props.children}</Suspense>
          <Footer />
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
