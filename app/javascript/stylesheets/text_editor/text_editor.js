import CodeMirror from "codemirror/lib/codemirror.js" // 引入 codemirror 套件 
import "codemirror/lib/codemirror.css"
import "codemirror/theme/mdn-like"                    // 編輯器的主題，黑底的主題
import "codemirror/theme/abcdef" 
import "codemirror/theme/base16-dark" 
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

import axios from 'axios'
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
    let chapterName
    //從前端 fetch 到 server 的 get_content action 取得第一章節的內容並印出
    let token = document.querySelector("meta[name=csrf-token]").content
    axios.defaults.headers.common['X-CSRF-Token']= token
    
    // 預設打開第一章節
    document.querySelector('.chapter').classList.add('active')
    document.querySelector('.chapter').parentElement.classList.add('activesite') 
    let target = document.querySelector('.active')
    let chapter = true
    let section = false
    let params = { bookName:bookName.textContent, target:target.textContent , chapter:chapter,section:section, chapterName:target.textContent}
   
    // 到server 拿第一章的內容
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
        theme: 'base16-dark',
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
      
    })
    
    // 點擊到對應章節可以找到該檔案的資料並呈現
    chapterList.addEventListener('click',(e)=>{
      if((e.target.className.match("chapter") != null ||e.target.className.match("section") != null ) && e.target != document.querySelector('.active') && e.target.className.match('addsection') == null && e.target != chapterList){
        e.stopPropagation()
        if(e.target.className.match('chapter')!=null){
          chapter = true
          section = false
          chapterName = e.target.textContent
        }else if(e.target.className.match('section')!=null){
          chapter = false
          section = true
          let index = e.target.dataset.chapterOrder
          chapterName = document.querySelector(`[data-order="${index}"]`).textContent
        }
        let token = document.querySelector("meta[name=csrf-token]").content
        axios.defaults.headers.common['X-CSRF-Token']= token  
        //紀錄書本名稱，要看哪一個章節   
        let params = { bookName: bookName.textContent, target: e.target.textContent , chapter:chapter,section:section, chapterName: chapterName}

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
            theme: 'base16-dark',
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
          
        })
      }
    })
    
    
    // 手動存檔
    save.addEventListener('click',saveContent)
    
    // 切換書本頁面時判斷是否要存檔
    chapterList.addEventListener('click',(e)=>{      
      if(e.target.className == 'chapter' || e.target.className == 'section'){
       
        saveContent()  //存檔

        let currentActive = chapterList.querySelector('.active')
        currentActive.classList.remove('active')
        e.target.classList.add('active')
        let current = document.querySelector('.currentTarget')
        current.textContent = `----${e.target.textContent}`
        document.querySelector('.activesite').classList.remove('activesite')
        if(e.target.className.match('chapter')!= null){
          e.target.parentElement.classList.add('activesite')
        }else if(e.target.className.match('section') != null){
          e.target.classList.add('activesite')
        }
      }
    })


    setInterval(mdToHTML,500) //模擬即時顯示 // 重複執行時間拉開，避免被圖片連結的網站認為是攻擊
    setInterval(saveContent,1000*60*5) //每五分鐘自動存檔
    
    
    function mdToHTML(){
      if(!document.querySelector('.CodeMirror')){
        return
      }
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
                  return '<div><span class="line-num line-index"  data-line="">' + (index + 1)+ '</span>' + item + '</div>'
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
        // md2html=result
        target.innerHTML=result
      }else{
        return
      }
    }

    // 手動存檔的code
    function saveContent(){
      let content = myCodeMirror.getValue()
      if(startText != content){
        startText = content
        let target = document.querySelector('.active')
        let token = document.querySelector("meta[name=csrf-token]").content
        axios.defaults.headers.common['X-CSRF-Token']= token
        if(target.className.match('chapter')!=null){
          chapter = true
          section = false
          chapterName = target.textContent
        }else if(target.className.match('section')!=null){
          chapter = false
          section = true
          let index = target.dataset.chapterOrder
          chapterName = document.querySelector(`[data-order="${index}"]`).textContent
        }
        let params = { bookName: bookName.textContent, target:target.textContent, chapter:chapter,section:section, chapterName:chapterName, content:content}

        axios({
          method: 'post',
          url: '/books/update_content.json',
          data: params
        })
        .then( (result)=>{
          if(result.data['message'] === "ok" ){
            let alert = document.querySelector('.alert')
            alert.textContent = 'Success to Save'
            setTimeout(function(){
              alert.textContent = ""
            },8000)
            
          }
        })
        .catch(function(err){
          let alert = document.querySelector('.alert')
          alert.textContent = 'Fail to Save'
          setTimeout(function(){
            alert.textContent = ""
          },8000)
        
        })
      }
    }

    

  }
})