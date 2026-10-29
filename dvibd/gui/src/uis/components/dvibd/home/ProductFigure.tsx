import { shutter } from "../../../directives/reveal.ts";
import style from "../../../../styles/components/dvibd/home/ProductFigure.module.css";

interface ProductFigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  portrait: boolean;
  shutterImage: boolean;
}

function ProductFigure(props: ProductFigureProps) {
  return (
    <figure
      id={style.productFigure}
      classList={{ [style.portrait]: props.portrait }}
    >
      <div
        id={style.productFrame}
        ref={props.shutterImage ? shutter() : undefined}
      >
        <img
          id={style.productImage}
          src={props.src}
          alt={props.alt}
          width={props.width}
          height={props.height}
          loading={props.shutterImage ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      <figcaption id={style.productCaption}>{props.caption}</figcaption>
    </figure>
  );
}

export default ProductFigure;
