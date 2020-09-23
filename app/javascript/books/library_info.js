window.addEventListener("turbolinks:load", function () {
  if (document.querySelector("section.library")) {
    const bookInfo = document.querySelector("section.library")
      .firstElementChild;
    bookInfo.addEventListener("click", (e) => {
      if (!e.target.classList.contains("cover-link")) {
        return;
      }

      // TODO
      e.target.appendChild();
    });
  }

  // document.querySelectorAll(".cover").addEventListener("click", function () {
  //   console.log(1111);
  // });
});
