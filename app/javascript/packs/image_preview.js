document.addEventListener("turbolinks:load", () => {
  // 個人資料編輯頁面 頭像預覽
  // if (document.querySelector("#avatar-input")) {
  //   const avatarImage = document.querySelector("#avatar-preview").firstElementChild;
  //   const avatarInput = document.querySelector("#avatar-input");
    
  //   avatarInput.addEventListener("change", (e) => {
  //     avatarImage.src = URL.createObjectURL(e.target.files[0]);
  //   });
  // }
  
  
  // 編輯書籍資料 封面預覽
  if (document.querySelector("#cover-input")) {
    const coverImage = document.querySelector("#cover-preview").firstElementChild;
    const coverInput = document.querySelector("#cover-input");

    coverInput.addEventListener("change", (e) => {
      coverImage.src = URL.createObjectURL(e.target.files[0])
    });
  }
});