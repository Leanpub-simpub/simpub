import { Controller } from "stimulus";
import $ from "jquery";
// import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  connect() {
    // 拿到目前書籍的 tag_items
    let list = this.data.get("list").slice(1, -1).replace(/\"/g, "").split(", ");

    // 把 select2 的 tagging 功能打開
    $(".select").select2({ tags: true });

    // 相對應的 option 設定成已選擇
    list.map(item => {
      let option = document.querySelector(`[value='${item}']`);
      option.selected = true;
    })
  }
}
