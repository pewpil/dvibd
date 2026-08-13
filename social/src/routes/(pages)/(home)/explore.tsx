import { For } from "solid-js";
import {
  communities,
  lifeEvents,
  posts,
  suggestedUsers,
  trendingTopics,
} from "../../../data/social";
import FeedHeader from "../../../components/(home)/FeedHeader";
import Card from "../../../components/(home)/explore/Card";
import Community from "../../../components/(home)/explore-division/Community";
import ExploreHeader from "../../../components/(home)/explore/ExploreHeader";
import Section from "../../../components/(home)/explore/Section";
import Post from "../../../components/(home)/post/Post";
import Trend from "../../../components/(home)/explore-division/Trend";
import User from "../../../components/(home)/explore-division/user";
import WhatsHappening from "../../../components/(home)/explore/WhatsHappening";
import style from "../../../styles/pages/(home)/explore.module.css";

export default function Explore() {
  return [
    <FeedHeader>
      <ExploreHeader />
    </FeedHeader>,
    <div id={style.exploreBody}>
      <Section title="Trending">
        <Card>
          <ol>
            <For each={trendingTopics}>{(topic) => <Trend topic={topic} />}</For>
          </ol>
        </Card>
      </Section>
      <Section title="What's happening">
        <Card>
          <For each={lifeEvents}>{(event) => <WhatsHappening event={event} />}</For>
        </Card>
      </Section>
      <Section title="Who to follow">
        <Card>
          <ul>
            <For each={suggestedUsers}>{(user) => <User user={user} />}</For>
          </ul>
        </Card>
      </Section>
      <Section title="Where to belong">
        <Card>
          <ul>
            <For each={communities}>
              {(community) => <Community community={community} />}
            </For>
          </ul>
        </Card>
      </Section>
      <Section title="Discover">
        <For each={posts}>
          {(post) => (
            <Post
              name={post.author}
              handle={post.handle}
              time={post.time}
              avatar={post.avatar}
              text={post.text}
              media={post.media}
              reply={post.reply}
              repost={post.repost}
              like={post.like}
              save={post.save}
            />
          )}
        </For>
      </Section>
    </div>,
  ];
}