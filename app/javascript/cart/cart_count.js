document.addEventListener("turbolinks:load", () => {
  if(document.querySelector(".fa-shopping-cart")) {
    getCartItems();
  }
  
  if(document.querySelector(".add-to-cart-btn")) {
    const addCartBtn = document.querySelector(".add-to-cart-btn");

    addCartBtn.addEventListener("click", e => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        // 加入 setTimeout 避免後端資料還沒寫入，前端就先去抓資料
        setTimeout(() => { getCartItems(); }, 1000);
      }
    })
  }

  function getCartItems() {
    fetch("/cart.json")
      .then(response => response.json())
      .then(cartItems => {
        let cartBubble = document.querySelector(".fa-shopping-cart").firstElementChild;

        if (cartItems[0] && cartItems[0][1].length !== 0) {
          let cartCount = cartItems[0][1].length;
          
          cartBubble.classList.add("bubble");
          cartBubble.textContent = cartCount;
        } else {
          cartBubble.classList.remove("bubble");
        }
      });
  }
});
