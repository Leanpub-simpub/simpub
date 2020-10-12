import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "body", "price" ];

  connect() {
    // 使用 esc 鍵關閉 modal
    const body = this.bodyTarget;
    
    document.addEventListener("keydown", function(event) {
      if(event.keyCode === 27){
        body.classList.add("x");
        document.documentElement.style.overflow = "auto";
      }
    });
  }
  
  close() {
    // 開啟視窗捲動
    document.documentElement.style.overflow = "auto";
    const body = this.bodyTarget;
    body.classList.add("x");
  }

  update() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    const index = this.data.get("index");
    const price = this.priceTarget.value;

    axios.patch(`/cart?index=${index}&price=${price}`)
         .then(function(result) {
           location.href = "/cart";
         })
         .then(function(error) {})
  }
}