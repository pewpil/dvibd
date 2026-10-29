import { For, Match, Switch } from "solid-js";
import { reveal, staggerOrder } from "../../../../directives/reveal.ts";
import SocialPost from "../fragments/SocialPost.tsx";
import CommunityList from "../fragments/CommunityList.tsx";
import Composer from "../fragments/Composer.tsx";
import MessageThread from "../fragments/MessageThread.tsx";
import GroupMembers from "../fragments/GroupMembers.tsx";
import ProfileChip from "../fragments/ProfileChip.tsx";
import style from "../../../../../styles/components/dvibd/home/landing/Features.module.css";

type FragmentKind =
  | "socialPost"
  | "communityList"
  | "composer"
  | "messageThread"
  | "groupMembers"
  | "profileChip";

interface FeatureCell {
  title: string;
  text: string;
  fragment: FragmentKind;
}

const CELLS: FeatureCell[] = [
  {
    title: "A feed you follow",
    text: "Posts and photos from the people you chose. Nothing is ranked by a number you cannot see. Communities sit next to your feed.",
    fragment: "socialPost",
  },
  {
    title: "Communities by subject",
    text: "Join the ones that match what you make. Each community keeps its own feed. Leave whenever you like.",
    fragment: "communityList",
  },
  {
    title: "Compose in a moment",
    text: "Write a post, add photos, pick a community. A draft waits until you post it. Nothing is published twice.",
    fragment: "composer",
  },
  {
    title: "Direct messages",
    text: "One person, or a small group. Messages arrive in the order they were sent. The thread keeps the whole conversation.",
    fragment: "messageThread",
  },
  {
    title: "Groups stay small",
    text: "Add only the people who need to be there. Everyone in the group sees the same thread. Your other chats stay separate.",
    fragment: "groupMembers",
  },
  {
    title: "One profile everywhere",
    text: "Your name and handle follow you into both apps. Your communities carry over. Your friends are the same list.",
    fragment: "profileChip",
  },
];

function FeatureFragment(props: { fragment: FragmentKind }) {
  return (
    <Switch>
      <Match when={props.fragment === "socialPost"}>
        <SocialPost
          author="Aria Chen"
          handle="@ariachen"
          role="Product Designer"
          community="Design Tokens"
          time="2h"
          body="Just shipped the new feed layout and it feels so much calmer. Slow social done right."
        />
      </Match>
      <Match when={props.fragment === "communityList"}>
        <CommunityList />
      </Match>
      <Match when={props.fragment === "composer"}>
        <Composer />
      </Match>
      <Match when={props.fragment === "messageThread"}>
        <MessageThread
          title="Sofia Reyes"
          handle="@sofia.reyes"
          subtitle="Direct message"
          messages={[
            {
              from: "Aria Chen",
              body: "Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd",
              direction: "out",
            },
            {
              from: "Sofia Reyes",
              body: "Sending this to the team.",
              direction: "in",
            },
          ]}
          composerPlaceholder="Message Sofia Reyes"
          showSender={false}
        />
      </Match>
      <Match when={props.fragment === "groupMembers"}>
        <GroupMembers />
      </Match>
      <Match when={props.fragment === "profileChip"}>
        <ProfileChip />
      </Match>
    </Switch>
  );
}

function Features() {
  return (
    <section id={style.features}>
      <h2 id={style.featuresTitle} ref={reveal()}>
        Inside both apps
      </h2>
      <div id={style.featureGrid}>
        <For each={CELLS}>
          {(cell: FeatureCell, index) => (
            <article
              classList={{
                [style.cellFragmentFirst]: index() % 2 === 1,
                [style.cellOffLeft]: index() % 2 === 1,
              }}
            >
              <div ref={reveal(staggerOrder(index(), 3))}>
                <h3>{cell.title}</h3>
                <p>{cell.text}</p>
              </div>
              <div ref={reveal(staggerOrder(index(), 3))}>
                <FeatureFragment fragment={cell.fragment} />
              </div>
            </article>
          )}
        </For>
      </div>
    </section>
  );
}

export default Features;
