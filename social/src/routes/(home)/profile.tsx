import FeedHeader from "../../components/(home)/FeedHeader";
import FeedTabs from "../../components/(home)/FeedTabs";
import style from "../../styles/pages/(home)/profile.module.css";

export default function Profile() {
  return [
    <FeedHeader>
      <FeedTabs tabs={["Discover", "Following"]} />
    </FeedHeader>,
    <div id={style.profile}>
      <h1>Profile</h1>
      <p>Coming soon.</p>
    </div>,
  ];
}