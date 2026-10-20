import { lifeEvents } from "../../../data/social";
import style from "../../../styles/components/(home)/explore/WhatsHappening.module.css";

interface WhatsHappeningProps {
  event: (typeof lifeEvents)[number];
}

export default function WhatsHappening(props: WhatsHappeningProps) {
  const parts = () => props.event.meta;
  return (
    <article id={style.event}>
      <h3 id={style.eventTitle}>{props.event.title}</h3>
      <p id={style.eventMeta}>
        <span>{parts()[0] ?? ""}</span>
        <span>{parts()[1] ?? ""}</span>
      </p>
    </article>
  );
}
