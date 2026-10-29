import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import type { FaqItem } from "../../../components/dvibd/home/Faq.tsx";
import Faq from "../../../components/dvibd/home/Faq.tsx";
import PageHero from "../../../components/dvibd/home/PageHero.tsx";
import {
  MESSAGE_URL,
  PRESS_EMAIL,
  SOCIAL_URL,
  SUPPORT_EMAIL,
} from "../../../lib/dvibd";
import { reveal, staggerOrder } from "../../../directives/reveal.ts";
import layoutStyle from "../../../../styles/pages/dvibd/layout.module.css";
import style from "../../../../styles/pages/dvibd/home/Contact.module.css";

interface ReachRow {
  name: string;
  description: string;
  label: string;
  href: string;
}

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

const REACH_ROWS: ReachRow[] = [
  {
    name: "Support",
    description: "Account help, reports, and questions about either app.",
    label: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    name: "Press and business",
    description: "Partnerships, media questions, and business inquiries.",
    label: PRESS_EMAIL,
    href: `mailto:${PRESS_EMAIL}`,
  },
  {
    name: "Social",
    description: "Find us in the Social app.",
    label: "Open Social",
    href: SOCIAL_URL,
  },
  {
    name: "Message",
    description: "Prefer chat? Write to us in Message.",
    label: "Open Message",
    href: MESSAGE_URL,
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "I cannot log in. What should I do?",
    answer:
      "Check that you are using the same username or email you signed up with. If it still fails, write to support@dvibd.com from the email on the account and we will look.",
  },
  {
    question: "Where do I send feedback?",
    answer:
      "Use this page, or email support@dvibd.com. Say which app you were in and what you expected to happen.",
  },
  {
    question: "How do I report a post or a message?",
    answer:
      "Use the report option inside the app. If you cannot find it, email support@dvibd.com with a link or a screenshot and we will take a look.",
  },
];

