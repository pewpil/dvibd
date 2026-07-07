/* @refresh reload */
import { render } from 'solid-js/web'
import './styles/dvibd/index.css'
import App from './pages/dvibd/App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
