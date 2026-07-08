import type { Component } from 'solid-js';
import style from '../../../styles/dvibd/auth/Field.module.css';

interface FieldProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
}

const Field: Component<FieldProps> = (props) => {
  return (
    <div class={style.field}>
      <span class={style.label}>{props.label}</span>
      <input
        class={style.input}
        type={props.type ?? 'text'}
        placeholder={props.placeholder ?? ''}
      />
    </div>
  );
};

export default Field;
