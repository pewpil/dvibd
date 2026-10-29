import style from "../../../../../styles/components/dvibd/home/fragments/Composer.module.css";

function Composer() {
  return (
    <article id={style.composer} data-ui="true">
      <header id={style.authorLine}>
        <span id={style.avatar} aria-hidden="true">
          AC
        </span>
        <span id={style.authorName}>Aria Chen</span>
      </header>
      <div id={style.communityRow}>
        <span>Post to</span>
        <span id={style.communityValue}>Design Tokens</span>
      </div>
      <p id={style.placeholder}>What are you working on?</p>
      <div id={style.controls}>
        <span id={style.photoControl} role="img" aria-label="Add photos">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
              x="3.5"
              y="5.5"
              width="17"
              height="13"
              rx="2.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <path
              d="M4.5 17l4.5-4.5 3.5 3.5 3-3 4 4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span id={style.postButton}>Post</span>
      </div>
    </article>
  );
}

export default Composer;
