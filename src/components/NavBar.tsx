import type { Component } from 'solid-js'
import './NavBar.css'

const NavBar: Component = () => {
  return (
    <nav class="navbar">
      <span class="navbar-logo">dvibd</span>
      <div class="navbar-menu">
        <a href="#" class="navbar-link">Products</a>
        <a href="#" class="navbar-link">About</a>
        <a href="#" class="navbar-link">Contact</a>
      </div>
    </nav>
  )
}

export default NavBar