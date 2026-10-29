import { For } from "solid-js";
import PageHero from "../../../components/dvibd/home/PageHero.tsx";
import ProductFigure from "../../../components/dvibd/home/ProductFigure.tsx";
import { MESSAGE_URL, SOCIAL_URL } from "../../../lib/dvibd";
import { reveal, staggerOrder } from "../../../directives/reveal.ts";
import messageWorkspace from "../../../../assets/pages/dvibd/home/message-workspace.jpg";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/pages/dvibd/home/About.module.css";

interface Principle {
  name: string;
  paragraph: string;
}

const PRINCIPLES: Principle[] = [
  {
    name: "Connection first",
    paragraph:
      "We measure the apps by how well they bring people closer, not by screen time. A feed that keeps you scrolling is not the goal.",
  },
  {
    name: "Borderless",
    paragraph:
      "Distance, devices, and time zones should never be the reason a conversation stops.",
  },
  {
    name: "Privacy by default",
    paragraph:
      "What you share, and who you share it with, is your choice. Messages stay with the people in the conversation.",
  },
  {
    name: "Simplicity",
    paragraph:
      "Software should get out of the way. If a screen needs explaining, we have not finished it.",
  },
];

function About() {
  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.about}>
        <PageHero
          lines={["A small team,", "two apps."]}
          lead="dvibd is an independent team of a few people making two apps, Social and Message, on one shared account."
          compact={false}
        />
        <section id={style.why}>
          <h2 id={style.whyTitle} ref={reveal()}>
            Why we are here
          </h2>
          <div id={style.whyColumns}>
            <p id={style.whyStatement} ref={reveal(1)}>
              We wanted a place to talk that did not feel like a performance.
            </p>
            <p id={style.whySupport} ref={reveal(2)}>
              Social keeps the feed calm and the communities specific. Message
              keeps a conversation between the people in it. Both are small on
              purpose, and the same few people build both, so a decision in one
              app can be answered in the other.
            </p>
          </div>
        </section>
        <section id={style.principles}>
          <h2 id={style.principlesTitle} ref={reveal()}>
            What we believe
          </h2>
          <ul id={style.principleList}>
            <For each={PRINCIPLES}>
              {(principle: Principle, index) => (
                <li ref={reveal(staggerOrder(index(), 2))}>
                  <h3>{principle.name}</h3>
                  <p>{principle.paragraph}</p>
                </li>
              )}
            </For>
          </ul>
        </section>
        <section id={style.band}>
          <ProductFigure
            src={messageWorkspace}
            alt="Message workspace with the channel list on the left and the #general conversation open."
            width={1440}
            height={960}
            caption="Message workspace, with the channel list and #general."
            portrait={false}
            shutterImage={false}
          />
        </section>
        <section id={style.apps}>
          <div id={style.appsText}>
            <h2 id={style.appsTitle} ref={reveal()}>
              The apps
            </h2>
            <p id={style.appsLead} ref={reveal(1)}>
              Everything above goes into two products. Social is the feed and
              the communities. Message is the conversations. Both open with the
              same account.
            </p>
          </div>
          <div id={style.appsLinks} ref={reveal(2)}>
            <a href={SOCIAL_URL}>
              Open Social
            </a>
            <a href={MESSAGE_URL}>
              Open Message
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default About;
