import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';
import App from './App';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/index.css';

const root = document.getElementById('root');

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Router>
  ),
  root!,
);
