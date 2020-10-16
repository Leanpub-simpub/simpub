import { Controller } from "stimulus";
import axios from "axios";
import Swal from "sweetalert2";

export default class extends Controller {
  static targets = [ "name", "username", "email", "password", "passconfirm", "name_error", "username_error", "email_error", "password_error", "confirm_error" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    const nameInput = this.nameTarget;
    const nameError = this.name_errorTarget;
    const usernameInput = this.usernameTarget;
    const usernameError = this.username_errorTarget;
    const emailInput = this.emailTarget;
    const emailError = this.email_errorTarget;
    const passwordInput = this.passwordTarget;
    const passwordError = this.password_errorTarget;
    const confirmInput = this.passconfirmTarget;
    const confirmError = this.confirm_errorTarget;

    validate(nameInput, "name", nameError);
    validate(usernameInput, "username", usernameError);
    validate(emailInput, "email", emailError);
    validate(passwordInput, "password", passwordError)
    validate(confirmInput, "confirm", confirmError)

    if (document.querySelector("#error_explanation")) {
      const errors = document.querySelector("#error_explanation");
      console.log(errors.textContent);

      if (errors.textContent.includes("Password confirmation doesn't match Password")) {
        Swal
          .fire({
            text: "Password confirmation doesn't match",
            icon: "error",
            iconColor: "#f33",
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Got it!"
          });
      }
      if (errors.textContent.includes("Email is invalid")) {
        Swal
          .fire({
            text: "Email is invalid",
            icon: "error",
            iconColor: "#f33",
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Got it!"
          });
      }
    }

    function validate(input, column, error) {
      input.addEventListener("blur", () => {
        if (input.value === "") {
          input.setAttribute("style", "border: 2px solid red; border-radius: .25em;");
          error.textContent = `${column[0].toUpperCase() + column.slice(1)} can't be blank`
        } else {
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
        }
      });
    }
  }
}
