window.addEventListener("turbolinks:load", function () {
  if (document.querySelector(".book-box")) {
    const bookBox = document.querySelector(".book-box");

    bookBox.addEventListener("click", e => {
      let classes = e.target.classList;
      
      if (classes.contains("book-cover") || classes.contains("book-title")) {
        let bookKey = e.target.parentElement.dataset.key;
        let infoCoverBox = document.querySelector(".info-cover-box");
        let bookInfoTitle = document.querySelector(".book-info-title");
        let bookInfoAvatar = document.querySelector(".book-info-avatar");
        
        let uploadPDFatCreate = e.target.parentElement.parentElement.parentElement.querySelector('.uploadWholeBook')
        let readonline = document.querySelector('.Leanpub')
        
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


            // 搭配 library show.html.erb 如果使用者一開始就上傳整本書的 PDF 就隱藏線上閱讀連結，把href拔掉
            if(uploadPDFatCreate){
              readonline.classList.add('x')
              readonline.removeAttribute("href")
            }else{
              readonline.classList.remove('x')
              readonline.setAttribute("href",`/books/${book.slug}/read`)
            }

        });
      };
    });
  };
});
 