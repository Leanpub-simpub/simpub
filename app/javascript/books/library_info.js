window.addEventListener("turbolinks:load", function () {
  if (document.querySelector("section.library")) {
    const bookInfo = document.querySelector("section.library").firstElementChild;

    bookInfo.addEventListener("click", e => {
      let classes = e.target.classList;
      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let bookKey = e.target.parentElement.dataset.key;

        fetch(`http://localhost:3000/dash_board/library.json?id=${bookKey}`)
        .then((response) => response.json())
        .then(book => {
          document.querySelector("book-about");

        });
      };
    });
  };
});
 