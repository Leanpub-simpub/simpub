window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('.chapter_list')){

    let chapterList = document.querySelector('.chapter_list')
    let current = document.querySelector('.currentTarget')

    document.querySelector('.chapter').classList.add('active')
    // 預設打開第一章節
    chapterList.addEventListener('click',(e)=>{      
      if(e.target.className == 'chapter' || e.target.className == 'section'){
        chapterList.querySelector('.active').classList.remove('active')
        e.target.classList.add('active')
        current.textContent = `----${e.target.textContent}`
      }
    })
  }
})
