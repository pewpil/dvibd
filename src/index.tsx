/* @refresh reload */
import { render } from 'solid-js/web'
import './pages/dvibd/styles/index.css'
import App from './pages/dvibd/ui/App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
