import { A } from "@solidjs/router";
import type { FaqItem } from "../../../components/dvibd/home/Faq.tsx";
import Faq from "../../../components/dvibd/home/Faq.tsx";
import PageHero from "../../../components/dvibd/home/PageHero.tsx";
import ProductChapter from "../../../components/dvibd/home/products/ProductChapter.tsx";
import SharedAccount from "../../../components/dvibd/home/products/SharedAccount.tsx";
import { MESSAGE_URL, SOCIAL_URL } from "../../../lib/dvibd";
import socialProfile from "../../../../assets/pages/dvibd/home/social-profile.jpg";
import messageThread from "../../../../assets/pages/dvibd/home/message-thread.jpg";
import { reveal } from "../../../directives/reveal.ts";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/pages/dvibd/home/Products.module.css";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do I need two accounts?",
    answer:
      "No. One dvibd account opens both apps, and your profile and friends are the same in each.",
  },
  {
    question: "Can I use one app without the other?",
    answer:
      "Yes. Both apps come with the account. Use Social, Message, or both, and nothing is locked behind the other.",
  },
  {
    question: "Is Message free?",
    answer: "Yes. Sending messages and starting groups cost nothing.",
  },
  {
    question: "How do I report a problem?",
    answer:
      "Use the report option inside the app for a post or a message. For anything else, email support@dvibd.com with what happened and which app you were in.",
  },
];

function Products() {
  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.products}>
        <PageHero
          lines={["What Social", "and Message do."]}
          lead="Two apps on one dvibd account, and here is what each one does."
          compact={false}
        />
        <ProductChapter
          name="Social"
          tagline="Share your world."
          paragraph="Social is a community feed. Post a photo or a thought, follow the people you want to hear from, and join communities built around what you make."
          points={[
            "A feed of posts, photos, and updates from the people you follow.",
            "Communities built around shared interests.",
            "Discover people and topics that matter to you.",
          ]}
          actionLabel="Open Social"
          actionHref={SOCIAL_URL}
          reverse={false}
        >
          <img
            src={socialProfile}
            alt="Social profile for Aria Chen with the new feed post."
            width={640}
            height={960}
            loading="lazy"
            decoding="async"
          />
        </ProductChapter>
        <ProductChapter
          name="Message"
          tagline="One to one, or a small group."
          paragraph="Message is a private chat. Write to one person or start a small group, keep the thread, and pick it up on any device."
          points={[
            "One to one chats and small group conversations.",
            "A thread that keeps the whole conversation in order.",
            "Works on any device, wherever you are.",
          ]}
          actionLabel="Open Message"
          actionHref={MESSAGE_URL}
          reverse={true}
        >
          <img
            src={messageThread}
            alt="Message thread showing the #general conversation and the new signals discussion."
            width={713}
            height={960}
            loading="lazy"
            decoding="async"
          />
        </ProductChapter>
        <SharedAccount />
        <Faq heading="Common questions" items={FAQ_ITEMS} />
        <section id={style.productsCta}>
          <h2 id={style.productsCtaTitle} ref={reveal()}>
            Start in either app.
          </h2>
          <p id={style.productsCtaLead} ref={reveal(1)}>
            Create one account, then open Social or Message.
          </p>
          <div id={style.productsCtaActions} ref={reveal(2)}>
            <A id={style.productsCtaPrimary} href="/signup">
              Create account
            </A>
            <a href={SOCIAL_URL}>Open Social</a>
            <a href={MESSAGE_URL}>Open Message</a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Products;
