document.addEventListener("turbolinks:load", () => {
  if (document.querySelector("#user-pay")) {
    const userPay = document.querySelector("#user-pay");
    const userPayShow = document.querySelector(".user-pay-show");
    const authorEarns = document.querySelector("#author-earns");
    const authorEarnsShow = document.querySelector(".author-earns-show");
    const cartPrice = document.querySelector(".cart-price");
    const addCartForm = document.querySelector(".add-cart-form");

    // 設定初始化價格
    setPricePay();

    // "User Pay" slider 拖動時呼叫
    userPay.addEventListener("input", () => {
      setPricePay();
    });
    
    // "Author Earns"" slider 拖動時呼叫
    authorEarns.addEventListener("input", () => {
      setPriceEarns();
    });

    // 使用者自行在 input 輸入時呼叫
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

    // 按下加入購物車按鈕後顯示動畫
    addCartForm.onsubmit = bookToCart.bind(addCartForm);
    function bookToCart() {
      const cart = document.querySelector(".fa-shopping-cart");
      const cover = document.querySelector(".cover-img");
      const coverBubble = cover.cloneNode(true);

      let startW = cover.getBoundingClientRect().width;
      let startH = cover.getBoundingClientRect().height;
      let startX = startW / 2 + cover.getBoundingClientRect().x
      let startY = startH / 2 + cover.getBoundingClientRect().y;
      let endX = cart.getBoundingClientRect().x;
      let endY = cart.getBoundingClientRect().y;

      coverBubble.classList.add("cover-bubble");
      cover.parentElement.appendChild(coverBubble);

      gsap.to(".cover-bubble", {duration: 1, scale: .08, x: `${endX - startX}px`, y: `${endY - startY}px`, opacity: .5})

      // 動畫結束後刪除該物件
      setTimeout(() => {
        cover.parentElement.removeChild(coverBubble);
      }, 1000);
    }



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
});