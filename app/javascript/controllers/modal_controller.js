import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [ "body" ];

  connect() {
    // 使用 esc 鍵關閉 modal
    const body = this.bodyTarget;
    
    document.addEventListener("keydown", function(event) {
      if(event.keyCode === 27){
        body.classList.add("x");
      }
    });
  }
  
  close() {
    // 開啟視窗捲動
    document.documentElement.style.overflow = "auto";
    const body = this.bodyTarget;
    body.classList.add("x");
  }
}