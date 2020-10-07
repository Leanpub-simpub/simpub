import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
  }

  
  edit() {
    // 禁止視窗捲動
    document.documentElement.style.overflow = "hidden";
    const modal = document.querySelector(".cart-modal");
    modal.classList.remove("x");
    
    // let cartItems = document.querySelector("#cart-items");
    // cartItems.addEventListener("click", e => {
    //   if (!e.target.classList.contains("item-edit")) { return; }
    //   let itemIndex = e.target.dataset.index;
    //   let updateForm = document.querySelector(".update-price-form");

    //   updateForm.onsubmit = updateItem.bind(updateForm)
    //   function updateItem() {
    //     let updatePrice = document.querySelector(".cart-price").value;
        
    //     axios.patch(`/cart?index=${itemIndex}&price=${updatePrice}`)
    //          .then(function(result) {
    //          // 使用 axois 跳轉頁面
    //            location.href = "/cart";
    //          })
    //          .catch(function(error) {});
    //   }
    // });
  }


  delete() {
    if (window.confirm("Are you sure you want to remove this from your cart?")) {
    let itemIndex = this.data.get("index");
    
    axios.patch(`/cart/delete?index=${itemIndex}`)
         .then(function(result) {
          // 使用 axois 跳轉頁面
           location.href = "/cart";
         })
         .catch(function(error) {});
    }
  }
}