document.addEventListener("turbolinks:load", () => {
  if(document.querySelector(".fa-heart")) {
    getWishlistItems();
  }
  
  if(document.querySelector(".add-to-wishlist")) {
    const addWishlist = document.querySelector(".add-to-wishlist");

    addWishlist.addEventListener("click", e => {
      if (e.target.classList.contains("add-to-wishlist")) {
        // 加入 setTimeout 避免後端資料還沒寫入，前端就先去抓資料
        setTimeout(() => { getWishlistItems(); }, 1000);
      }
    })
  }

  function getWishlistItems() {
    fetch("http://localhost:3000/wishlist.json")
      .then(response => response.json())
      .then(wishlistItems => {
        let wishlistBubble = document.querySelector(".fa-heart").firstElementChild;

        if (wishlistItems.length !== 0) {
          let wishlistCount = wishlistItems[0][1].reduce((sum, item) => {
            return sum += item.quantity;
          }, 0).toString();
        
          wishlistBubble.classList.add("wishlist-bubble");
          wishlistBubble.textContent = wishlistCount;
        }
      });
  }
});
