import Swal from "sweetalert2";
import axios from "axios";

document.addEventListener("turbolinks:load", () => {
  const token = document.querySelector("meta[name=csrf-token]").content;
  axios.defaults.headers.common["X-CSRF-Token"] = token;
  
  if (document.querySelector(".author-books")) {
    const booksContrainer = document.querySelector(".author-books");
    const flash = document.querySelector(".flash");

    booksContrainer.addEventListener("click", e => {
      if (e.target.textContent.includes("發佈")) {
        Swal
          .fire({
            text: "確定發佈嗎？",
            icon: "warning",
            iconColor: "#f33",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#e09a5f"
          })
          .then(result => {
            if (result.value) {
              location.href = `/books/${e.target.dataset.bookid}/pricing`;
            }
          });
        } else if (e.target.textContent.includes("下架")) {Swal
          .fire({
            text: "確定下架嗎？",
            icon: "warning",
            iconColor: "#f33",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#e09a5f"
          })
          .then(result => {
            if (result.value) {
              axios
                .patch(`/books/${e.target.dataset.bookid}/unpublish`)
                .then(function(result) {
                  location.reload();
                  // flash.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                  // 書籍已下架
                  // <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  // <span aria-hidden="true">&times;</span>
                  // </button>
                  // </div>`
                });
            }
          });
      }
    });
  }
});