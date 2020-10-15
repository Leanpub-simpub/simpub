import Swal from "sweetalert2";
import axios from "axios";

document.addEventListener("turbolinks:load", () => {
  const token = document.querySelector("meta[name=csrf-token]").content;
  axios.defaults.headers.common["X-CSRF-Token"] = token;
  
  if (document.querySelector(".author-books")) {
    const booksContrainer = document.querySelector(".author-books");
    const flash = document.querySelector(".flash");

    booksContrainer.addEventListener("click", e => {
      if (e.target.classList.contains("on-shelf")) {
        Swal
          .fire({
            text: "Would you like to publish this book?",
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
        } else if (e.target.classList.contains("off-shelf")) {
          Swal
            .fire({
              text: "Would you like to unpublish this book?",
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
                    location.href = result.data.redirect;
                  });
              }
            });
        }
    });
  }
});