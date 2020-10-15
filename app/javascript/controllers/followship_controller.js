import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    window.addEventListener("click", e => {
      if (e.target.classList.contains("follow-btn")) {
        let followBtn = e.target;
        let username = followBtn.dataset.username;

        axios
          .post(`/u/${username}.json`)
          .then(function(result) {
            if (result.data["status"] === true) {
              followBtn.textContent = "Following";
            } else {
              followBtn.textContent = "Follow";
            }
          })
          .catch(function(error) {});
      }
    });
  }
}
