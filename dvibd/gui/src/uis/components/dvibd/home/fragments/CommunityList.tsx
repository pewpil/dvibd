import { For } from "solid-js";
import style from "../../../../../styles/components/dvibd/home/fragments/CommunityList.module.css";

interface CommunityRow {
  name: string;
  joined: boolean;
}

const ROWS: CommunityRow[] = [
  { name: "Design Tokens", joined: true },
  { name: "Indie Hacking", joined: true },
  { name: "SolidJS", joined: false },
];

function CommunityList() {
  return (
    <ul id={style.communityList} data-ui="true">
      <For each={ROWS}>
        {(row: CommunityRow) => (
          <li>
            <span aria-hidden="true">{row.name.charAt(0)}</span>
            <span>{row.name}</span>
            <span classList={{ [style.stateJoined]: row.joined }}>
              {row.joined ? "Joined" : "Join"}
            </span>
          </li>
        )}
      </For>
    </ul>
  );
}

export default CommunityList;
