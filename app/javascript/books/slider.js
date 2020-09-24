document.addEventListener("turbolinks:load", () => {
  if (document.querySelector("#user-pay")) {
    const userPay = document.querySelector("#user-pay");
    const userPayShow = document.querySelector(".user-pay-show");
    const authorEarns = document.querySelector("#author-earns");
    const authorEarnsShow = document.querySelector(".author-earns-show");
    const cartPrice = document.querySelector(".cart-price");
    const addCartForm = document.forms[1];

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
            setCartPrice(maxPrice.toFixed(2));
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

      coverBubble.classList.add("cover-bubble");
      cover.parentElement.appendChild(coverBubble);

      let endX = cart.offsetLeft;
      let endY = cart.offsetTop;
      
      
      // let startX = cover.offsetLeft;
      // let startY = cover.offsetTop;
      // coverBubble.style.transition = "left 0s, top 0s";
      // coverBubble.style.top = `${startY}px`;
      // coverBubble.style.left = `${startX}px`;
      
      
      setTimeout(() => {
        coverBubble.animate([
          // keyframes
          { transform: 'translate(0px)' }, 
          { transform: `translate(${endX}px,${endY}px)` }
        ], { 
          // timing options
          duration: 2000,
          fill: "forwards"
          // iterations: Infinity
        });
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