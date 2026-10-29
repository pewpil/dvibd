import ProductFigure from "./ProductFigure.tsx";
import socialProfile from "../../../../assets/pages/dvibd/home/social-profile.jpg";
import messageThread from "../../../../assets/pages/dvibd/home/message-thread.jpg";
import { reveal } from "../../../directives/reveal.ts";
import style from "../../../../styles/components/dvibd/home/ProductShowcase.module.css";

function ProductShowcase() {
  return (
    <section id={style.showcase}>
      <div id={style.showcaseFigure} ref={reveal()}>
        <ProductFigure
          src={socialProfile}
          alt="Social profile for Aria Chen with the new feed post."
          width={640}
          height={960}
          caption="Social, @ariachen's profile."
          portrait={true}
          shutterImage={true}
        />
      </div>
      <div id={style.showcasePair} ref={reveal(1)}>
        <ProductFigure
          src={messageThread}
          alt="Message thread showing the #general conversation and the new signals discussion."
          width={713}
          height={960}
          caption="Message, the #general conversation."
          portrait={true}
          shutterImage={false}
        />
      </div>
    </section>
  );
}

export default ProductShowcase;
