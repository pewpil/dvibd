import style from '../../../../styles/pages/dvibd/home/Contact.module.css'
import ContactHero from '../../../components/dvibd/home/contact/ContactHero.tsx'
import ContactChannels from '../../../components/dvibd/home/contact/ContactChannels.tsx'
import ContactForm from '../../../components/dvibd/home/contact/ContactForm.tsx'
import ContactFAQ from '../../../components/dvibd/home/contact/ContactFAQ.tsx'
import ContactCTA from '../../../components/dvibd/home/contact/ContactCTA.tsx'

function Contact() {
  return (
    <main id={style.contact}>
      <ContactHero />
      <ContactChannels />
      <ContactForm />
      <ContactFAQ />
      <ContactCTA />
    </main>
  )
}

export default Contact