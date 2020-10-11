import { Controller } from "stimulus";
import Cropper from 'cropperjs';

export default class extends Controller {
  static targets = [ "show", "wrap", "img_reader", "crop_img", "preview_box",
                     "x", "y", "width", "height" , "crop"];

  connect() {
    let CROPPER; // 創建一個cropper的全局對象
    const show = this.showTarget.firstElementChild;
    const wrap = this.wrapTarget;
    const avatarInput = this.img_readerTarget;
    const cropImage = this.crop_imgTarget;
    const previewBox = this.preview_boxTarget;
    const x = this.xTarget;
    const y = this.yTarget;
    const width = this.widthTarget;
    const height = this.heightTarget;
    const crop = this.cropTarget;

    avatarInput.addEventListener("change", e => {
      wrap.classList.add("d-flex");
      cropImage.src = URL.createObjectURL(e.target.files[0]);
      loadingImg(e);
    });

    // 使用 esc 鍵關閉 cropper
    document.addEventListener("keydown", function(e) {
      if(e.keyCode === 27){
        wrap.classList.remove("d-flex");
        avatarInput.value = "";
      }
    });

    crop.addEventListener("click", () => {
      wrap.classList.remove("d-flex");
    });
    

    function loadingImg(e){
      if (CROPPER) { CROPPER.destroy(); }

      // 讀取上傳文件
      let reader = new FileReader();

      if(e.target.files[0]){
        // readAsDataURL 方法可以將 File 對象轉化為 data:URL 格式的字符串 (base64編碼)
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = e => {
          let dataURL = reader.result;
          // 將 img 的 src 改為剛上傳的文件的轉換格式
          cropImage.src = dataURL; 
          // 創建 cropper 實例
          CROPPER = new Cropper(cropImage, {
            aspectRatio: 1 / 1,
            viewMode: 2,
            dragMode: "move",
            preview: [previewBox],
            crop(e) {
              x.value = Math.round(e.detail.x);
              y.value = Math.round(e.detail.y);
              width.value = Math.round(e.detail.width);
              height.value = Math.round(e.detail.height);
            }
          });
        }
      }
    }
  }
}
