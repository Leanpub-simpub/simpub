window.addEventListener("turbolinks:load", function () {
  if (document.querySelector(".book-box")) {
    const bookBox = document.querySelector(".book-box");
    
    bookBox.addEventListener("click", e => {
      let classes = e.target.classList;

      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let BookId = e.target.parentElement.dataset.bookid;
        let commentForm = document.querySelector(".comment-form");

        commentForm.addEventListener("submit", () => {
          commentForm.action = `/dash_board/library?id=${BookId}`;
        });
        
        $(".rating-star")
          .on("click", function(e) {
            rating = $(e.target).data("rating");
            setRating(rating);
          })
          .on("keyup", function(e) {
            if (e.keyCode === 32) {
              rating = $(e.target).data("rating");
              setRating(rating);
            }
          });

        function setRating(rating) {
          $("#rating-input").val(rating);
          $(".rating-star").removeClass("far").addClass("fas");
          $(`.rating-star#rating-${rating} ~ .rating-star`)
            .removeClass("fas")
            .addClass("far");
        }    
      }
    });
  }
});
