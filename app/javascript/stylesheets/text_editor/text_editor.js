import CodeMirror from "codemirror/lib/codemirror.js" // 引入 codemirror 套件 
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like"                    // 編輯器的主題，黑底的主題
import "codemirror/theme/abcdef" 
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

import axios from  'axios'
import syn_scroll from "./syn_scroll.js"


window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#sourceTA') && document.querySelector('#targetDiv')){
    let myCodeMirror //使mycodemirror變成變數
    let contentArea = document.querySelector('#sourceTA')
    let bookName = document.querySelector('.book_name')
    let chapterList = document.querySelector('.chapter_list')
    let tempForMdToHtml //判斷是否有編輯文字用
    let save = document.querySelector('#save')
    let startText
    //從前端 fetch 到 server 的 get_content action 取得第一章節的內容並印出
    let token = document.querySelector("meta[name=csrf-token]").content
    axios.defaults.headers.common['X-CSRF-Token']= token
    
    // 預設打開第一章節
    document.querySelector('.chapter').classList.add('active')
    let target = document.querySelector('.active')

    let params = { bookName:bookName.textContent , target:target.textContent }

    // 到server 拿第一章的內容
    axios({
      method: 'post',
      url: '/books/get_content.json',
      data: params
    })
    .then( (result)=>{
      // console.log(result.data['content'])
      let content = result.data['content']
     
      let editorConfig = {
        mode: "markdown",
        lint: true,
        lineNumbers: true,
        theme: 'abcdef',
        lineWrapping: true,
        autoRefresh: true,
        value: content
      }

      // 把 codemirror 的編輯器塞到 contentArea 裡面，格式要求就依照 editorConfig
      myCodeMirror = CodeMirror(contentArea, editorConfig);
      startText = myCodeMirror.getValue()
      //把左右同步滑動功能加上 
      syn_scroll()
    })
    .catch(function(err){
      console.log(err)
    })
    
    // 點擊到對應章節可以找到該檔案的資料並呈現
    chapterList.addEventListener('click',(e)=>{
      if(e.target.className =="addsection"){
        return
      }
      let token = document.querySelector("meta[name=csrf-token]").content
      axios.defaults.headers.common['X-CSRF-Token']= token  
      //紀錄書本名稱，要看哪一個章節
      let params = { bookName: bookName.textContent , target: e.target.textContent }    
      
      axios({
        method: 'post',
        url: '/books/get_content.json',
        data: params
      })
      .then( (result)=>{
        let content = result.data['content']
       
        let editorConfig = {
          mode: "markdown",
          lint: true,
          lineNumbers: true,
          theme: 'abcdef',
          lineWrapping: true,
          autoRefresh: true,
          value: content
        }
        contentArea.innerHTML = "" //清空原先的 codemirror 內容
        myCodeMirror = CodeMirror(contentArea, editorConfig);
        startText = myCodeMirror.getValue()
        // 把 codemirror 的編輯器塞到 contentArea 裡面，格式要求就依照 editorConfig
        syn_scroll()
      })
      .catch(function(err){
        console.log(err)
      })
    })
    
    
    // 手動存檔
    save.addEventListener('click',()=>{
      let content = myCodeMirror.getValue()
      if(startText != content){
        startText = content
        let target = document.querySelector('.active')
        let token = document.querySelector("meta[name=csrf-token]").content
        axios.defaults.headers.common['X-CSRF-Token']= token
        let params = { bookName:bookName.textContent , target:target.textContent, content: content }

        axios({
          method: 'post',
          url: '/books/update_content.json',
          data: params
        })
        .then( (result)=>{
          if(result.data['message'] === "ok" ){
            alert('Success to Save')
          }
        })
        .catch(function(err){
          console.log(err)
          alert('Fail to Save')
        })
      }
    })
    
   

    // 切換書本頁面時判斷是否要存檔
    chapterList.addEventListener('click',(e)=>{      
      if(e.target.className == 'chapter' || e.target.className == 'section'){
        let content = myCodeMirror.getValue()
        console.log('通過 classname check')
        // 如果內容有更動才存檔
        if(content!=startText){
          console.log('內容有更新')
          startText = content
          let target = document.querySelector('.active')
          let token = document.querySelector("meta[name=csrf-token]").content
          axios.defaults.headers.common['X-CSRF-Token']= token
          let params = { bookName:bookName.textContent , target:target.textContent, content: content }

          axios({
            method: 'post',
            url: '/books/update_content.json',
            data: params
          })
          .then( (result)=>{
            if(result.data['message'] === "ok" ){
              alert('Success to Save')
            }
          })
          .catch(function(err){
            console.log(err)
            alert('Fail to Save')
          })
        }
        chapterList.querySelector('.active').classList.remove('active')
        e.target.classList.add('active')
        let current = document.querySelector('.currentTarget')
        current.textContent = `----${e.target.textContent}`
      }
    })


    setInterval(mdToHTML,500) //模擬即時顯示 // 重複執行時間拉開，避免被圖片連結的網站認為是攻擊

    function mdToHTML(){
      let text = myCodeMirror.getValue()
      // 判斷內容是否改動，有改動就做事
      if(text !== tempForMdToHtml){
        tempForMdToHtml = text
        let target = document.getElementById('targetDiv')
        let md = markdownit(({
          html:           false,
          linkify:        true,
          typographer:    true,
          breaks:         false,
          quotes:       '“”‘’',
          highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                // 得到经过highlight.js之后的html代码
                const preCode = hljs.highlight(lang, str, true).value
                // 以换行进行分割
                const lines = preCode.split(/\n/).slice(0, -1)
                // 添加自定义行号
                let html = lines.map((item, index) => {
                  return '<div><span class="line-num line-index"  data-line="">' + (index + 1) + '</span>' + item + '</div>'
                }).join('')
                html = '<ol>' + html + '</ol>'

                return '<pre class="hljs"><code>' +
                  html +
                  '</code></pre>'
              } catch (__) {}
            }
            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
          }
        }))
        var result = md.render(text);
        target.innerHTML=result
      }else{
        return
      }
    }
  }
})