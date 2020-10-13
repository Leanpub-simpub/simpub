import $ from "jquery";

document.addEventListener("turbolinks:load", () => {
  if( document.querySelector(".carousel-item")){
    let firstItem = document.querySelector(".carousel-item");
    firstItem.classList.add("active");

    // Multi Item Carousel Advance
    $('.carousel.carousel-multi-item.v-2 .carousel-item').each(function(){
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));

      // for (var i = 0; i < 4; i++) {
      //   next=next.next();
      //   if (!next.length) {
      //     next=$(this).siblings(':first');
      //   }
      //   next.children(':first-child').clone().appendTo($(this));
      // }
    });
  }
});

