import type { JSX } from "solid-js";
import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

import Button from "@src/dvibd/uis/components/Button";
import styles from "@src/dvibd/styles/pages/home/Contact.module.css";

const channels = [
  { label: "Email", value: "hello@dvibd.com" },
  { label: "Support", value: "support@dvibd.com" },
  { label: "Press", value: "press@dvibd.com" },
];

function Contact(): JSX.Element {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [sent, setSent] = createSignal(false);

  function submit(e: Event): void {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main class={styles.contact}>
      <section class={styles.hero}>
        <span class={styles.badge}>Contact</span>
        <h1 class={styles.title}>
          Let's <span class={styles.titleAccent}>talk</span>.
        </h1>
        <p class={styles.lead}>
          Questions, feedback, or partnerships — reach out and the dvibd team
          will get back to you.
        </p>
      </section>

      <section class={styles.body}>
        <div class={styles.formCard}>
          {sent() ? (
            <div class={styles.success}>
              <h3 class={styles.successTitle}>Thanks for reaching out!</h3>
              <p class={styles.successText}>
                We've received your message and will reply soon.
              </p>
              <Button variant="ghost" href="/">
                Back to home
              </Button>
            </div>
          ) : (
            <form class={styles.form} onSubmit={submit}>
              <label class={styles.field}>
                <span class={styles.label}>Name</span>
                <input
                  class={styles.input}
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label class={styles.field}>
                <span class={styles.label}>Email</span>
                <input
                  class={styles.input}
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label class={styles.field}>
                <span class={styles.label}>Message</span>
                <textarea
                  class={styles.textarea}
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  placeholder="How can we help?"
                  rows={5}
                  required
                />
              </label>

              <Button variant="primary" href="#" onClick={(e) => e.preventDefault()}>
                Send message
              </Button>
            </form>
          )}
        </div>

        <aside class={styles.aside}>
          <h3 class={styles.asideTitle}>Other ways to reach us</h3>
          <ul class={styles.channels}>
            {channels.map((channel) => (
              <li class={styles.channel}>
                <span class={styles.channelLabel}>{channel.label}</span>
                <span class={styles.channelValue}>{channel.value}</span>
              </li>
            ))}
          </ul>
          <p class={styles.note}>
            We typically respond within one business day.
          </p>
          <A class={styles.backLink} href="/">
            Back to home
          </A>
        </aside>
      </section>
    </main>
  );
}

export default Contact;
