const chapterTemplate = document.createElement("template");
chapterTemplate.innerHTML = `
    <div class="d-flex justify-content-between">
      <div class="chapter"></div>
      <div class="addsection">+</div>
    </div>
`
const sectionTemplate = document.createElement("template");
sectionTemplate.innerHTML = `
    <div class="section"></div>
`  


window.addEventListener('turbolinks:load',()=>{

  if(document.querySelector('#addChapter')){
    let chapterList = document.querySelector('.chapter_list')
    let addChapter =document.querySelector('#addChapter')
    let chapterform = document.querySelector('.chapterCreate')
    let sectionform = document.querySelector('.sectionCreate')
    let sectionInsetTarget // 之後新增 section 要當作位置參照
    let chapterErr = document.querySelector('#chapterErr')
    let sectionErr = document.querySelector('#sectionErr')

    // add-chapter-form control
    addChapter.addEventListener('click',(e)=>{
      e.stopPropagation()
      chapterform.classList.remove('x')
      sectionform.classList.add('x')
    })
  
    let chapterAgree = document.querySelector('#chapterAgreeBtn')
    let chapterInput = document.querySelector('[name="chapter"]')
    chapterAgree.addEventListener('click',()=>{
      // 先收集所有 chapter 所有的內容供後續比對
      let chapterName = []
      document.querySelectorAll('.chapter').forEach(chapter =>{
        chapterName.push(chapter.textContent)
      })
      console.log(chapterName)
      if(chapterInput.value === "" ){
        // 如果沒填 chapter 名稱
        chapterInput.style.border = 'red 3px solid'
        chapterInput.placeholder = 'Chapter name is blank'
      }else if(chapterName.includes(chapterInput.value)){
        chapterInput.style.border = 'red 3px solid'
        chapterErr.textContent = 'Chapter name is repeated'
      }
      else{
        // 有填寫 chapter 名稱即可送出
        chapterform.submit()
        chapterform.classList.add('x')
        //將新增的 chapter 在加到 chapter_list
        let chapterDOM = document.importNode(chapterTemplate.content,true)
        chapterDOM.querySelector('.chapter').textContent = chapterInput.value.replace(new RegExp(" ","g"),"_")
        // 將空白鍵換成底線
        let order = document.querySelectorAll('.chapter').length
        chapterDOM.querySelector('.chapter').dataset.order = order
        chapterList.insertBefore(chapterDOM,addChapter)
        setTimeout(function(){
          chapterErr.textContent =""
          chapterInput.value = ""
        },1)
      }
    }) 

    let chapterNotAgreeBtn = document.querySelector('#chapterNotAgreeBtn')
    chapterNotAgreeBtn.addEventListener('click',()=>{
      chapterform.classList.add('x') 
      chapterInput.value = ""  
    })

    // add-section-form control
    chapterList.addEventListener('click',(e)=>{
      if(e.target.className == 'addsection'){
        sectionform.classList.remove('x')
        chapterform.classList.add('x')
        let chapter = e.target.previousSibling.previousSibling
        //  addSection 是 ＋ 前一個 DOM 是 chapter::before 再前一個才是 chapter 
        document.querySelector('#chapterForSectionRecord').value = chapter.textContent
        document.querySelector('#orderForSectionRecord').value = chapter.dataset.order
        sectionInsetTarget = e.target.previousSibling.previousSibling
      }
    })

    let sectionAgree = document.querySelector('#sectionAgreeBtn')
    let sectionInput = document.querySelector('[name="section"]')
    
    sectionAgree.addEventListener('click',()=>{
      let sectionName=[]
      
      // 抓出屬於同 chapter 所有 section 的內容供後面比對
      let chapterOrder = sectionInsetTarget.dataset.order
      document.querySelectorAll(`.chapter_list [data-chapter-order="${chapterOrder}"]`).forEach(section=>{
        sectionName.push(section.textContent)
      })
      console.log(sectionName)
      if(sectionInput.value === "" ){
        // 如果沒填 section 名稱
        sectionInput.style.border = 'red 3px solid'
        sectionInput.placeholder = 'Section name is blank'
        setTimeout(function(){
          sectionInput.style.border = 'black 1px solid'
          sectionInput.placeholder = ''
        },5000)
      }else if(sectionName.includes(sectionInput.value)){
        sectionInput.style.border = 'red 3px solid'
        sectionErr.textContent = 'Section name is repeat'
      }
      else{
        // 有填寫 section 名稱即可送出
        sectionform.submit()
        sectionform.classList.add('x')
        let sectionDOM = document.importNode(sectionTemplate.content,true)
        sectionDOM.querySelector('.section').textContent = sectionInput.value.replace(new RegExp(" ","g"),"_")
        
        // 判斷新增sction 所屬的 chapter 後方是 + 按鈕 還是其他章節
        let order =parseInt(sectionInsetTarget.dataset.order)
        if(document.querySelector(`[data-order="${order+1}"]`)){
          chapterList.insertBefore(sectionDOM,document.querySelector(`[data-order="${order+1}"]`).parentElement)
        }else{
          chapterList.insertBefore(sectionDOM,addChapter)
        }
       
        setTimeout(function(){
          sectionInput.value = ""
          sectionErr.textContent = ""
        },10)
      }
    })

    let sectionNotAgree = document.querySelector('#sectionNotAgreeBtn')
    sectionNotAgree.addEventListener('click',()=>{
      sectionInput.value = ""
      sectionform.classList.add('x')
    })
  }

})

