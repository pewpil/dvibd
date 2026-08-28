import { A } from '@solidjs/router'
import type { ParentProps } from 'solid-js'
import logo from '../../../../assets/pages/dvibd/home/logo.svg'
import style from '../../../../styles/components/dvibd/auth/Auth.module.css'

function Auth(props: ParentProps) {
  return (
    <div id={style.auth}>
      <div id={style.authInner}>
        <A id={style.authBrand} href="/" end>
          <img src={logo} alt="dvibd logo" />
          <span id={style.authBrandName}>
            dvibd<span id={style.authBrandDot}>.</span>
          </span>
        </A>
        {props.children}
      </div>
    </div>
  )
}

export default Auth