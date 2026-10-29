import { A } from "@solidjs/router";
import PageHero from "../../../components/dvibd/home/PageHero.tsx";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/pages/dvibd/home/NotFound.module.css";

function NotFound() {
  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.notFound}>
        <PageHero
          lines={["This page does not exist."]}
          lead="The link may be old, or the address may have a typo."
          compact={true}
        />
        <div id={style.notFoundActions}>
          <A id={style.notFoundHome} href="/">
            Back home
          </A>
          <A id={style.notFoundLink} href="/products">
            Explore products
          </A>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
