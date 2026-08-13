import { ParentProps } from "solid-js";
import style from "../../../styles/components/(home)/explore/Card.module.css";

export default function Card(props: ParentProps) {
  return <section id={style.card}>{props.children}</section>;
}