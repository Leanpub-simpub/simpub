window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#sourceTA') && document.querySelector('#targetDiv')){
    let chapterList = document.querySelector('.chapter_list')

    chapterList.addEventListener('dblclick',(e)=>{      
      if(e.target.className == 'chapter' || e.target.className == 'section'){
        
        console.log(1)
      }
    })
  }
})
