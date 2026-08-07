import style from '../../../../styles/pages/dvibd/home/About.module.css'
import AboutHero from '../../../components/dvibd/home/about/AboutHero.tsx'
import Mission from '../../../components/dvibd/home/about/Mission.tsx'
import VisionStory from '../../../components/dvibd/home/about/VisionStory.tsx'
import Values from '../../../components/dvibd/home/about/Values.tsx'
import AboutProducts from '../../../components/dvibd/home/about/AboutProducts.tsx'

function About() {
  return (
    <main id={style.about}>
      <AboutHero />
      <Mission />
      <VisionStory />
      <Values />
      <AboutProducts />
    </main>
  )
}

export default About