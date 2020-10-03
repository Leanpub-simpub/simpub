import { Controller } from "stimulus";
import axios from "axios";

export default class extends Controller {
  static targets = [ "" ];

  show() {
    const orderInfo = document.querySelector("#order-info");
    const orderUuid = this.data.get("uuid");

    const token = document.querySelector("meta[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-Token"] = token;
    
    // axios.get(`/purchase_show?uuid=${orderUuid}`)
    //      .then(function(result) {
    //       //  history.pushState("", "", `/purchase_show?uuid=${orderUuid}`);
    //        console.log(result.data[0]);
    //      })
    //      .catch(function(error) {
    //      });
  }
}