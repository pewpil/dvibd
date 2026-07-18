import type { JSX } from 'solid-js';
import styles from '~/social/styles/components/Field.module.css';

type Props = {
  label: string;
  type?: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autocomplete?: string;
  icon?: JSX.Element;
};

export function Field(props: Props): JSX.Element {
  return (
    <label class={styles.field}>
      <span>{props.label}</span>
      <div class={props.icon ? `${styles.control} ${styles.hasIcon}` : styles.control}>
        {props.icon && <span class={styles.icon}>{props.icon}</span>}
        <input
          type={props.type ?? 'text'}
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          placeholder={props.placeholder}
          required={props.required}
          autocomplete={props.autocomplete}
        />
      </div>
    </label>
  );
}
