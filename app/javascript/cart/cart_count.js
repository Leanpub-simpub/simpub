document.addEventListener("turbolinks:load", () => {
  if (document.querySelector(".fa-shopping-cart")) {
    getCartItems();
  }

  if (document.querySelector(".add-to-cart-btn")) {
    const addCartBtn = document.querySelectorAll(".add-to-cart-btn");

    addCartBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart-btn")) {
          // 加入 setTimeout 避免後端資料還沒寫入，前端就先去抓資料
          setTimeout(() => {
            getCartItems();
          }, 1000);
        }
      });
    });
  }

  function getCartItems() {
    fetch("/cart.json")
      .then((response) => response.json())
      .then((cartItems) => {
        let cartBubbles = document.querySelectorAll(".fa-shopping-cart");

        cartBubbles.forEach(cartBubble => {
          if (cartItems.cart.items.length !== 0) {
            let cartCount = cartItems.cart.items.length;
            
            cartBubble.firstElementChild.classList.remove("x");
            cartBubble.firstElementChild.classList.add("bubble");
            cartBubble.firstElementChild.textContent = cartCount;
          } else {
            cartBubble.firstElementChild.classList.remove("bubble");
            cartBubble.firstElementChild.classList.add("x");
          }
        })
      });
  }
});
