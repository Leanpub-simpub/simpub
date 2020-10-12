import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "body", "price", "update_form", "cart_wait", "update_btn" ];

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

    // 往後端送更新的價格
    const index = this.data.get("index");
    const price = this.priceTarget.value;
    const updateForm = this.update_formTarget;
    updateForm.action = `/cart?index=${index}&price=${price}`;

    // 前端關閉跳窗並替換掉價格
    const body = this.bodyTarget;
    const updateBtn = this.update_btnTarget;
    const updateWaitBtn = this.cart_waitTarget;
    updateBtn.classList.add("x");
    updateWaitBtn.classList.remove("x");

    setTimeout(() => {
      body.classList.add("x");
      document.documentElement.style.overflow = "auto";
  
      const total = document.querySelector(".cart-total");
      const item = document.querySelector("tbody").children[index];
      item.lastElementChild.textContent = `${price}`;

      axios.get(`/cart.json`)
        .then(function(result) {
          total.textContent = `$${result.data.total.toFixed(2)}`;
        })
        .catch(function(error) {});
    }, 1000);
  }
}