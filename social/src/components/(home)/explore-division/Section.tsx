import { ParentProps } from "solid-js";
import style from "../../../styles/components/(home)/explore-division/Section.module.css";

interface SectionProps extends ParentProps {
  title: string;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section class={style.section}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}