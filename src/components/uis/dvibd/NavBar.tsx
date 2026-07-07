import type { Component } from 'solid-js';
import { A } from '@solidjs/router';
import style from '../../styles/dvibd/NavBar.module.css';

const NavBar: Component = () => {
  return (
    <nav class={style.navbar}>
      <A href="/" class={style.logo}>dvibd</A>
      <div class={style.menu}>
        <A href="/products" class={style.link}>Products</A>
        <A href="/about" class={style.link}>About</A>
        <A href="/contact" class={style.link}>Contact</A>
        <A href="/login" class={style.link}>Log In</A>
      </div>
    </nav>
  );
};

export default NavBar;
