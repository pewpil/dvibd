import { ParentProps } from "solid-js";
import style from "../../../styles/components/(home)/explore-division/Section.module.css";

interface SectionProps extends ParentProps {
  title: string;
}

export default function Section(props: SectionProps) {
  return (
    <section id={style.section}>
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}
