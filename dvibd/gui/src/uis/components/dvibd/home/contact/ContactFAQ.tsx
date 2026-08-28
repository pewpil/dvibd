import style from '../../../../../styles/components/dvibd/home/contact/ContactFAQ.module.css'

const faqs = [
  {
    question: "I can't log in. What should I do?",
    answer:
      'Try resetting your password from the login screen. Still stuck? Send us a message with the email you use for dvibd.',
  },
  {
    question: 'Where do I send product feedback?',
    answer:
      'Feedback is always welcome — send it through this form, or reach us directly at support@dvibd.com.',
  },
  {
    question: 'How do I report something on Social or Message?',
    answer:
      'Use the report option inside the app, or write to us here and we will take a look.',
  },
]

function ContactFAQ() {
  return (
    <section id={style.contactFaq}>
      <div id={style.contactFaqInner}>
        <h2>Before you write in</h2>
        <ul id={style.contactFaqList}>
          {faqs.map((faq) => (
            <li>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ContactFAQ