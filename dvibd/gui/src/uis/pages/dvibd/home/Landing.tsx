import type { FaqItem } from "../../../components/dvibd/home/Faq.tsx";
import Faq from "../../../components/dvibd/home/Faq.tsx";
import ProductFigure from "../../../components/dvibd/home/ProductFigure.tsx";
import ProductShowcase from "../../../components/dvibd/home/ProductShowcase.tsx";
import Hero from "../../../components/dvibd/home/landing/Hero.tsx";
import Features from "../../../components/dvibd/home/landing/Features.tsx";
import Handoff from "../../../components/dvibd/home/landing/Handoff.tsx";
import HowItWorks from "../../../components/dvibd/home/landing/HowItWorks.tsx";
import ClosingCta from "../../../components/dvibd/home/landing/ClosingCta.tsx";
import messageWorkspace from "../../../../assets/pages/dvibd/home/message-workspace.jpg";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/pages/dvibd/home/Landing.module.css";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do Social and Message use the same account?",
    answer:
      "Yes. One dvibd account covers both apps. Your profile, your friends, and your communities are the same in each one.",
  },
  {
    question: "Is Message free?",
    answer:
      "Yes. Message costs nothing to use, whether you are writing to one person or to a group.",
  },
  {
    question: "Can I share a post into a chat?",
    answer:
      "Yes. Share a post into a one to one chat or a group, and everyone there can read it.",
  },
  {
    question: "Who can see my messages?",
    answer:
      "Only the people in the conversation. Messages are not end to end encrypted, so treat a message the way you would treat an email.",
  },
];

function Landing() {
  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.landing}>
        <Hero />
        <ProductShowcase />
        <Features />
        <Handoff />
        <HowItWorks />
        <Faq heading="Common questions" items={FAQ_ITEMS} />
        <div id={style.landingBand}>
          <ProductFigure
            src={messageWorkspace}
            alt="Message workspace with the channel list on the left and the #general conversation open."
            width={1440}
            height={960}
            caption="Message workspace, with the channel list and #general."
            portrait={false}
            shutterImage={false}
          />
        </div>
        <ClosingCta />
      </div>
    </main>
  );
}

export default Landing;
