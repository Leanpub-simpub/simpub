import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "title", "error_msg" ];

  connect() {
    let error = this.data.get("error")
    error = error.slice(2, -2)
    if (error == "") return;
    this.error_msgTarget.textContent = error;
    this.titleTarget.classList.add("border", "border-danger", "rounded");
    // this.titleTarget.classList.add("border-danger");
    // console.log(this.titleTarget.value);
    
    // let username = this.data.get("user");
    // let followBtn = document.querySelector(".follow-btn");

    // const token = document.querySelector("meta[name=csrf-token]").content;
    // axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    // axios.post(`/u/${username}.json`)
    //      .then(function(result) {
    //        if (result.data["status"] === true) {
    //          followBtn.textContent = "Following";
    //        } else {
    //         followBtn.textContent = "Follow";
    //        }
    //      })
    //      .catch(function(error) {
    //        console.log(error);
    //      });
  }

  input() {
  }
  
  create() {
  }
}
