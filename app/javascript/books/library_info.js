window.addEventListener("turbolinks:load", function () {
  if (document.querySelector("section.library")) {
    const bookInfo = document.querySelector("section.library").firstElementChild;

    bookInfo.addEventListener("click", e => {
      let classes = e.target.classList;
      
      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let bookKey = e.target.parentElement.dataset.key;
        let infoCoverBox = document.querySelector(".info-cover-box");

        if (!infoCoverBox.firstElementChild) {
          let cover = e.target.parentElement.firstElementChild;
          let infoCover = cover.cloneNode(true);
          infoCoverBox.appendChild(infoCover);
        }

        fetch(`/dash_board/library.json?id=${bookKey}`)
        .then((response) => response.json())
        .then(book => {
          document.querySelector(".book-info-title").textContent = book.title
          document.querySelector(".name").textContent = book.authors[0].name
          document.querySelector(".name").image = book.authors[0].avatar_data
          document.querySelector(".Leanpub").href = `/books/${book.id}/read`

        });
      };
    });
  };
});
 