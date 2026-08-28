import { createSignal, For } from 'solid-js'
import style from '../../../../../styles/components/dvibd/home/products/FAQ.module.css'

const faqs = [
  {
    question: 'Do Social and Message use the same account?',
    answer:
      'Yes. One dvibd account works across both products — your profile, friends, and conversations carry over automatically.',
  },
  {
    question: 'Is Message free to use?',
    answer:
      'Message is free. Send as many messages as you like to anyone on dvibd, no matter where they are in the world.',
  },
  {
    question: 'Can I share posts from Social into Message?',
    answer:
      'Absolutely. Share a post straight into a chat or a group conversation so the people you care about see it right away.',
  },
  {
    question: 'Are my messages private?',
    answer:
      'Messages are only visible to the people in the conversation. You stay in control of who can reach you at all times.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = createSignal<number | null>(0)

  return (
    <section id={style.faq}>
      <div id={style.faqInner}>
        <h2>Frequently asked questions</h2>
        <ul id={style.faqList}>
          <For each={faqs}>
            {(faq, index) => (
              <li classList={{ [style.faqItem]: true, [style.open]: openIndex() === index() }}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(openIndex() === index() ? null : index())
                  }
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">{openIndex() === index() ? '−' : '+'}</span>
                </button>
                {openIndex() === index() && <p>{faq.answer}</p>}
              </li>
            )}
          </For>
        </ul>
      </div>
    </section>
  )
}

export default FAQ
