import { Controller } from "stimulus";
import axios from "axios";
import $ from "jquery";

export default class extends Controller {
  static targets = [ "bubble", "box" ];
  
  connect() {
    if (!document.querySelector(".fa-bell")) return;
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    const box = this.boxTarget;
    const boxItems = this.boxTarget.childElementCount;
    const notifyBubble = this.bubbleTarget;

    axios
      .get("/notifications.json")
      .then(function(result) {
        let notifyCount = result.data.length;
  
        // 加入判斷避免重複 render
        if (notifyCount === 0) { 
          notifyBubble.classList.remove("bubble");
          return;
        }
        notifyBubble.classList.add("bubble")
        notifyBubble.textContent = notifyCount;
        
        if (notifyCount === boxItems) return;
  
        result.data.map(({actor, action, notifiable}) => {
          let anchorBox = document.createElement("div");
          let anchor = document.createElement("a");
          anchorBox.classList.add("px-3", "py-2", "border-bottom", "text-center")
          anchorBox.appendChild(anchor)
          
        //  anchor.classList.add("border-bottom");
            
        if (action == "starts following") {
        anchor.href = "/dash_board/followship";
            anchor.textContent = `${actor} ${action} you`;
          } else {
            anchor.href = `/books/${notifiable.slug}`;
            anchor.textContent = `${actor} ${action} "${notifiable.title}"`;
          }

          box.appendChild(anchorBox)
        });
      })
      .then(function(error) {});
  }
  
  show() {
    const notifyBubble = this.bubbleTarget;
    const box = this.boxTarget;
    $("#notify-box").slideToggle();
  }

  mark_read() {
    const notifyBubble = this.bubbleTarget;
    const box = this.boxTarget;
    
    axios
      .post("/notifications/mark_as_read.json")
      .then(function(result) {
        notifyBubble.classList.remove("bubble");
        box.innerHTML = "";
      })
      .then(function(error) {})
  }
}
