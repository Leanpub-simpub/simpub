window.addEventListener("turbolinks:load", function () {
  if (document.querySelector("section.library")) {
    const bookInfo = document.querySelector("section.library")
      .firstElementChild;

    bookInfo.addEventListener("click", (e) => {
      if (e.target.classList.contains("book-cover")) {
        console.log(e.target);
      }
      // if (!e.target.classList.contains("cover-link")) {
      //   return;
      // }
      // document.querySelectorAll(".cover-link");
      console.log(e.target.dataset.key);
      // console.log(cover - link[0].dataset.link);

      // TODO
    });
  }

  // document.querySelectorAll(".cover").addEventListener("click", function () {
  //   console.log(1111);
  // });
});
