import { createSignal, For, Show } from "solid-js";
import slidersIcon from "../../../assets/components/(home)/explore/sliders.svg?raw";
import { interestTags } from "../../../data/social";
import style from "../../../styles/components/(home)/explore/ExploreHeader.module.css";

export default function ExploreHeader() {
  const [query, setQuery] = createSignal("");
  const [filterOpen, setFilterOpen] = createSignal(false);
  const [activeTags, setActiveTags] = createSignal<Set<string>>(new Set());

  return (
    <div id={style.exploreHeader}>
      <div id={style.searchRow}>
        <form id={style.searchForm} role="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4.2-4.2" />
          </svg>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
        </form>
        <button
          type="button"
          aria-label="Search filters"
          aria-expanded={filterOpen()}
          class={filterOpen() ? style.filterActive : undefined}
          onClick={() => setFilterOpen(!filterOpen())}
        >
          <span id={style.filterIcon} innerHTML={slidersIcon} />
        </button>
      </div>
      <Show when={filterOpen()}>
        <div id={style.tagRow}>
          <For each={interestTags}>
            {(tag) => (
              <button
                type="button"
                class={activeTags().has(tag) ? style.activeTag : undefined}
                onClick={() =>
                  setActiveTags((prev) => {
                    const next = new Set(prev);
                    if (next.has(tag)) {
                      next.delete(tag);
                    } else {
                      next.add(tag);
                    }
                    return next;
                  })
                }
              >
                {tag}
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}