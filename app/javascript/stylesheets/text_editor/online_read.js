import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"

import axios from 'axios'
window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('.chapter_list')&& document.querySelector('#sourceTA')==null){
    let bookName = document.querySelector('.book_name')
    let chapterList = document.querySelector('.chapter_list')
    let current = document.querySelector('.currentTarget')
    let chapterName
    let token = document.querySelector("meta[name=csrf-token]").content
    axios.defaults.headers.common['X-CSRF-Token']= token
    
    // 預設打開第一章節
    document.querySelector('.chapter').classList.add('active')
    let target = document.querySelector('.active')
    current.textContent =`----${target.textContent}`
    let chapter = true
    let section = false
    let params = { bookName:bookName.textContent, target:target.textContent , chapter:chapter,  section:section,chapterName:target.textContent}
    // 到server 拿第一章的內容
    axios({
      method: 'post',
      url: '/books/get_content.json',
      data: params
    })
    .then( (result)=>{
      let content = result.data['content']
      mdToHTML(content)
    })
    .catch(function(err){
      alert('Fail to get content')
    })

    

    // 點擊到對應章節可以找到該檔案的資料並呈現
    chapterList.addEventListener('click',(e)=>{
    if((e.target.className.match("chapter") != null ||e.target.className.match("section") != null ) && e.target != document.querySelector('.active')){

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
        mdToHTML(content)

      })
      .catch(function(err){
        alert('Fail to get content')
      })
    }


    chapterList.addEventListener('click',(e)=>{      
      if(e.target.className == 'chapter' || e.target.className == 'section'){
        let currentActive = chapterList.querySelector('.active')
        console.log(currentActive)
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
  })
  


    function mdToHTML(text){
      let target = document.getElementById('targetDiv')
      target.innerHTML=""
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
                return '<div><span class="line-num line-index"  data-line="">' + (index + 1) + '</span>' + item + '<div>'
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
    }
  }
})