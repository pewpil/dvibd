import { For, type JSX } from "solid-js";

import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import styles from "@src/dvibd/styles/components/People.module.css";

type SuggestedPerson = {
  name: string;
  handle: string;
};

const fallbackPeople: SuggestedPerson[] = [
  { name: "Elena Vargas", handle: "elenacodes" },
  { name: "Marcus Lee", handle: "marcusl" },
  { name: "Priya Kapoor", handle: "priyadesigns" },
];

function People(): JSX.Element {
  return (
    <div class={styles.people}>
      <h3 class={styles.heading}>People</h3>
      <div class={styles.list}>
        <For each={fallbackPeople}>
          {(person) => (
            <div class={styles.person}>
              <img class={styles.avatar} src={defaultPfp} alt={`${person.name}'s avatar`} />
              <div class={styles.info}>
                <span class={styles.name}>{person.name}</span>
                <span class={styles.handle}>@{person.handle}</span>
              </div>
              <button class={styles.follow}>Follow</button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default People;