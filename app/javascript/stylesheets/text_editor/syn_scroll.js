window.addEventListener('turbolinks:load',()=>{
<<<<<<< HEAD
  
  if(document.querySelector('#targetDiv')){
    let codemirror = document.querySelector('.CodeMirror-scroll')
    let markdownIt = document.querySelector('#targetDiv')

=======
  if(document.querySelector('#targetDiv')){
    let codemirror = document.querySelector('.CodeMirror-scroll')
    let markdownIt = document.querySelector('#targetDiv')
  
>>>>>>> frontend
    codemirror.addEventListener('mousewheel',()=>{
      let leftHight = codemirror.scrollHeight
      let currentY = codemirror.scrollTop
      let currentX = codemirror.scrollLeft
<<<<<<< HEAD
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
=======
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
>>>>>>> frontend
    })
  }
})