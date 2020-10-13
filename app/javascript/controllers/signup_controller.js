import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "name", "username", "email", "name_error", "username_error", "email_error" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    const nameInput = this.nameTarget;
    const usernameInput = this.usernameTarget;
    const emailInput = this.emailTarget;
    const nameError = this.name_errorTarget;
    const usernameError = this.username_errorTarget;
    const emailError = this.email_errorTarget;

    validate(nameInput, "name", nameError)
    validate(usernameInput, "username", usernameError)
    validate(emailInput, "email", emailError)

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
