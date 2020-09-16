window.addEventListener('turbolinks:load',()=>{

  if(document.querySelector('#addChapter')){

    let addChapter =document.querySelector('#addChapter')
    let chapterform = document.querySelector('.chapterCreate')
    
    addChapter.addEventListener('click',()=>{
      chapterform.classList.remove('x')
    })
  
    let close = document.querySelector('#notAgreeBtn')
    close.addEventListener('click',()=>{
      chapterform.classList.add('x')
      document.querySelector('[name="chapter"]').value = ""
    })
  
    let agree = document.querySelector('#agreeBtn')
    agree.addEventListener('click',()=>{
      chapterform.classList.add('x')
      // document.querySelector('[name="chapter"]').value = ""
    })
  }

})