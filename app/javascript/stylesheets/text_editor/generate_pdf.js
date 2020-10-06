import jsPDF,{addHTML}from "jspdf";
import html2canvas from 'html2canvas';
import html2pdf from "html2pdf.js"
import markdownit from "markdown-it/dist/markdown-it" 
import hljs from 'highlightjs/highlight.pack'
import "highlightjs/styles/github"
import axios from "axios"
import $, { Callbacks } from 'jquery'
window.$ = $

window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#bookName')){
    let bookName = document.querySelector('#bookName').textContent
    let allContent
    let pdf_container = '#pdf_container'
    let params = {bookName:bookName}
    let token = document.querySelector("meta[name=csrf-token]").content
    axios.defaults.headers.common['X-CSRF-Token']= token 
    
    axios({
      method: 'post',
      url: '/books/all_content.json',
      data: params
    })
    .then( async result=>{
      allContent = result.data['all_content']
      console.log(allContent)
      mdToHTML(allContent)
      
      
      // $(pdf_container).addClass('pdf')
      // var element = document.getElementById('pdf_container');
	    // var cntElem = g(pdf_container);
	    // var shareContent = cntElem; //需要截圖的包裹的（原生的）DOM 物件
	    // var width = shareContent.offsetWidth; //獲取dom 寬度
	    // var height = shareContent.offsetHeight; //獲取dom 高度
	    // var canvas = document.createElement("canvas"); //建立一個canvas節點
	    // var scale = 2; //定義任意放大倍數 支援小數
	    // canvas.width = width * scale; 
      // var opt = {
      //   margin:       1,
      //   allowTaint:true,
      //   filename:     'myfile.pdf',
      //   pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      //   image:        { type: 'jpeg', quality: 0.98 },
      //   html2canvas:  { scale: 5 ,width:width,height:height,x:250,y:35},
      //   jsPDF:        { unit: 'px', format: 'a4', orientation: 'landscape',}
      // };
      
      // html2pdf().set(opt).from(element).save();
      // $(pdf_container).removeClass('pdf')
      
      btnDownloadPageBypfd2(pdf_container)  //低標
    })
    .then(a=>{
      // addHeight()

    })
    .catch(function(err){
      alert('Fail to get content')
    })

  //   function makePDF() {

  //     var quotes = document.getElementById('pdf_container');
  
  //     html2canvas(quotes, {
  //         onrendered: function(canvas) {
  
  //         //! MAKE YOUR PDF
  //         var pdf = new jsPDF('p', 'pt', 'letter');
  
  //         for (var i = 0; i <= quotes.clientHeight/980; i++) {
  //             //! This is all just html2canvas stuff
  //             var srcImg  = canvas;
  //             var sX      = 0;
  //             var sY      = 980*i; // start 980 pixels down for every new page
  //             var sWidth  = 900;
  //             var sHeight = 980;
  //             var dX      = 0;
  //             var dY      = 0;
  //             var dWidth  = 900;
  //             var dHeight = 980;
  
  //             window.onePageCanvas = document.createElement("canvas");
  //             onePageCanvas.setAttribute('width', 900);
  //             onePageCanvas.setAttribute('height', 980);
  //             var ctx = onePageCanvas.getContext('2d');
  //             // details on this usage of this function: 
  //             // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
  //             ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);
  
  //             // document.body.appendChild(canvas);
  //             var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
  
  //             var width         = onePageCanvas.width;
  //             var height        = onePageCanvas.clientHeight;
  
  //             //! If we're on anything other than the first page,
  //             // add another page
  //             if (i > 0) {
  //                 pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
  //             }
  //             //! now we declare that we're working on that page
  //             pdf.setPage(i+1);
  //             //! now we add content to that page!
  //             pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));
  
  //         }
  //         //! after the for loop is finished running, we save the pdf.
  //         pdf.save('Test.pdf');
  //     }
  //   });
  // }



    function addHeight(){
      let pdf = document.querySelector('#pdf_container')
      console.log(1)
      let a = -35
      let b = 0
      for(let i=0;i<pdf.children.length;i++){
        let pdf_dom = pdf.children[i]
        a += pdf.children[i].scrollHeight
        if( a > 200 && a % 501.89 < 35){
          b = 70 - a % 501.89 
          let new_don = document.createElement('div')
          new_don.style.height=`${b}px`
          pdf.insertBefore(new_don,pdf_dom)
        }
      }
    }

    function imgSet(){
      document.querySelectorAll('#pdf_container img').forEach(img=>{
        img.setAttribute("crossorigin",'anonymous')
      })
    }

    function mdToHTML(text){
      let target = document.getElementById('pdf_container')
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

    function btnDownloadPageBypfd2(pdf_container){ //引數是'#pdf_container' 或 '.pdf_container',注意帶字首
	    $(pdf_container).addClass('pdf'); //pdf的css在下一個程式碼中,作用是使得列印的內容能在pdf中完全顯示
	    var cntElem = g(pdf_container);
	    var shareContent = cntElem; //需要截圖的包裹的（原生的）DOM 物件
	    var width = shareContent.offsetWidth; //獲取dom 寬度
	    var height = shareContent.offsetHeight; //獲取dom 高度
	    var canvas = document.createElement("canvas"); //建立一個canvas節點
	    var scale = 2; //定義任意放大倍數 支援小數
	    canvas.width = width * scale; //定義canvas 寬度 * 縮放，在此我是把canvas放大了2倍
	    canvas.height = height * scale; //定義canvas高度 *縮放
	    canvas.getContext("2d").scale(scale, scale); //獲取context,設定scale 
    
	    html2canvas(g(pdf_container), {
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
        document.body.appendChild(canvas)// 將html 轉成 canvas 後丟到畫面上 之後用js 硬生加上空白，避免後來裁切切錯



	    	  var imgData = canvas.toDataURL('image/jpg',1.0);//轉化成base64格式,可上網瞭解此格式
	    	  var img = new Image();
	    	  img.src = imgData;
	    	  img.onload = function() {	
	    	    img.width = img.width/2;   //因為在上面放大了2倍，生成image之後要/2
	    	    img.height = img.height/2;
            img.style.transform="scale(0.5)";
	    		// console.log("img.width"+img.width);
	    		// console.log("this.width="+this.width);
	    		// console.log("this.height="+this.height);
	    	    /****分頁******/
            var margins = {top: 40, bottom: 60, left: 40, width: 522,useFor: 'page'};
            
            var pageHeight = 841.89;//一頁高度
	    	     var leftHeight = height * 0.75;//未列印內容高度
	          	 var position = 0;//頁面偏移
	          	 var imgWidth = width;
	             //var imgHeight = 841.89;
	             var imgHeight =   height;
	             console.log("imgWidth="+imgWidth);
	             console.log("imgHeight="+imgHeight);
                var doc = new jsPDF('p', 'pt', 'a4');
                let page = 1
	    	     if(pageHeight >= leftHeight){//不需要分頁，頁面高度>=未列印內容高度
	    	     	console.log("不需要分頁");
	    	     	 doc.addImage(imgData, 'jpeg', 35, 0, imgWidth*0.75, imgHeight*0.75);
	    	     }else{//需要分頁
	    	     	console.log("需要分頁");
	    	     	while(leftHeight>0){
	    	     	  console.log("position="+position);
                console.log("leftHeight="+leftHeight);
                
                // let newimg = getPageCanvas(canvas, imgWidth, imgHeight, page)
                doc.addImage(imgData, 'JPEG', 35, position+35, imgWidth*0.75, imgHeight*0.75);
                page +=1
	    	     	  leftHeight -= pageHeight; 
	    	     	  position -= 841.89; 
	    	     	  //避免新增空白頁
	    	     	  if(leftHeight > 0){
	    	     	 	  console.log("新增空白頁");
	    	     	 	  doc.addPage();
	    	     	  }
	    	     	}
	    	     }
	    	    // doc.save(`${bookName}` + new Date().getTime() + '.pdf');//儲存為pdf檔案
	    	  }
	    	 },
	    	  background: "#fff", //一般把背景設定為白色，不然會出現圖片外無內容的地方出現黑色，有時候還需要在CSS樣式中設定div背  景  白色
	    });
	    $('#pdf_container').removeClass('pdf');
    }

    function getPageCanvas(canvas, pageWidth, pageHeight, pageNo){
      var pageImageWidth = canvas.width;
      var pageImageHeight = pageHeight * pageImageWidth/pageWidth;

      var ctx = canvas.getContext("2d");
      var buffer = ctx.getImageData(0, pageNo * pageImageHeight, pageImageWidth, pageImageHeight);
      var pageCanvas = document.createElement('canvas');
      pageCanvas.width = pageImageWidth;
      pageCanvas.height = pageImageHeight;
      var pageCanvasCtx = pageCanvas.getContext("2d");
      pageCanvasCtx.putImageData(buffer, 0, 0);

      return pageCanvas;
    };          

    function g(selector){
      var method = selector.substr(0,1) == '.' ?
        'getElementsByClassName' : 'getElementById';
      return document[method](selector.substr(1));
    }
  }
})



