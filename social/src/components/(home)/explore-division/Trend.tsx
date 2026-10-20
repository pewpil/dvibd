import { trendingTopics } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/Trend.module.css";

interface TrendProps {
  topic: (typeof trendingTopics)[number];
}

export default function Trend(props: TrendProps) {
  return (
    <li id={style.trendItem}>
      <span>{props.topic.rank}</span>
      <p>{`#${props.topic.tag}`}</p>
      <span>{props.topic.posts}</span>
    </li>
  );
}
