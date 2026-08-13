import { lifeEvents } from "../../../data/social";
import style from "../../../styles/components/(home)/explore/WhatsHappening.module.css";

interface WhatsHappeningProps {
  event: (typeof lifeEvents)[number];
}

export default function WhatsHappening({ event }: WhatsHappeningProps) {
  return (
    <article id={style.event}>
      <h3 id={style.eventTitle}>{event.title}</h3>
      <p id={style.eventMeta}>{event.meta.join(" · ")}</p>
    </article>
  );
}