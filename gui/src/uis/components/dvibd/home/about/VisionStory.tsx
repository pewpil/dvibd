import style from '../../../../../styles/components/dvibd/home/about/VisionStory.module.css'

function VisionStory() {
  return (
    <section id={style.visionStory}>
      <div id={style.visionStoryInner}>
        <h2>Our vision</h2>
        <p>
          We started with a simple idea — that good software should never get
          in the way of human connection. Too many products treat their users
          as numbers, and communication as a market. We think connection is
          personal, and the tools we use to connect should respect that.
        </p>
        <p>
          That belief shapes everything we build. We measure our products not
          by engagement or screen time, but by how well they bring people
          closer — a friend reached, a community found, a conversation that
          never stops. The more the world can connect, the better our work is
          done.
        </p>
      </div>
    </section>
  )
}

export default VisionStory