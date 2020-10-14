import { Controller } from "stimulus";
// import axios from "axios";

export default class extends Controller {
  static targets = [ "pay", "wait" ];

  connect() {
    const payBtn = this.payTarget;
    const waitBtn = this.waitTarget;

    payBtn.addEventListener("click", () => {
      payBtn.remove();
      waitBtn.classList.remove("x");
    });
  }
}
