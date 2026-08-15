import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import style from "../../styles/pages/(home)/settings.module.css";

export default function Settings() {
  return [
    <FeedHeader>
      <FeedTabs tabs={["Discover", "Following"]} />
    </FeedHeader>,
    <div id={style.settings}>
      <h1>Settings</h1>
      <p>Coming soon.</p>
    </div>,
  ];
}