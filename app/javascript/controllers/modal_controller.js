import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [ "body" ];

  close() {
    // 開啟視窗捲動
    document.documentElement.style.overflow = "auto";
    const body = this.bodyTarget;
    body.classList.add("x");
  }
}