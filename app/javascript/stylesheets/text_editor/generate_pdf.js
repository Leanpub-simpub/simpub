import jsPDF from "jspdf";
import "./TaipeiSansTCBeta-Bold-normal"

import html2canvas from 'html2canvas';
import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"
import axios from "axios"
import $ from 'jquery'
window.$ = $

const pdfTemplate = document.createElement('template')
pdfTemplate.innerHTML=`<div class="pdf_container" ></div>`

window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#pdf-geneator')){
    
    document.querySelector('#pdf-geneator').addEventListener('click',(e)=>{
      e.preventDefault()
      let allpdf = document.querySelector('#allpdf')
      
      let bookName = document.querySelector('#bookName').textContent
      let params = {bookName:bookName}
      let token = document.querySelector("meta[name=csrf-token]").content
      axios.defaults.headers.common['X-CSRF-Token']= token 
      
      axios({
        method: 'post',
        url: '/books/all_content.json',
        data: params
      })
      .then( result=>{
        let allContent = result.data['all_content']
        allContent=allContent.join("\n")
 
        var target=document.importNode(pdfTemplate.content,true)
        allpdf.appendChild(target)
        target = document.querySelector('.pdf_container:last-child')
        mdToHTML(allContent,target)


        var doc = new jsPDF('p', 'pt', 'a4');
        doc.setFont('TaipeiSansTCBeta-Bold')
        
        let pdf_ary = document.querySelector('.pdf_container').children
        let h = 50 //current height
        let index =0.65
        // 拿到所有 md to html 的內容
        for(let i =0 ;i<pdf_ary.length;i++){
          let itemH = pdf_ary[i].scrollHeight
          
          // 如果內容太多就跳下一頁
          if( (h+itemH) > 842){
          h = 50   
          doc.addPage();
          }   

          //內文有圖片
          if(pdf_ary[i].querySelectorAll('img').length != 0){
            
            for(let j=0;j<pdf_ary[i].querySelectorAll('img').length;j++){
              let height = pdf_ary[i].querySelectorAll('img')[j].scrollHeight*0.6
              let weight = pdf_ary[i].querySelectorAll('img')[j].scrollWidth*0.6
              doc.addImage(pdf_ary[i].querySelectorAll('img')[j],'JPEG',30,h,weight,height)
              h+= pdf_ary[i].querySelectorAll('img')[j].scrollHeight*index
            }

          }else{
            //文字的處理
            if(pdf_ary[i].tagName =='H1'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(32)
              doc.text(line,30,h+20)
              h += 20
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H2'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(24)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H3'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(20)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H4'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(16)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H5'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(14)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H6'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(13)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='P'){
              let text = pdf_ary[i].textContent
              let line = doc.splitTextToSize(text,500)
              doc.setFontSize(12)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }

          }

          if(pdf_ary[i].tagName =="OL"){
            console.log('ol')
            doc.setFontSize(12)
            // let text = `${k+1}. ${pdf_ary[k].textContent}`
            // let line = doc.splitTextToSize(text,500)
            // doc.text(line,30,h)
            // h += pdf_ary[i].scrollHeight*index
            console.log(pdf_ary[i])
            console.log(pdf_ary[i].textContent)
            console.log(pdf_ary[i].children)
            for(let k = 0; i<pdf_ary[i].children.length;k++){
              console.log('k')
              console.log(pdf_ary[i].children.length)
              let text = `${k+1}. ${pdf_ary[k].children.textContent}`
              let line = doc.splitTextToSize(text,500)
              doc.text(line,30,h)
              h += pdf_ary[i].children.scrollHeight*index
            }
          }

          if(pdf_ary[i].tagName =="UL"){
            doc.setFontSize(12)
            for(let l = 0; i<pdf_ary[i].children.length;l++){
              let text = `${pdf_ary[i].children.textContent}`
              let line = doc.splitTextToSize(text,500)
              doc.text(line,30,h)
              h += pdf_ary[i].children.scrollHeight*index
            }
          }

        }
        
        doc.save(`${bookName}`+ '.pdf')
        // pdftoserver(doc.output('blob'),bookName,bookName)
              
      })
      .catch(function(err){

      })
    })
    
    

    function mdToHTML(text,target){  
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

    function pdftoserver(pdf,bookName,filename){
      let token = document.querySelector("meta[name=csrf-token]").content
      axios.defaults.headers.common['X-CSRF-Token']= token 
      let formData = new FormData();
      formData.append('file',pdf)
      formData.append('bookName',bookName)
      formData.append('filename',filename)

      axios({
        method: 'post',
        url: '/books/upload_pdf.json',
        data: formData
      })
      .then( result=>{
        alert('Your book has conveted into PDF')
      })
      .catch(function(err){
        
      })
    }

  }
})






