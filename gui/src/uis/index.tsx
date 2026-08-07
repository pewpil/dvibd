/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import '../styles/index.css'
import App from './pages/dvibd/App.tsx'
import Home from './pages/dvibd/home/Home.tsx'
import Landing from './pages/dvibd/home/Landing.tsx'
import Products from './pages/dvibd/home/Products.tsx'
import About from './pages/dvibd/home/About.tsx'
import Contact from './pages/dvibd/home/Contact.tsx'

const root = document.getElementById('root')

render(
  () => (
    <Router>
      <Route path="/" component={App}>
        <Route path="/" component={Home}>
          <Route path="/" component={Landing} />
          <Route path="/products" component={Products} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </Route>
      </Route>
    </Router>
  ),
  root!,
)
