import { For } from "solid-js";
import style from "../../../../../styles/components/dvibd/home/fragments/GroupMembers.module.css";

interface MemberRow {
  name: string;
  initials: string;
}

const MEMBERS: MemberRow[] = [
  { name: "Aria Chen", initials: "AC" },
  { name: "Sofia Reyes", initials: "SR" },
  { name: "Marcus Lee", initials: "ML" },
];

function GroupMembers() {
  return (
    <div id={style.group} data-ui="true">
      <header id={style.header}>
        <span id={style.groupName}>Weekend build</span>
        <span id={style.count}>3 people</span>
      </header>
      <ul id={style.members}>
        <For each={MEMBERS}>
          {(member: MemberRow) => (
            <li>
              <span aria-hidden="true">{member.initials}</span>
              <span>{member.name}</span>
              <span>Member</span>
            </li>
          )}
        </For>
      </ul>
      <span id={style.addPeople}>Add people</span>
    </div>
  );
}

export default GroupMembers;
