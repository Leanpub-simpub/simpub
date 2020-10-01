import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  delete() {
    if (window.confirm("Are you sure you want to remove this from your cart?")) {
    let itemIndex = this.data.get("index");

    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    axios.patch(`http://localhost:3000/cart/delete?index=${itemIndex}`)
         .then(function(result) {
          // 使用 axois 跳轉頁面
           location.href = "/cart";
         })
         .catch(function(error) {});
    }
  }
}