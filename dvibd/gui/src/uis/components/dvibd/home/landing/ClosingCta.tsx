import CreateAccountDialog from "../fragments/CreateAccountDialog.tsx";
import { reveal } from "../../../../directives/reveal.ts";
import style from "../../../../../styles/components/dvibd/home/landing/ClosingCta.module.css";

function ClosingCta() {
  return (
    <section id={style.closingCta}>
      <div id={style.closingCopy}>
        <h2 id={style.closingTitle} ref={reveal()}>
          <span id={style.closingLineOne}>Start with</span>
          <span id={style.closingLineTwo}>your name.</span>
        </h2>
        <p id={style.closingLead} ref={reveal(1)}>
          Type a name, continue, and the sign-up page finishes the account.
        </p>
      </div>
      <div id={style.closingDialog} ref={reveal(1)}>
        <CreateAccountDialog />
      </div>
    </section>
  );
}

export default ClosingCta;
