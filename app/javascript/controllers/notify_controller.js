import { Controller } from "stimulus";
import axios from "axios";


export default class extends Controller {
  static targets = [ "menu", "bubble" ];
  
  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    const menu = this.menuTarget;
    const menuItems = this.menuTarget.childElementCount;
    const notifyBubble = this.bubbleTarget;

    axios.get("/notifications.json")
         .then(function(result) {
           let notifyCount = result.data.length;

           // 加入判斷避免重複 render
           if (notifyCount === 0) { 
            notifyBubble.classList.remove("bubble");
             return;
           }
           notifyBubble.classList.add("bubble")
           notifyBubble.textContent = notifyCount;
           
           if (notifyCount === menuItems) return;
           result.data.map(({actor, action, url}) => {
             let anchor = document.createElement("a");
             anchor.href = url;
             anchor.classList.add("dropdown-item");
             anchor.textContent = `${actor} ${action} you`;

             menu.appendChild(anchor)
           });
         })
         .then(function(error) {});
  }
  
  show() {
    const notifyBubble = this.bubbleTarget;
    
    axios.post("/notifications/mark_as_read.json")
         .then(function(result) {
           notifyBubble.classList.remove("bubble");
         })
         .then(function(error) {})
  }
}
