import CodeMirror from "codemirror/lib/codemirror.js" // 引入 codemirror 套件 
import "codemirror/lib/codemirror.css"
import "codemirror/theme/abcdef"                      // 編輯器的主題，黑底的主題
import "codemirror/mode/markdown/markdown"            // markdown 語法 hightlight 
import "codemirror/mode/ruby/ruby"
import "codemirror/mode/javascript/javascript"
import "codemirror/mode/sql/sql"
import "codemirror/mode/powershell/powershell"
import "codemirror/mode/shell/shell"
import "codemirror/mode/xml/xml"
import "codemirror/mode/css/css"
import "codemirror/mode/sass/sass"
// import 這麼多是因為在 markdown 中打的 code 需要對應的 js 程式去掃 才會 highlight

import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"
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

  function mdToHTML(){
    let text = myCodeMirror.getValue()
    let target = document.getElementById('targetDiv')
    let md = markdownit(({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return '<pre class="hljs"><code>' +
                   hljs.highlight(lang, str, true).value +
                   '</code></pre>';
          } catch (__) {}
        }
    
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
      }
    }))
        var result = md.render(text);
        target.innerHTML=result
    }
      setInterval(mdToHTML,100) //模擬即時顯示 
})