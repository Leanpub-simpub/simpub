import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"

import axios from 'axios'

window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#sampleshow')){
    let token = document.querySelector("meta[name=csrf-token]").content
    axios.defaults.headers.common['X-CSRF-Token']= token
    let chapter = true
    let section = false
    let bookName= document.querySelector('.book_name').textContent
    let target = document.querySelector('#sample').textContent
    let params = { bookName:bookName, target:target, chapter:chapter,section:section,chapterName:target}
    axios({
      method: 'post',
      url: '/books/get_content.json',
      data: params
    })
    .then( (result)=>{
      let content = result.data['content']
      console.log(content)
      mdToHTML(content)
    })
    .catch(function(err){
      // alert('Fail to get content')
    })
  }

  function mdToHTML(text){
      let target = document.getElementById('sampleshow')
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
  }
})
