import { useNavigate } from "@solidjs/router";
import type { JSX } from "solid-js";
import style from "../../styles/components/(home)/BackButton.module.css";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;

interface BackButtonProps {
  onBack?: () => void;
}

export default function BackButton(props: BackButtonProps): JSX.Element {
  const navigate = useNavigate();

  const goBack = (): void => {
    if (props.onBack !== undefined) {
      props.onBack();
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  return (
    <button
      type="button"
      id={style.backButton}
      aria-label="Back"
      title="Back"
      onClick={goBack}
    >
      <svg {...iconProps}>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
