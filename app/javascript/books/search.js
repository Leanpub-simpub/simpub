document.addEventListener("turbolinks:load", () => {
  if (document.querySelector("#search-selector")) {
    const selector = document.querySelector("#search-selector");
    const bookSearch = document.querySelector(".book-search");
    const authorSearch = document.querySelector(".author-search");
    const tagSearch = document.querySelector(".tag-search");

    selector.addEventListener("change", () => {
      switch (selector.value) {
        case "book-search":
          authorSearch.classList.remove("d-flex");
          tagSearch.classList.remove("d-flex");
          bookSearch.classList.add("d-flex");
          break;
        case "author-search":
          bookSearch.classList.remove("d-flex");
          tagSearch.classList.remove("d-flex");
          authorSearch.classList.add("d-flex");
          break;
        case "tag-search":
          tagSearch.classList.add("d-flex");
          bookSearch.classList.remove("d-flex");
          authorSearch.classList.remove("d-flex");
          break;
      }
    });
  }
});