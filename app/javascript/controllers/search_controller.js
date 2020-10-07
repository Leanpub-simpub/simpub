import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [ "select", "book_search", "author_search", "tag_search" ];

  connect() {
    const bookSearch = this.book_searchTarget;
    const authorSearch = this.author_searchTarget;
    const tagSearch = this.tag_searchTarget;
    let select = this.selectTarget.value;

    switchForm(select);

    this.selectTarget.addEventListener("change", () => {
      select = this.selectTarget.value;
      switchForm(select);
    });

    function switchForm(select) {
      switch (select) {
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
          bookSearch.classList.remove("d-flex");
          authorSearch.classList.remove("d-flex");
          tagSearch.classList.add("d-flex");
          break;
      }
    }
  }
}


