import AccountCard from "../fragments/AccountCard.tsx";
import { reveal } from "../../../../directives/reveal.ts";
import style from "../../../../../styles/components/dvibd/home/products/SharedAccount.module.css";

function SharedAccount() {
  return (
    <section id={style.sharedAccount}>
      <div id={style.sharedText}>
        <h2 id={style.sharedTitle} ref={reveal()}>
          The same account in both
        </h2>
        <p id={style.sharedLead} ref={reveal(1)}>
          Your profile, your friends, and your communities are one set. Join a
          community in Social, then start a conversation with someone you met
          there.
        </p>
      </div>
      <div id={style.sharedCard} ref={reveal(2)}>
        <AccountCard context="On Social and Message" />
      </div>
    </section>
  );
}

export default SharedAccount;
