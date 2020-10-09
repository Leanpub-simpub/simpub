window.addEventListener("turbolinks:load", function () {
  if (document.querySelector(".book-box")) {
    const bookBox = document.querySelector(".book-box");

    bookBox.addEventListener("click", e => {
      let commentForm = document.querySelector(".comment-form");
      let classes = e.target.classList;
      
      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let bookKey = e.target.parentElement.dataset.key;
        let infoCoverBox = document.querySelector(".info-cover-box");
        let bookInfoTitle = document.querySelector(".book-info-title");
        let bookInfoAvatar = document.querySelector(".book-info-avatar");
        
        fetch(`/dash_board/library.json?id=${bookKey}`)
        .then((response) => response.json())
        .then(book => {
          if (bookInfoTitle.textContent == book.title) return;
          
            let cover = e.target.parentElement.firstElementChild;
            let infoCover = cover.cloneNode(true);
            let avatar = e.target.nextElementSibling;
            let avatarCover = avatar.cloneNode(true);
            avatarCover.classList.remove("x");

            infoCoverBox.innerHTML = "";
            infoCoverBox.appendChild(infoCover);

            bookInfoAvatar.innerHTML = "";
            bookInfoAvatar.appendChild(avatarCover);

            document.querySelector(".book-info-title").textContent = book.title;
            document.querySelector(".name").textContent = book.authors[0].name;
            document.querySelector(".name").image = book.authors[0].avatar_data;
            document.querySelector(".Leanpub").href = `/books/${book.slug}/read`;
        });
  
        commentForm.addEventListener("submit", () => {
          commentForm.action = `/dash_board/library?id=${bookKey}`
        });
      };
    });
  };
});
 