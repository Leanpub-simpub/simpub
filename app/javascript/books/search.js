document.addEventListener("turbolinks:load", () => {
  // navSearch
  // if (document.querySelector(".layout-navbar")) {
  //   const navSearch = document.querySelector(".nav-search");
  //   const searchBtn = document.querySelector(".search-btn");
  //   const bookContainer = document.querySelector(".book-index");
    
  //   navSearch.addEventListener("submit", e => {
  //     e.preventDefault();

  //     let searchInput = document.querySelector(".search-input").value;
  //     console.log(searchInput);

  //     fetch(`http://localhost:3000/books/search.json?search=${searchInput}`)
  //       .then(response => response.json())
  //       .then(books => {
  //         console.log(books);
  //         bookContainer.innerHTML = "";
  //       });
      
  //   });
  // }



  // book 頁面 search
  if (document.querySelector(".book-search")) {
    const searchInput = document.querySelector(".book-search");
    const bookContainer = document.querySelector(".books-show");

    searchInput.addEventListener("submit", e => {
      e.preventDefault();

      let searchContain = document.querySelector(".book-search-input").value;

      fetch(`http://localhost:3000/books/search.json?search=${searchContain}`)
        .then(response => response.json())
        .then(books => {
          bookContainer.innerHTML = "";
          render(books);
        });


    })



    function render(books) {
      const template = document.querySelector("template");
      const cover = template.content.querySelector(".cover");
      const coverLink = template.content.querySelector(".cover a");
      const coverImg = template.content.querySelector(".cover img");
      const bookTitle = template.content.querySelector(".book-title");
      const bookAuthor = template.content.querySelector(".book-author");

      books.forEach(item => {
        cover.firstElementChild.href = `/books/${item.id}`;
        coverLink.href = `/books/${item.id}`;
        bookTitle.href = `/books/${item.id}`;
        bookTitle.textContent = item.title;
        bookAuthor.href = `/u/${item.authors[0].username}`;
        bookAuthor.textContent = item.authors[0].username;

        if (item.cover_data) {
          coverImg.src = "";
        } else {
          coverImg.src = "/packs/media/images/open_book_cover-7d324d933e85b83039f1ebef0ba874e9.jpeg";
        }

        let clone = document.importNode(template.content, true);
        bookContainer.appendChild(clone);
      });

      document.querySelector("nav.pagination").innerHTML = "";
    }
  }
});