const EMPTY_ERRORS: FormErrors = { name: "", email: "", message: "" };

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Contact() {
  const [name, setName] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [subject, setSubject] = createSignal<string>("");
  const [message, setMessage] = createSignal<string>("");
  const [errors, setErrors] = createSignal<FormErrors>(EMPTY_ERRORS);
  const [status, setStatus] = createSignal<string>("");
  let nameInput: HTMLInputElement | undefined;
  let emailInput: HTMLInputElement | undefined;
  let messageInput: HTMLTextAreaElement | undefined;

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const next: FormErrors = {
      name:
        name().trim() === ""
          ? "Add your name so we know who we are replying to."
          : "",
      email:
        email().trim() === "" || !isEmail(email().trim())
          ? "That email address needs an @ and a domain. Check it and try again."
          : "",
      message:
        message().trim() === ""
          ? "Write a line about what you need before opening the draft."
          : "",
    };
    setErrors(next);

    if (next.name !== "") {
      setStatus(next.name);
      nameInput?.focus();
      return;
    }
    if (next.email !== "") {
      setStatus(next.email);
      emailInput?.focus();
      return;
    }
    if (next.message !== "") {
      setStatus(next.message);
      messageInput?.focus();
      return;
    }

    setStatus("");

    const body: string = `${message().trim()}\n\nFrom: ${name().trim()} (${email().trim()})`;
    const params: string[] = [];
    if (subject().trim() !== "") {
      params.push(`subject=${encodeURIComponent(subject().trim())}`);
    }
    params.push(`body=${encodeURIComponent(body)}`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?${params.join("&")}`;
  };

  return (
    <main id={layoutStyle.mainContent} tabindex="-1">
      <div id={style.contact}>
        <PageHero
          lines={["Write to", "a person."]}
          lead="Support, press, and product questions all reach the same small team, and we read every message."
          compact={false}
        />
        <section id={style.reach}>
          <h2 id={style.reachTitle} ref={reveal()}>
            Ways to reach us
          </h2>
          <ul id={style.reachList}>
            <For each={REACH_ROWS}>
              {(row: ReachRow, index) => (
                <li ref={reveal(staggerOrder(index(), 2))}>
                  <div>
                    <h3>{row.name}</h3>
                    <p>{row.description}</p>
                  </div>
                  <a href={row.href}>{row.label}</a>
                </li>
              )}
            </For>
          </ul>
        </section>
        <section id={style.write}>
          <div id={style.writeIntro}>
            <h2 id={style.writeTitle} ref={reveal()}>
              Send us a message
            </h2>
            <p id={style.writeLead} ref={reveal(1)}>
              Tell us what happened, and which app you were using.
            </p>
          </div>
          <form id={style.writeForm} noValidate onSubmit={handleSubmit}>
            <div>
              <div>
                <label for={style.fieldName}>
                  Name
                </label>
                <span>Required</span>
              </div>
              <input
                classList={{ [style.fieldInputInvalid]: errors().name !== "" }}
                id={style.fieldName}
                type="text"
                name="name"
                autocomplete="name"
                required
                value={name()}
                aria-invalid={errors().name !== "" ? "true" : undefined}
                aria-describedby={
                  errors().name !== "" ? style.fieldNameError : undefined
                }
                ref={(element: HTMLInputElement): void => {
                  nameInput = element;
                }}
                onInput={(event) => setName(event.currentTarget.value)}
              />
              <Show when={errors().name !== ""}>
                <p id={style.fieldNameError}>
                  {errors().name}
                </p>
              </Show>
            </div>
            <div>
              <div>
                <label for={style.fieldEmail}>
                  Email
                </label>
                <span>Required</span>
              </div>
              <input
                classList={{
                  [style.fieldInputInvalid]: errors().email !== "",
                }}
                id={style.fieldEmail}
                type="email"
                name="email"
                autocomplete="email"
                required
                value={email()}
                aria-invalid={errors().email !== "" ? "true" : undefined}
                aria-describedby={
                  errors().email !== "" ? style.fieldEmailError : undefined
                }
                ref={(element: HTMLInputElement): void => {
                  emailInput = element;
                }}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
              <Show when={errors().email !== ""}>
                <p id={style.fieldEmailError}>
                  {errors().email}
                </p>
              </Show>
            </div>
            <div>
              <div>
                <label for={style.fieldSubject}>
                  Subject
                </label>
                <span>Optional</span>
              </div>
              <input
                id={style.fieldSubject}
                type="text"
                name="subject"
                value={subject()}
                onInput={(event) => setSubject(event.currentTarget.value)}
              />
            </div>
            <div>
              <div>
                <label for={style.fieldMessage}>
                  Message
                </label>
                <span>Required</span>
              </div>
              <textarea
                classList={{
                  [style.fieldInputInvalid]: errors().message !== "",
                }}
                id={style.fieldMessage}
                name="message"
                rows="6"
                required
                value={message()}
                aria-invalid={errors().message !== "" ? "true" : undefined}
                aria-describedby={
                  errors().message !== "" ? style.fieldMessageError : undefined
                }
                ref={(element: HTMLTextAreaElement): void => {
                  messageInput = element;
                }}
                onInput={(event) => setMessage(event.currentTarget.value)}
              />
              <Show when={errors().message !== ""}>
                <p id={style.fieldMessageError}>
                  {errors().message}
                </p>
              </Show>
            </div>
            <button
              id={style.writeSubmit}
              type="submit"
              aria-describedby={style.writeHelper}
            >
              Open email draft
            </button>
            <p id={style.status} role="status">
              {status()}
            </p>
          </form>
          <div id={style.writeNotes}>
            <p id={style.writeHelper}>
              This opens your email app with the message ready to send to{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
            <p id={style.writeFallback}>
              If nothing opens, email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> directly.
            </p>
          </div>
        </section>
        <Faq heading="Before you write in" items={FAQ_ITEMS} />
        <section id={style.contactCta}>
          <h2 id={style.contactCtaTitle} ref={reveal()}>
            Rather look around first?
          </h2>
          <p id={style.contactCtaLead} ref={reveal(1)}>
            The products page explains both apps, and the about page explains
            why there are two.
          </p>
          <div id={style.contactCtaActions} ref={reveal(2)}>
            <A href="/products">
              Explore products
            </A>
            <A href="/about">
              About dvibd
            </A>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Contact;
