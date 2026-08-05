/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import '../styles/index.css'
import App from './pages/dvibd/App.tsx'
import Home from './pages/dvibd/home/Home.tsx'
import Landing from './pages/dvibd/home/Landing.tsx'

const root = document.getElementById('root')

render(
  () => (
    <Router>
      <Route path="/" component={App}>
        <Route path="/" component={Home}>
          <Route path="/" component={Landing} />
        </Route>
      </Route>
    </Router>
  ),
  root!,
)
