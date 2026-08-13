import { trendingTopics } from "../../../data/social";
import style from "../../../styles/components/(home)/explore-division/Trend.module.css";

interface TrendProps {
  topic: (typeof trendingTopics)[number];
}

export default function Trend({ topic }: TrendProps) {
  return (
    <li class={style.trendItem}>
      <span>{topic.rank}</span>
      <p>{`#${topic.tag}`}</p>
      <span>{topic.posts}</span>
    </li>
  );
}