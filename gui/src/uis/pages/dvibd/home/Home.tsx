import type { ParentProps } from 'solid-js'
import NavBar from '../../../components/dvibd/home/NavBar.tsx'
import Footer from '../../../components/dvibd/home/Footer.tsx'

function Home(props: ParentProps) {
  return (
    <div id="home">
      <NavBar />
      {props.children}
      <Footer />
    </div>
  )
}

export default Home