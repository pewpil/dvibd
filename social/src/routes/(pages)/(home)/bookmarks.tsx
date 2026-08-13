import FeedHeader from "../../../components/(home)/FeedHeader";
import FeedTabs from "../../../components/(home)/FeedTabs";
import style from "../../../styles/pages/(home)/bookmarks.module.css";

export default function Bookmarks() {
  return [
    <FeedHeader>
      <FeedTabs tabs={["Discover", "Following"]} />
    </FeedHeader>,
    <div id={style.bookmarks}>
      <h1>Bookmarks</h1>
      <p>Coming soon.</p>
    </div>,
  ];
}