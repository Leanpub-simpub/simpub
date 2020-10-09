import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "bubble" ];
  
  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    const wishBubble = this.bubbleTarget;
    const username = this.data.get("username");

    axios.get(`/u/${username}/wishlist.json`)
         .then(function(result) {
           let wishCount = result.data.length;
 
           if (wishCount !== 0) {
             wishBubble.classList.add("bubble");
             wishBubble.textContent = wishCount;
           } else {
             wishBubble.classList.remove("bubble");
           }
         })
         .then(function(error) {});
  }
}
