import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "follow" ];

  followship() {
    let username = this.data.get("user");
    let followBtn = document.querySelector(".follow-btn");

    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    axios.post(`/u/${username}.json`)
         .then(function(result) {
           if (result.data["status"] === true) {
             followBtn.textContent = "Following";
           } else {
             followBtn.textContent = "Follow";
           }
         })
         .catch(function(error) {
           
         });
  }
}
