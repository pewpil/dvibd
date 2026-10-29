import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import style from "../../../../../styles/components/dvibd/home/fragments/CreateAccountDialog.module.css";

function CreateAccountDialog() {
  const navigate = useNavigate();
  const [name, setName] = createSignal<string>("Aria Chen");
  const [error, setError] = createSignal<string>("");

  const handleSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    const value: string = name().trim();
    if (value.length === 0) {
      setError("Add a name to continue.");
      return;
    }
    setError("");
    navigate(`/signup?name=${encodeURIComponent(value)}`);
  };

  return (
    <form
      id={style.dialog}
      data-ui="true"
      onSubmit={handleSubmit}
      noValidate
    >
      <p id={style.title}>Name your account</p>
      <div id={style.field}>
        <label id={style.label} for={style.nameInput}>
          Display name
        </label>
        <input
          id={style.nameInput}
          type="text"
          name="displayName"
          value={name()}
          autocomplete="name"
          aria-invalid={error().length > 0}
          aria-describedby={error().length > 0 ? style.nameError : undefined}
          onInput={(event) => setName(event.currentTarget.value)}
        />
        <Show when={error().length > 0}>
          <p id={style.nameError}>{error()}</p>
        </Show>
      </div>
      <button id={style.submit} type="submit">
        Continue
      </button>
      <p id={style.note}>The sign-up page finishes the account.</p>
    </form>
  );
}

export default CreateAccountDialog;
