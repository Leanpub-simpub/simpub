import { Controller } from "stimulus";
import axios from "axios";
import Swal from "sweetalert2";

export default class extends Controller {
  static targets = [ "name", "username", "email", "name_error", "username_error", "email_error", "form" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    const nameInput = this.nameTarget;
    const usernameInput = this.usernameTarget;
    const emailInput = this.emailTarget;
    const nameError = this.name_errorTarget;
    const usernameError = this.username_errorTarget;
    const emailError = this.email_errorTarget;
    const form = this.formTarget;

    if (document.querySelector("#error_explanation")) {
      const errors = document.querySelector("#error_explanation");

      if (errors.textContent.includes("Password confirmation doesn't match Password")) {
        Swal
          .fire({
            text: "Password confirmation doesn't match",
            icon: "warning",
            iconColor: "#f33",
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Got it!"
          });
      }
    }

    validate(nameInput, "name", nameError);
    validate(usernameInput, "username", usernameError);
    validate(emailInput, "email", emailError);

    function validate(input, column, error) {
      input.addEventListener("blur", () => {
        axios
          .get(`/users/sign_up.json`)
          .then(function(result) {
            if (result.data[`${column}`].includes(input.value)) {
              input.setAttribute("style", "border: 2px solid red; border-radius: .25em;");
              error.textContent = `${column[0].toUpperCase() + column.slice(1)} has already been taken`
            } else {
              input.removeAttribute("style");
              error.textContent = "";
            }
          })
          .catch(function(error) {});
      });
    }
  }
}
