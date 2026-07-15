import { createSignal, For } from 'solid-js';
import { Action } from '~/dvibd/uis/components/Action';
import { Icon } from '~/dvibd/uis/components/Icon';
import styles from '~/dvibd/styles/pages/app/Contact.module.css';

const channels = [
  {
    color: 'purple' as const,
    icon: 'mail' as const,
    title: 'Email',
    value: 'hello@dvibd.app',
    href: 'mailto:hello@dvibd.app',
  },
  {
    color: 'teal' as const,
    icon: 'globe' as const,
    title: 'Community',
    value: 'discord.gg/dvibd',
    href: '#',
  },
  {
    color: 'coral' as const,
    icon: 'social' as const,
    title: 'Social',
    value: '@dvibd',
    href: '#',
  },
];

export default function Contact() {
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [message, setMessage] = createSignal('');
  const [sent, setSent] = createSignal(false);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div class={styles.page}>
      <section class={`container ${styles.head}`}>
        <span class={styles.eyebrow}>Contact</span>
        <h1 class={styles.title}>Let’s talk</h1>
        <p class={styles.lead}>
          Questions, feedback, or early-access requests — send a note and the
          dvibd team will get back to you.
        </p>
      </section>

      <div class={`container ${styles.layout}`}>
        <div class={styles.formCol}>
          {sent() ? (
            <div class={styles.success}>
              <div class={styles.successIcon}>
                <Icon name="check" size={32} />
              </div>
              <h2>Thanks, {name() || 'friend'}!</h2>
              <p>
                Your message is on its way. We’ll reply to{' '}
                <strong>{email() || 'your inbox'}</strong> soon.
              </p>
              <Action variant="secondary" color="purple" onClick={() => setSent(false)}>
                Send another
              </Action>
            </div>
          ) : (
            <form class={styles.form} onSubmit={handleSubmit}>
              <label class={styles.field}>
                <span>Name</span>
                <input
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  placeholder="Ada Lovelace"
                  required
                />
              </label>

              <label class={styles.field}>
                <span>Email</span>
                <input
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label class={styles.field}>
                <span>Message</span>
                <textarea
                  rows={5}
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  placeholder="Tell us what’s on your mind…"
                  required
                />
              </label>

              <Action variant="primary" color="purple" submit>
                Send message
              </Action>
            </form>
          )}
        </div>

        <aside class={styles.aside}>
          <h2 class={styles.asideTitle}>Other ways to reach us</h2>
          <For each={channels}>
            {(c) => (
              <a href={c.href} class={`${styles.channel} ${styles[c.color]}`}>
                <span class={styles.channelIcon}>
                  <Icon name={c.icon} size={20} />
                </span>
                <span>
                  <span class={styles.channelTitle}>{c.title}</span>
                  <span class={styles.channelValue}>{c.value}</span>
                </span>
              </a>
            )}
          </For>
        </aside>
      </div>
    </div>
  );
}
