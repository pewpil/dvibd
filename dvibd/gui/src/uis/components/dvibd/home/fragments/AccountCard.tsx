import style from "../../../../../styles/components/dvibd/home/fragments/AccountCard.module.css";

interface AccountCardProps {
  context: string;
}

function AccountCard(props: AccountCardProps) {
  return (
    <article id={style.accountCard} data-ui="true">
      <span id={style.avatar} aria-hidden="true">
        AC
      </span>
      <span id={style.names}>
        <span id={style.name}>Aria Chen</span>
        <span id={style.handle}>@ariachen</span>
        <span id={style.role}>Product Designer</span>
      </span>
      <p id={style.context}>{props.context}</p>
    </article>
  );
}

export default AccountCard;
