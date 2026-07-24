import { onMount, onCleanup } from "solid-js";
import type { JSX } from "solid-js";

function App(props: { children?: JSX.Element }): JSX.Element {
  let restored = false;

  onMount(() => {
    const setFavicon = (href: string): void => {
      const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (existing) existing.remove();
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = href;
      document.head.appendChild(link);
    };

    const dvibd =
      document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.href ??
      "/dvibd.ico";

    setFavicon("/social.ico?" + Date.now());

    onCleanup(() => {
      if (!restored) {
        restored = true;
        setFavicon(dvibd);
      }
    });
  });

  return <div>{props.children}</div>;
}

export default App;