
window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('#sourceTA') && document.querySelector('#targetDiv')){
    let chapterList = document.querySelector('.chapter_list')
    let target
    let tableOfContent = document.querySelector('#tableOfContent')
    let renamebtn = document.querySelector('#rename')
    let deletebtn = document.querySelector('#delete')
    let deleteform = document.querySelector('#deleteform')
    let renameform = document.querySelector('#renameform')
    let renameDisAgree = document.querySelector('#renameDisAgree')
    let newName = document.querySelector('#newName')
    let deleteDisAgree = document.querySelector('#deleteDisAgree')
    let deleteinput = document.querySelector('#deleteinput')
    
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
        tableOfContent.classList.remove('x')
        tableOfContent.style.top = `${e.clientY}px`
        tableOfContent.style.left = `${e.clientX}px`

        // 點擊contextmenu 的 rename，顯示renameform
        renamebtn.addEventListener('click',()=>{
          renameform.classList.remove('x')
          deleteform.classList.add('x')
          renameform.querySelector('#currentName').textContent = target.textContent
          tableOfContent.classList.add('x')
        })
        
        // 點擊contextmenu 的 delete，顯示deleteform
        deletebtn.addEventListener('click',()=>{
          renameform.classList.add('x')
          deleteform.classList.remove('x')
          deleteform.querySelector('#deleteTarget').textContent = target.textContent
          tableOfContent.classList.add('x')
        })

        //  renameform 的 x 就把表單隱藏
        renameDisAgree.addEventListener('click',()=>{
          renameform.classList.add('x')
          renameform.querySelector('#currentName').textContent = ""
          newName.value = ""
        })

        //  deleteform 的 x 就把表單隱藏
        deleteDisAgree.addEventListener('click',()=>{
          deleteform.classList.add('x')
          renameform.querySelector('#deleteTarget').textContent = ""
          deleteinput.value = ""
        })

{/* <div class="x" id="deleteform">
  <p>Delete Your Chapter or Section</p>
  <div>
    <span>Delete Item</span>
    <span id="deleteTarget"></span>
  </div>
  <div>
  <label for="delete">Please type <b>DELETE</b> to confirm</label>
  <input id="deleteinput" type="text" name='delete' placeholder='Delete item name'>
  </div>
  <div class="text-center my-2">
    <span id="deleteAgree" class="btn formBtn">OK</span> 
    <span id="deleteDisAgree" class="btn formBtn">X</span>
  </div>
</div> */}

// <div class="x" id="renameform">
//   <p>Rename Your Chapter or Section</p>
//   <div>
//     <span>Current Name</span>
//     <span id="currentName"></span>
//   </div>
//   <div>
//     <label for="newName">New name</label>
//     <input id="newName" type="text" name='newName' placeholder='New name'>
//   </div>
//   <div class="text-center">
//     <span id="renameAgree"class="btn formBtn">OK</span> 
//     <span id="renameDisAgree" class="btn formBtn">X</span>
//   </div>
// </div> 


      }
    })
  }
})
