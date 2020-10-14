import { Controller } from "stimulus";
// import axios from "axios";
import Swal from "sweetalert2";

export default class extends Controller {
  static targets = [ "form", "btn", "submit" ];

  connect() {
    const form = this.formTarget;
    const book = form.dataset.pricingBook;
    const btn = this.btnTarget;
    const submitBtn = this.submitTarget;

    btn.addEventListener("click", () => {
      Swal
      .fire({
        text: "確定上架？",
        icon: "warning",
        iconColor: "#f33",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Yes",
        confirmButtonColor: "#e09a5f",
        focusCancel: true
      })
      .then(result => {
        if (result.value) {
          form.action = `/books/${book}/publish`;
          submitBtn.click();
        }
      });
    });
  }
}
