import style from "../../../../../styles/components/dvibd/home/fragments/ProfileChip.module.css";

function ProfileChip() {
  return (
    <div id={style.profileChip} data-ui="true">
      <span id={style.avatar} aria-hidden="true">
        AC
      </span>
      <span id={style.names}>
        <span id={style.name}>Aria Chen</span>
        <span id={style.handle}>@ariachen</span>
        <span id={style.role}>Product Designer</span>
        <span id={style.status}>On Social and Message</span>
      </span>
    </div>
  );
}

export default ProfileChip;
