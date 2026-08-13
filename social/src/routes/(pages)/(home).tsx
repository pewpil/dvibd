import { For, ParentProps } from "solid-js";
import { communities, suggestedUsers, trendingTopics } from "../../data/social";
import SideNav from "../../components/SideNav";
import ThemeToggle from "../../components/ThemeToggle";
import Section from "../../components/(home)/explore-division/Section";
import Trend from "../../components/(home)/explore-division/Trend";
import User from "../../components/(home)/explore-division/user";
import Community from "../../components/(home)/explore-division/Community";
import style from "../../styles/pages/(home).module.css";

export default function HomeLayout({ children }: ParentProps) {
  return (
    <div id={style.homeLayout}>
      <ThemeToggle />
      <SideNav />
      <main id={style.feed}>{children}</main>
      <aside id={style.explore}>
        <form id={style.exploreSearch} role="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input type="search" placeholder="Search" aria-label="Search" />
        </form>
        <Section title="Trending">
          <ol>
            <For each={trendingTopics}>
              {(topic) => <Trend topic={topic} />}
            </For>
          </ol>
        </Section>
        <Section title="Users">
          <ul>
            <For each={suggestedUsers}>{(user) => <User user={user} />}</For>
          </ul>
        </Section>
        <Section title="Community">
          <ul>
            <For each={communities}>
              {(community) => <Community community={community} />}
            </For>
          </ul>
        </Section>
        <ul id={style.legalList}>
          <li>
            <a href="/terms">Terms</a>
          </li>
          <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>
            <a href="/cookies">Cookies</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </aside>
    </div>
  );
}
