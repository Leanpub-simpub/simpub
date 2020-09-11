import CodeMirror from "codemirror/lib/codemirror.js" // 引入 codemirror 套件 
import "codemirror/lib/codemirror.css"

window.addEventListener('DOMContentLoaded',()=>{

  let myCodeMirror //使mycodemirror變成變數
  let contentArea = document.querySelector('#sourceTA')
  let editorConfig = {
    mode: "markdown",
    lint: true,
    lineNumbers: true,
    theme: 'abcdef',
    lineWrapping: true,
    autoRefresh: true,
    value: ""
  }
  myCodeMirror = CodeMirror(contentArea, editorConfig);
  // 把 codemirror 的編輯器塞到 contentArea 裡面，格式要求就依照 editorConfig

})