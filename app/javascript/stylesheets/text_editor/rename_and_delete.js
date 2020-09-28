const contextmenu = document.createElement('template')
contextmenu.innerHTML=`
<div id="tableOfContent">
  <div id="rename">Rename</div>
  <div id="delete">Delete</div>
</div>
`

window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#sourceTA') && document.querySelector('#targetDiv')){
    let chapterList = document.querySelector('.chapter_list')
    let target
    //關掉瀏覽器預設的contextmenu
    chapterList.addEventListener('contextmenu',(e)=>{
      e.preventDefault();
      target = e.target

      //叫出contextmenu後，點擊contextmenu以外的地方就清除掉
      if( document.querySelector('#tableOfContent') && e.target != document.querySelector('#tableOfContent')){
        document.querySelector('#tableOfContent').classList.add('x')
      }

      // 使用者必須在class是 chapter or section 的物件上按右鍵 才可以叫出contextmenu
      if(e.button==2 && ( e.target.className.match('chapter') != null || e.target.className.match('section') != null ) && e.target.className != 'chapter_list'){
        let tableOfContent = document.querySelector('#tableOfContent')
        let renamebtn = document.querySelector('#rename')
        let deletebtn = document.querySelector('#delete')

        tableOfContent.classList.remove('x')
        tableOfContent.style.top = `${e.clientY}px`
        tableOfContent.style.left = `${e.clientX}px`

        // 點擊contextmenu 的 delete，做出deleteform
        let deleteform = document.querySelector('#deleteform')
        let renameform = document.querySelector('#renameform')
        deletebtn.addEventListener('click',()=>{
          renameform.classList.add('x')
          deleteform.classList.remove('x')
          deleteform.querySelector('#deleteTarget').textContent = target.textContent
          tableOfContent.classList.add('x')
        })

        renamebtn.addEventListener('click',()=>{
          renameform.classList.remove('x')
          deleteform.classList.add('x')
          renameform.querySelector('#currentName').textContent = target.textContent
          tableOfContent.classList.add('x')
        })
      }
    })
  }
})
