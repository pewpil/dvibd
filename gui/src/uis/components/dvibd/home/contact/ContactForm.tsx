import style from '../../../../../styles/components/dvibd/home/contact/ContactForm.module.css'

function ContactForm() {
  return (
    <section id={style.contactForm}>
      <form id={style.contactFormCard}>
        <h2>Send us a message</h2>
        <p id={style.formIntro}>
          Tell us what's on your mind. We usually reply within 24–48 hours.
        </p>
        <div id={style.formRow}>
          <label>
            Name
            <input type="text" name="name" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
        </div>
        <label>
          Subject
          <input type="text" name="subject" placeholder="What is this about?" />
        </label>
        <label>
          Message
          <textarea
            name="message"
            placeholder="Write your message…"
            rows={6}
            required
          />
        </label>
        <button id={style.formSubmit} type="submit">
          Send message
        </button>
      </form>
    </section>
  )
}

export default ContactForm