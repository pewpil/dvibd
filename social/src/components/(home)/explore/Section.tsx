import { ParentProps } from "solid-js";
import style from "../../../styles/components/(home)/explore/Section.module.css";

interface SectionProps extends ParentProps {
  title: string;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section id={style.section}>
      <h2 id={style.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}