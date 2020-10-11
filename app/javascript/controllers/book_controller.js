import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "title", "error_msg", "cover", "pdf" ];

  connect() {
    // 檢查書籍的狀態使否為草稿，非草稿狀態不能改 title
    let publishState = this.data.get("state");
    if (publishState != "draft") {
      this.titleTarget.disabled = true;
    }
  }

  upload_cover() {
    const coverInput = this.coverTarget;
    coverInput.click();
  }

  upload_pdf() {
    const pdfInput = this.pdfTarget;
    pdfInput.click();
  }

  input() {
    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;

    // title 欄位 unfocus 後檢查該 titlte 是否已經被使用
    this.titleTarget.addEventListener("blur", () => {
      let bookTittle = this.data.get("title");
      let title = this.titleTarget.value;
      let titleInput = this.titleTarget;
      let titleError = this.error_msgTarget;
      
      axios.get(`/books/new.json`)
           .then(function(result) {
            if (bookTittle != title && result.data.includes(title)) {
              titleInput.setAttribute("style", "border: 2px solid red; border-radius: 025em;");
              titleError.textContent = "Title has already been taken";
            } else {
              titleInput.removeAttribute("style");
              titleError.textContent = "";
            }
          })
          .catch(function(error) {});
    });
  }
}
