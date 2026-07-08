import { For, type Component } from 'solid-js';
import style from '../../../styles/dvibd/app/Contact.module.css';
import Field from '@components/uis/dvibd/auth/Field';
import Action from '@components/uis/dvibd/Action';

const Contact: Component = () => {
  const infoItems = [
    { label: 'Email', value: 'hello@dvibd.com' },
    { label: 'Phone', value: '+1 (555) 000-0000' },
    { label: 'Location', value: 'San Francisco, California' },
  ];

  return (
    <div class={style.contact}>
      <section class={style.hero}>
        <h1 class={style.heroHeading}>Get In Touch</h1>
        <p class={style.heroSubtitle}>
          Have questions or feedback? We would love to hear from you.
        </p>
      </section>

      <section class={style.content}>
        <div class={style.infoCard}>
          <h2 class={style.infoHeading}>Contact Information</h2>
          <For each={infoItems}>
            {(item) => (
              <div class={style.infoItem}>
                <span class={style.infoLabel}>{item.label}</span>
                <span class={style.infoValue}>{item.value}</span>
              </div>
            )}
          </For>
        </div>

        <div class={style.formCard}>
          <h2 class={style.formHeading}>Send us a message</h2>
          <p class={style.formSubtitle}>
            Fill out the form below and we will get back to you shortly.
          </p>

          <Field label="Name" placeholder="John Doe" />
          <Field label="Email address" placeholder="you@example.com" type="email" />
          <Field label="Subject" placeholder="What is this about?" />

          <div class={style.messageField}>
            <span class={style.messageLabel}>Message</span>
            <textarea
              class={style.messageInput}
              placeholder="Write your message here..."
              rows={5}
            />
          </div>

          <Action
            bgColor="#6c63ff"
            textColor="#ffffff"
            href="/"
            radius={24}
            fullWidth
          >
            Send Message
          </Action>
        </div>
      </section>
    </div>
  );
};

export default Contact;
