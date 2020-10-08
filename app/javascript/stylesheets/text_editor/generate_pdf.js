import jsPDF from "jspdf";
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
        let allChapter = result.data['all_chapter']
        console.log(allContent)
        console.log(allChapter)
        // chapter section 分開放
        // for(let i=0;i<allContent.length;i++){
        //   let target=document.importNode(pdfTemplate.content,true)
        //   allpdf.appendChild(target)
        //   target = document.querySelector('.pdf_container:last-child')
        //   let filename = `${bookName}_${allChapter[i]}`
        //   mdToHTML(allContent[i],target)
        //   btnDownloadPageBypfd2(target,bookName,filename)  //低標 
        // }
        let target=document.importNode(pdfTemplate.content,true)
        allpdf.appendChild(target)
        target = document.querySelector('.pdf_container:last-child')
        allContent=allContent.join("\n")
        mdToHTML(allContent,target)
        btnDownloadPageBypfd2(target,bookName,bookName,e.target)
      })
      .catch(function(err){
        console.log(err)
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

    function btnDownloadPageBypfd2(pdf_container,bookName,filename, target = null){ //引數是'#pdf_container' 或 '.pdf_container',注意帶字首
      console.log(pdf_container)
      pdf_container.classList.add('pdf'); //pdf的css在下一個程式碼中,作用是使得列印的內容能在pdf中完全顯示
	    var cntElem = pdf_container;
	    var shareContent = cntElem; //需要截圖的包裹的（原生的）DOM 物件
	    var width = shareContent.offsetWidth; //獲取dom 寬度
	    var height = shareContent.offsetHeight; //獲取dom 高度
	    var canvas = document.createElement("canvas"); //建立一個canvas節點
	    var scale = 2; //定義任意放大倍數 支援小數
	    canvas.width = width * scale; //定義canvas 寬度 * 縮放，在此我是把canvas放大了2倍
	    canvas.height = height * scale; //定義canvas高度 *縮放
	    canvas.getContext("2d").scale(scale, scale); //獲取context,設定scale 
	    html2canvas(pdf_container, {
	    	allowTaint: true,
            taintTest: true,
            canvas: canvas,
	    	onrendered: function(canvas) {
	    	var context = canvas.getContext('2d');
	    	// 【重要】關閉抗鋸齒
	    	context.mozImageSmoothingEnabled = false;
	    	context.webkitImageSmoothingEnabled = false;
	    	context.msImageSmoothingEnabled = false;
	    	context.imageSmoothingEnabled = false;
	    	  var imgData = canvas.toDataURL('image/jpg',1.0);//轉化成base64格式,可上網瞭解此格式
	    	  var img = new Image();
	    	  img.src = imgData;
	    	  img.onload = function() {	
	    	    img.width = img.width/2;   //因為在上面放大了2倍，生成image之後要/2
	    	    img.height = img.height/2;
            img.style.transform="scale(0.5)";
            var pageWidth = 595;//一頁寬度
	          	var position = 0;//頁面偏移
	          	var imgWidth = width;
               var leftWidth = 720
	             var imgHeight = height;
              var doc = new jsPDF('p', 'pt', 'a4');
	    	     if(pageWidth >= leftWidth){//不需要分頁，頁面高度>=未列印內容高度
	    	     	console.log("不需要分頁");
	    	     	 doc.addImage(imgData, 'jpeg', 35, 25, imgWidth*0.75, imgHeight*0.75);
	    	     }else{//需要分頁
	    	     	console.log("需要分頁");
	    	     	while(leftWidth>0){
                doc.addImage(imgData, 'JPEG', position, 25, imgWidth*0.8, imgHeight*0.8);
                console.log(`imgWidth*0.6:${imgWidth*0.6}`)
                leftWidth -= 360; 
	    	     	  position -= 575; 
	    	     	  //避免新增空白頁
	    	     	  if(leftWidth > 0){
	    	     	 	  console.log("新增空白頁");
	    	     	 	  doc.addPage();
	    	     	  }
	    	     	}
             }
            //  doc.save(`${filename}`+ '.pdf');//儲存為pdf檔案
             pdftoserver(doc.output('blob'),bookName,filename, target)
	    	  }
	    	 },
	    });
	    pdf_container.classList.remove('pdf');
    }

    function pdftoserver(pdf,bookName,filename, form = null){
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
        console.log(result.data['message'])
        // if (target){alert('Your book has conveted into PDF')} 
        alert('Your book has conveted into PDF')
      })
      .catch(function(err){
        
      })
    }

  }
})



