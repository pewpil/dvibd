/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route } from '@solidjs/router'
import './pages/dvibd/styles/index.module.css'
import App from './pages/dvibd/ui/App.tsx'
import Login from './pages/dvibd/ui/Login.tsx'
import Signup from './pages/dvibd/ui/Signup.tsx'

const root = document.getElementById('root')

render(() => (
  <Router>
    <Route path="/" component={App} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
  </Router>
), root!)
