import type { Component } from 'solid-js'
import { A } from '@solidjs/router'
import s from '../styles/NavBar.module.css'

const NavBar: Component = () => {
  return (
    <nav class={s.navbar}>
      <span class={s.logo}>dvibd</span>
      <div class={s.menu}>
        <A href="/products" class={s.link}>Products</A>
        <A href="/about" class={s.link}>About</A>
        <A href="/contact" class={s.link}>Contact</A>
        <A href="/login" class={s.link}>Log In</A>
      </div>
    </nav>
  )
}

export default NavBar
