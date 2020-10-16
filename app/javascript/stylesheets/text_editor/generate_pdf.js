import jsPDF from "jspdf";
import "./TaipeiSansTCBeta-Bold-normal"
import html2canvas from 'html2canvas';
import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"
import axios from "axios"
import $ from 'jquery'
window.$ = $
import Swal from "sweetalert2";

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
          if( (h+itemH) > 900){
          h = 50   
          doc.addPage();
          }   
          if(i==1){h+=20}

          //內文有圖片
          if(pdf_ary[i].querySelectorAll('img').length != 0){
            
            // for(let j=0;j<pdf_ary[i].querySelectorAll('img').length;j++){
            //   let height = pdf_ary[i].querySelectorAll('img')[j].scrollHeight*0.6
            //   let weight = pdf_ary[i].querySelectorAll('img')[j].scrollWidth*0.6
            //   doc.addImage(pdf_ary[i].querySelectorAll('img')[j],'JPEG',30,h,weight,height)
            //   h+= pdf_ary[i].querySelectorAll('img')[j].scrollHeight*index
            // }
          }else{
            //文字的處理
            let text = pdf_ary[i].textContent
            if(pdf_ary[i].tagName =='H1'){
              
              h += 10
              doc.setFontSize(32)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h+20)
              h += 10
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H2'){
              h += 10
              doc.setFontSize(24)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += 10
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H3'){
              h += 10
              doc.setFontSize(20)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += 10
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H4'){
              h += 5
              doc.setFontSize(16)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += 5
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H5'){
              h += 5
              doc.setFontSize(14)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += 5
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='H6'){
              doc.setFontSize(13)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='P'){
              h += 10
              doc.setFontSize(12)
              let line = doc.splitTextToSize(text,530)
              doc.text(line,30,h)
              h += 10
              h += pdf_ary[i].scrollHeight*index
            }else if(pdf_ary[i].tagName =='PRE'){
              let txt = pdf_ary[i].textContent.replace(/(\d)(\w)/g,"\n$1   $2")
              doc.setFontSize(12)
              let line = doc.splitTextToSize(text,530)
              doc.text(txt,30,h)
              // btnDownloadPageBypfd2(pdf_ary[i],h)
              // console.log('out')
              // let canvas = document.createElement('canvas')
              // let imgData
              // html2canvas(document.querySelector("pre")).then(canvas => {
              //   document.body.querySelector('.pdf_container').appendChild(canvas)
              //   return 'ok'
              // }).then(ok=>{ })
              // html2canvas(pdf_ary[i]).then(canvas => {
              //   document.querySelector('.pdf_container').appendChild(canvas)
              //   console.log(canvas)
              //   var height = pdf_ary[i].scrollHeight
              //   doc.addImage(canvas, 'JPEG', 30, h, 500, height);
              // });
              h += pdf_ary[i].scrollHeight*index
            }
            

          }

          if(pdf_ary[i].tagName =="OL"){
            doc.setFontSize(12)
            let text_array = pdf_ary[i].textContent.split('\n')
            text_array.pop()
            text_array.shift()
            let text = ""
            
            for(let z=0; z< text_array.length;z++){
              text+= `${z+1}. ${text_array[z]} \n`
            }
            let line = doc.splitTextToSize(text,500)
            doc.text(line,30,h)
            h += pdf_ary[i].scrollHeight*index           
          }

          if(pdf_ary[i].tagName =="UL"){
            doc.setFontSize(12)
            let text_array = pdf_ary[i].textContent.split('\n')
            text_array.pop()
            text_array.shift()
            let text = ""

            for(let z=0; z< text_array.length;z++){
              text+= `· ${text_array[z]} \n`
            }
            let line = doc.splitTextToSize(text,500)
            doc.text(line,30,h)
            h += pdf_ary[i].scrollHeight*index  
          }

        }
        // console.log('pdfOK')
        pdftoserver(doc.output('blob'),bookName,bookName)
        doc.save(`${bookName}`+ '.pdf')
      })
      .catch(function(err){
        // console.log(err)
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
        console.log('OK')
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your book has conveted into PDF',
          showConfirmButton: false,
          timer: 500
        })
      })
      .catch(function(err){
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Fail to conveted  your book into PDF',
          showConfirmButton: true,
          // timer: 1000
        })
      })
    }


    // function btnDownloadPageBypfd2(pdf_container,h,doc){ //参数是'#pdf_container' 或 '.pdf_container',注意带前缀

    //   var cntElem = pdf_container;
    //   var shareContent = cntElem; //需要截图的包裹的（原生的）DOM 对象
    //   var width = shareContent.offsetWidth; //获取dom 宽度
    //   var height = shareContent.offsetHeight; //获取dom 高度
    //   var canvas = document.createElement("canvas"); //创建一个canvas节点
    //   var scale = 2; //定义任意放大倍数 支持小数
    //   canvas.width = width * scale; //定义canvas 宽度 * 缩放，在此我是把canvas放大了2倍
    //   canvas.height = height * scale; //定义canvas高度 *缩放
    //   canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
    //   console.log('infunction1')

    //   html2canvas(pdf_container, {
    //     allowTaint: true,
    //         taintTest: true,
    //         canvas: canvas,
    //     onrendered: function(canvas) {
    //       console.log('infunction2')

    //     var context = canvas.getContext('2d');
    //     // 【重要】关闭抗锯齿
    //     context.mozImageSmoothingEnabled = false;
    //     context.webkitImageSmoothingEnabled = false;
    //     context.msImageSmoothingEnabled = false;
    //     context.imageSmoothingEnabled = false;
    //     document.body.appendChild(canvas)
    //       var imgData = canvas.toDataURL('image/jpeg',1.0);//转化成base64格式,可上网了解此格式
    //       var img = new Image();
    //       img.src = imgData;
    //       img.onload = function() {	
    //         img.width = img.width/2;   //因为在上面放大了2倍，生成image之后要/2
    //         img.height = img.height/2;
    //         img.style.transform="scale(0.5)";
    //         var imgWidth = width;
    //         var imgHeight =   height;
    //         doc.addImage(imgData, 'JPEG', 30, h, imgWidth*0.75, imgHeight*0.75);
    //         console.log('infunction3')
            
    //         }
    //       },
    //     });
    //   }

    }
})






