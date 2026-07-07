/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import './pages/dvibd/styles/index.module.css'
import App from './pages/dvibd/ui/App.tsx'

const root = document.getElementById('root')

render(() => (
  <Router>
    <Route path="/" component={App} />
  </Router>
), root!)
