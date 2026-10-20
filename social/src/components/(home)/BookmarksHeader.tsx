import { createSignal, Show } from "solid-js";
import searchIcon from "../../assets/components/(home)/bookmarks/search.svg?raw";
import closeIcon from "../../assets/components/(home)/bookmarks/close.svg?raw";
import FeedTabs from "../../components/(home)/FeedTabs";
import style from "../../styles/components/(home)/BookmarksHeader.module.css";

interface BookmarksHeaderProps {
  tab: "stat" | "article";
  onTab: (tab: "stat" | "article") => void;
  query: string;
  onQuery: (query: string) => void;
}

const bookmarkTabValues: ReadonlyArray<{
  label: "Stats" | "Articles";
  value: "stat" | "article";
}> = [
  { label: "Stats", value: "stat" },
  { label: "Articles", value: "article" },
];

export default function BookmarksHeader(props: BookmarksHeaderProps) {
  const [searchOpen, setSearchOpen] = createSignal(false);

  return (
    <div id={style.bookmarksHeader}>
      <Show
        when={!searchOpen()}
        fallback={
          <div id={style.searchRow}>
            <form id={style.searchForm} role="search">
              <span id={style.searchIcon} innerHTML={searchIcon} />
              <input
                type="search"
                placeholder="Search bookmarks"
                aria-label="Search bookmarks"
                value={props.query}
                onInput={(e) => props.onQuery(e.currentTarget.value)}
              />
            </form>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <span id={style.searchIcon} innerHTML={closeIcon} />
            </button>
          </div>
        }
      >
        <div id={style.titleRow}>
          <h1 id={style.headerTitle}>Bookmarks</h1>
          <button
            type="button"
            aria-label="Search bookmarks"
            onClick={() => setSearchOpen(true)}
          >
            <span id={style.searchIcon} innerHTML={searchIcon} />
          </button>
        </div>
      </Show>
      <FeedTabs
        tabs={bookmarkTabValues.map((entry) => entry.label)}
        value={
          bookmarkTabValues.find((entry) => entry.value === props.tab)?.label
        }
        onChange={(label: string) => {
          const match = bookmarkTabValues.find((entry) => entry.label === label);
          if (match) props.onTab(match.value);
        }}
      />
    </div>
  );
}