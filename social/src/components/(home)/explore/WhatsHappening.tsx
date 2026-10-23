import type { HappeningSummary } from "../../../types/social";
import style from "../../../styles/components/(home)/explore/WhatsHappening.module.css";

interface WhatsHappeningProps {
  event: HappeningSummary;
}

export default function WhatsHappening(props: WhatsHappeningProps) {
  return (
    <article id={style.event}>
      <h3 id={style.eventTitle}>{props.event.title}</h3>
      <p id={style.eventMeta}>
        <span>{props.event.meta[0] ?? ""}</span>
        <span>{props.event.meta[1] ?? ""}</span>
      </p>
    </article>
  );
}
