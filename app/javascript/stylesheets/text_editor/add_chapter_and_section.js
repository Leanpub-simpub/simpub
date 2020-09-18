window.addEventListener('turbolinks:load',()=>{

  if(document.querySelector('#addChapter')){

    let addChapter =document.querySelector('#addChapter')
    let chapterform = document.querySelector('.chapterCreate')
    let addSection = document.querySelectorAll('.addsection')
    let sectionform = document.querySelector('.sectionCreate')
    // add-chapter-form control
    addChapter.addEventListener('click',(e)=>{
      e.stopPropagation()
      chapterform.classList.remove('x')
      sectionform.classList.add('x')
    })
  
    let chapterAgree = document.querySelector('#chapterAgreeBtn')
    let chapterInput = document.querySelector('[name="chapter"]')
    chapterAgree.addEventListener('click',()=>{
      if(chapterInput.value === "" ){
        // 如果沒填 chapter 名稱
        chapterInput.style.border = 'red 3px solid'
        chapterInput.placeholder = 'Chapter name is blank'
        setTimeout(function(){
          chapterInput.style.border = 'black 1px solid'
        chapterInput.placeholder = ''
        },5000)
      }else{
        // 有填寫 chapter 名稱即可送出
        chapterform.submit()
        chapterform.classList.add('x')
        setTimeout(function(){
          chapterInput.value = ""
        },5000)
      }
    }) 

    let chapterNotAgreeBtn = document.querySelector('#chapterNotAgreeBtn')
    chapterNotAgreeBtn.addEventListener('click',()=>{
      chapterform.classList.add('x') 
      chapterInput.value = ""  
    })

    // add-section-form control
    addSection.forEach((addSectionBtn)=>{
      addSectionBtn.addEventListener('click',(e)=>{
        e.stopPropagation()
        sectionform.classList.remove('x')
        chapterform.classList.add('x')
        let chapter = addSectionBtn.previousSibling.previousSibling
        //  addSection 是 ＋ 前一個 DOM 是 chapter::before 再前一個才是 chapter 
        document.querySelector('#chapterForSectionRecord').value = chapter.textContent
        document.querySelector('#orderForSectionRecord').value = chapter.dataset.order
      })
    })

    let sectionAgree = document.querySelector('#sectionAgreeBtn')
    let sectionInput = document.querySelector('[name="section"]')
    sectionAgree.addEventListener('click',()=>{
      if(sectionInput.value === "" ){
        // 如果沒填 section 名稱
        sectionInput.style.border = 'red 3px solid'
        sectionInput.placeholder = 'Section name is blank'
        setTimeout(function(){
          sectionInput.style.border = 'black 1px solid'
          sectionInput.placeholder = ''
        },5000)
      }else{
        // 有填寫 section 名稱即可送出
        sectionform.submit()
        sectionform.classList.add('x')
        setTimeout(function(){
          sectionInput.value = ""
        },5000)
      }
    })

    let sectionNotAgree = document.querySelector('#sectionNotAgreeBtn')
    sectionNotAgree.addEventListener('click',()=>{
      sectionInput.value = ""
      sectionform.classList.add('x')
    })
  }

})