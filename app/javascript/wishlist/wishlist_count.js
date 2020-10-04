document.addEventListener("turbolinks:load", () => {
  if(document.querySelector(".fa-heart")) {
    getWishlistItems();
  }
  
  if(document.querySelector(".add-to-wishlist")) {
    const addWishlist = document.querySelector(".add-to-wishlist");

    addWishlist.addEventListener("click", e => {
      if (e.target.classList.contains("add-to-wishlist")) {
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
          let wishlistCount = wishlistItems[0][1].length;
        
          wishlistBubble.classList.add("wishlist-bubble");
          wishlistBubble.textContent = wishlistCount;
        }
      });
  }
});
