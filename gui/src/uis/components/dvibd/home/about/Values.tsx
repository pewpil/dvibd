import style from '../../../../../styles/components/dvibd/home/about/Values.module.css'

const values = [
  {
    name: 'Connection first',
    description:
      'Our products are measured by how well they bring people closer — not by screen time.',
  },
  {
    name: 'Borderless',
    description:
      'Distance, devices, and time zones should never be the reason a conversation stops.',
  },
  {
    name: 'Privacy by default',
    description:
      'What you share, and who you share it with, is always your choice.',
  },
  {
    name: 'Simplicity',
    description:
      'Powerful software should feel simple to use — so the tools get out of the way.',
  },
]

function Values() {
  return (
    <section id={style.values}>
      <div id={style.valuesInner}>
        <h2>What we believe</h2>
        <div id={style.valuesGrid}>
          {values.map((value) => (
            <article class={style.valueCard}>
              <h3>{value.name}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Values