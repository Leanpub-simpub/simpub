import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "cover" ];

  cart() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    // 禁止視窗捲動
    document.documentElement.style.overflow = "hidden";
    const modal = document.querySelector(".cart-modal");
    modal.classList.remove("x");

    // 隱藏更新價格的按鈕
    const update = document.querySelector(".update-price");
    update.classList.add("x");

    // 建立 modal cover
    const itemCover = this.coverTarget.firstElementChild;
    const modalCover = itemCover.cloneNode(true);
    const modalCoverBox = document.querySelector(".modal-body-img");
    modalCoverBox.innerHTML = "";
    modalCoverBox.appendChild(modalCover);

    // 建立 modal 書籍資訊
    const title = document.querySelector(".modal-body-title");
    const author = document.querySelector(".modal-body-author");
    const min = document.querySelector(".modal-min");
    const max = document.querySelector(".modal-max");
    const userPay = document.querySelector("#modal-user-pay");
    const authorEarns = document.querySelector("#moadl-author-earns");
    const userPayShow = document.querySelector(".modal-user-pay-show");
    const authorEarnsShow = document.querySelector(".modal-author-earns-show");
    const cartPrice = document.querySelector(".cart-price");
    const addCartForm = document.querySelector(".add-cart-form-modal");
    
    const username = this.data.get("username");
    const bookId = this.data.get("book");
    axios.get(`/cart/edit.json?id=${bookId}`)
         .then(function(result) {
           const bookInfo = result.data;
           title.textContent = bookInfo.title;
           author.textContent = bookInfo.author;
           min.textContent = `$${bookInfo.price}`;
           max.textContent = `$${bookInfo.price * 2}`;
           userPay.min = `${bookInfo.price}`;
           userPay.max = `${bookInfo.price * 3}`;
           userPay.value = `${bookInfo.price * 2}`;
           authorEarns.min = `${bookInfo.price * 0.8}`;
           authorEarns.max = `${bookInfo.price * 4}`;

           // 設定初始化價格
           setPricePay();
         })
         .then(function(error) {});

    // "User Pay" slider 拖動時呼叫
    userPay.addEventListener("input", () => {
      setPricePay();
    });

    // "Author Earns"" slider 拖動時呼叫
    authorEarns.addEventListener("input", () => {
      setPriceEarns();
    });

    cartPrice.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        // 驗證輸入框的輸入格式為 數字 或 $ 開頭
        let regex = /^\$?[0-9]+\.?[0-9]{0,2}$/;
        let minPrice = parseFloat(userPay.min);
        let maxPrice = parseFloat(userPay.max);
        let inputPrice;

        if (regex.test(cartPrice.value)) {
          // 如果使用者有自行輸入 $ 符號，則去掉
          if (cartPrice.value.charAt(0) === "$") {
            inputPrice = cartPrice.value.slice(1);
            inputPrice = parseFloat(inputPrice);
          } else {
            inputPrice = parseFloat(cartPrice.value);
          }

          if (inputPrice < minPrice) {
            setCartPrice(minPrice.toFixed(2));
          } else if (inputPrice > maxPrice) {
            setCartPrice(100.00.toFixed(2));
          } else {
            setCartPrice(inputPrice.toFixed(2));
          }
        } else {
          setCartPrice(minPrice.toFixed(2));
        }
      }
    });

    // ! 不知道為什麼會打兩次 delete
    addCartForm.addEventListener("submit", () => {
      addCartForm.action = `/cart/add/${bookId}?cart_price=${cartPrice.value}`;
      
      setTimeout(() => {
        location.href = "/cart";
        axios.delete(`/u/${username}/wishlist?id=${bookId}`)
             .then(function(reuslt) {})
             .then(function(result) {});
      }, 500);
    });


    function setPricePay() {
      let userPayDrag = parseFloat(userPay.value).toFixed(2);
      let authorEarnsDrag = (userPayDrag * 0.8).toFixed(2);
    
      userPayShow.textContent = `$${userPayDrag}`;
      cartPrice.value = `$${userPayDrag}`;
    
      authorEarnsShow.textContent = `$${authorEarnsDrag}`;
      authorEarns.value = authorEarnsDrag;
    }

    function setPriceEarns() {
      let authorEarnsDrag = parseFloat(authorEarns.value).toFixed(2);
      let userPayDrag = (authorEarnsDrag * 1.25).toFixed(2);

      authorEarnsShow.textContent = `$${authorEarnsDrag}`;
      cartPrice.value = `$${userPayDrag}`;

      userPayShow.textContent = `$${userPayDrag}`;
      userPay.value = userPayDrag;
    }

    function setCartPrice(price) {
      cartPrice.value = `$${price}`;

      userPay.value = price;
      userPayShow.textContent = `$${price}`;

      authorEarns.value = price * 0.8;
      authorEarnsShow.textContent = `$${(price * 0.8).toFixed(2)}`;
    }
  }

}
