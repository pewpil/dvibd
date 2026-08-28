import style from '../../../../../styles/components/dvibd/home/contact/ContactChannels.module.css'

const channels = [
  {
    name: 'Support',
    description: 'Account help, reports, and product questions.',
    link: 'mailto:support@dvibd.com',
    linkLabel: 'support@dvibd.com',
  },
  {
    name: 'Press & business',
    description: 'Partnerships, media inquiries, and collaborations.',
    link: 'mailto:press@dvibd.com',
    linkLabel: 'press@dvibd.com',
  },
  {
    name: 'Social',
    description: 'Follow along and find us through the Social app.',
    link: '/social',
    linkLabel: 'dvibd on Social',
  },
  {
    name: 'Message',
    description: 'Prefer chat? Message us right from the app.',
    link: '/message',
    linkLabel: 'Message us',
  },
]

function ContactChannels() {
  return (
    <section id={style.contactChannels}>
      <div id={style.contactChannelsInner}>
        <h2>Ways to reach us</h2>
        <div id={style.channelsGrid}>
          {channels.map((channel) => (
            <article class={style.channelCard}>
              <h3>{channel.name}</h3>
              <p>{channel.description}</p>
              <a href={channel.link}>{channel.linkLabel}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactChannels