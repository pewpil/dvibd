import type { JSX } from "solid-js";

import defaultPfp from "@src/social/assets/user-default-pfp.ico";
import Information from "@src/social/uis/components/profile/Information";
import Bio from "@src/social/uis/components/profile/card/Bio";
import Tabs from "@src/social/uis/components/profile/card/tabs/Tabs";
import styles from "@src/social/styles/components/profile/card/Card.module.css";

type CardProps = {
  name: string;
  handle: string;
  active: string;
  bio: string;
  website?: string;
  activeTab: "posts" | "replies" | "media" | "likes";
  onTabChange: (tab: "posts" | "replies" | "media" | "likes") => void;
};

function Card(props: CardProps): JSX.Element {
  return (
    <div class={styles.card}>
      <img class={styles.pfp} src={defaultPfp} alt={`${props.name}'s profile`} />
      <Information name={props.name} handle={props.handle} active={props.active} />
      <div class={styles.separator}>
        <Bio text={props.bio} website={props.website} />
      </div>
      <Tabs active={props.activeTab} onChange={props.onTabChange} />
    </div>
  );
}

export default Card;
