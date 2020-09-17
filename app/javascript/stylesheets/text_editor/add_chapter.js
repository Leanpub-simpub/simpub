window.addEventListener('turbolinks:load',()=>{

  if(document.querySelector('#addChapter')){

    let addChapter =document.querySelector('#addChapter')
    let chapterform = document.querySelector('.chapterCreate')
    let addSession = document.querySelectorAll('.addsession')
    let sessionform = document.querySelector('.sessionCreate')
    // add-chapter-form control
    addChapter.addEventListener('click',()=>{
      chapterform.classList.remove('x')
    })
  
    let chapterAgree = document.querySelector('#chapterAgreeBtn')
    let chapterInput = document.querySelector('[name="chapter"]')
    chapterAgree.addEventListener('click',(e)=>{
      e.preventDefault()
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

    // add-session-form control
    addSession.forEach((addSessionBtn)=>{
      addSessionBtn.addEventListener('click',()=>{
        sessionform.classList.remove('x')

        let chapter = addSessionBtn.previousSibling.previousSibling
        //  addSession 是 ＋ 前一個 DOM 是 chapter::before 再前一個才是 chapter 
        document.querySelector('#chapterForSessionRecord').value = chapter.textContent
        document.querySelector('#orderForSessionRecord').value = chapter.dataset.order
      })
    })

    let sessionAgree = document.querySelector('#sessionAgreeBtn')
    let sessionInput = document.querySelector('[name="session"]')
    sessionAgree.addEventListener('click',(e)=>{
      e.preventDefault()
      if(sessionInput.value === "" ){
        // 如果沒填 session 名稱
        sessionInput.style.border = 'red 3px solid'
        sessionInput.placeholder = 'Session name is blank'
        setTimeout(function(){
          sessionInput.style.border = 'black 1px solid'
          sessionInput.placeholder = ''
        },5000)
      }else{
        // 有填寫 session 名稱即可送出
        sessionform.submit()
        sessionform.classList.add('x')
        setTimeout(function(){
          sessionInput.value = ""
        },5000)
      }
    })

    let sessionNotAgree = document.querySelector('#sessionNotAgreeBtn')
    sessionNotAgree.addEventListener('click',()=>{
      sessionInput.value = ""
      sessionform.classList.add('x')
    })
  }

})