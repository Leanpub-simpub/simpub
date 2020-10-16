import { Controller } from "stimulus";
// import axios from "axios";
import Swal from "sweetalert2";

export default class extends Controller {
  static targets = [ "form", "price" ];

  submit(e) {
    e.preventDefault();

    const form = this.formTarget;
    const book = form.dataset.pricingBook;
    const priceInput = this.priceTarget;

    if (priceInput.value < 0 || priceInput.value > 100) {
      Swal
      .fire({
        text: "Please enter a valid price",
        icon: "error",
        iconColor: "#e09a5f",
        showCancelButton: true,
        cancelButtonText: "OK",
        focusCancel: true,
        showConfirmButton: false
      })
    } else {
      Swal
        .fire({
          text: "Publishing？",
          icon: "success",
          iconColor: "#e09a5f",
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
}
