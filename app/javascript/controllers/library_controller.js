import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "bookBox" ];

  connect() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    const libInfoBox = document.querySelector(".library-info");
    const bookBox = this.bookBoxTarget;
    bookBox.addEventListener("click", e => {
      let classes = e.target.classList;
      
      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let BookId = e.target.parentElement.dataset.bookid;
        let cover = e.target.parentElement.firstElementChild;
        let infoCover = cover.cloneNode(true);
        let avatar = e.target.nextElementSibling;
        let avatarCover = avatar.cloneNode(true);
        avatarCover.classList.remove("x");
        
        axios
          .get(`/dash_board/library.json?bookid=${BookId}`)
          .then(function(result) {
            let infoCoverBox = document.querySelector(".info-cover-box");
            let completeness = document.querySelector("#completeness");
            let time = document.querySelector("#time");
            let bookInfoTitle = document.querySelector(".book-info-title");
            let bookInfoAvatar = document.querySelector(".book-info-avatar");
            let bookInfoAuthor = document.querySelector(".book-show-author-name");
            let bookInfoAbout = document.querySelector(".about");
            let bookInfoRating = document.querySelector(".rating");
            
            infoCoverBox.innerHTML = "";
            infoCoverBox.appendChild(infoCover);
            bookInfoAvatar.innerHTML = "";
            bookInfoAvatar.appendChild(avatarCover);

            completeness.textContent = result.data.book_info.completeness;
            time.textContent = result.data.book_info.updated_at.slice(0, 10);
            bookInfoTitle.textContent = result.data.book_info.title;
            bookInfoAuthor.textContent = result.data.book_info.authors[0].name;

            if (result.data.book_info.about && result.data.book_info.about !== "") {
              bookInfoAbout.textContent = result.data.book_info.about;
            }

            if (result.data.stars) {
              bookInfoRating.innerHTML = "";
              
              for (let i = 0; i < result.data.stars; i++) {
                let fasStar = document.createElement("span");
                fasStar.innerHTML = `<i class="fas fa-star fa-2x"></i>`
                bookInfoRating.appendChild(fasStar);
              }
              for (let i = result.data.stars; i < 5; i++) {
                let farStar = document.createElement("span");
                farStar.innerHTML = `<i class="far fa-star fa-2x"></i>`
                bookInfoRating.appendChild(farStar);
              }
            } else {
              bookInfoRating.innerHTML = 
                `<i class="far fa-star fa-2x"></i>
                 <i class="far fa-star fa-2x"></i>
                 <i class="far fa-star fa-2x"></i>
                 <i class="far fa-star fa-2x"></i>
                 <i class="far fa-star fa-2x"></i>`;
            }

            setTimeout(() => {
              if (libInfoBox.firstElementChild.classList.contains("show")) {
                window.scrollTo(0,document.body.scrollHeight);
              }
            }, 500);
        })
      }
    });
  }
}
