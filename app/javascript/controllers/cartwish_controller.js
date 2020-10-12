import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  add() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    // 將書籍移動到願望清單
    const id = this.data.get("id");
    axios.post(`/books/${id}/wish`)
         .then(function(result) {})
         .then(function(error) {})

    // 從購物車當中刪除
    const itemIndex = this.data.get("index");
    axios.patch(`/cart/delete?index=${itemIndex}`)
        .then(function(result) { location.reload(); })
        .catch(function(error) {});
  }

}
