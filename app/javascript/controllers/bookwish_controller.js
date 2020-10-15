import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  add() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    let id = this.data.get("id");
    axios
      .post(`/books/${id}/wish`)
      .then(function(result) { 
        location.href = result.data.redirect;
      })
      .then(function(error) {})
  }

}
