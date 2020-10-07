import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  add() {
    let id = this.data.get("id");
    axios.post(`/books/${id}/wish`)
         .then(function(result) { location.reload(); })
         .then(function(error) {})
  }

}
