import type { Component } from 'solid-js';
import style from '../../styles/dvibd/Action.module.css';

interface ActionProps {
  bgColor: string;
  textColor: string;
  href: string;
  radius?: number;
  fullWidth?: boolean;
  children: string;
}

const Action: Component<ActionProps> = (props) => {
  return (
    <a
      href={props.href}
      class={style.action}
      classList={{ [style.fullWidth!]: props.fullWidth }}
      style={{
        background: props.bgColor,
        color: props.textColor,
        '--radius': props.radius ? `${props.radius}px` : undefined,
      } as Record<string, string>}
    >
      {props.children}
    </a>
  );
};

export default Action;
