import { Controller } from "stimulus";
// import axios from "axios";
import Swal from "sweetalert2";

export default class extends Controller {
  static targets = [ "form" ];

  submit(e) {
    e.preventDefault();

    const form = this.formTarget;
    const book = form.dataset.pricingBook;

    Swal
      .fire({
        text: "Publishing？",
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
          form.submit();
        }
      });
  }
}
