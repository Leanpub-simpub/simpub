document.addEventListener("turbolinks:load", () => {
  // 編輯書籍資料 封面預覽
  if (document.querySelector("#cover-input")) {
    const coverImage = document.querySelector("#cover-preview")
      .firstElementChild;
    const coverInput = document.querySelector("#cover-input");

    coverInput.addEventListener("change", (e) => {
      coverImage.src = URL.createObjectURL(e.target.files[0]);
    });
  }
});
