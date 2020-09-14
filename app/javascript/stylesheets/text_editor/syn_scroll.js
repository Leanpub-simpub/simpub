window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#targetDiv')){
    let codemirror = document.querySelector('.CodeMirror-scroll')
    let markdownIt = document.querySelector('#targetDiv')
  
    codemirror.addEventListener('mousewheel',()=>{
      let leftHight = codemirror.scrollHeight
      let currentY = codemirror.scrollTop
      let currentX = codemirror.scrollLeft
      let rightHight = markdownIt.scrollHeight
      let rightMoveTo = (currentY/leftHight) * rightHight
      markdownIt.scrollTo(currentX,rightMoveTo)  
    })
  
    markdownIt.addEventListener('mousewheel',()=>{
        let rightHight = markdownIt.scrollHeight
        let currentY = markdownIt.scrollTop
        let currentX = markdownIt.scrollLeft
        let leftHight = codemirror.scrollHeight
        let leftMoveTo = (currentY/rightHight)* leftHight
        codemirror.scrollTo(currentX,leftMoveTo)
    })
  }
})