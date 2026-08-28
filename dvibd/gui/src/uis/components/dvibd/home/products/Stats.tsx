import style from '../../../../../styles/components/dvibd/home/products/Stats.module.css'

const stats = [
  { value: '2.4M+', label: 'people connecting daily' },
  { value: '150M+', label: 'messages sent every day' },
  { value: '40K+', label: 'communities to join' },
]

function Stats() {
  return (
    <section id={style.stats}>
      <ul id={style.statsList}>
        {stats.map((stat) => (
          <li>
            <span class={style.statValue}>{stat.value}</span>
            <span class={style.statLabel}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Stats
