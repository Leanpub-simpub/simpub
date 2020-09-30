import axios from "axios"
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
    let renameAgree = document.querySelector('#renameAgree')
    let bookName = document.querySelector('.book_name').textContent
    document.addEventListener('click',(e)=>{
      if(document.querySelector('#tableOfContent')&& e.target != tableOfContent){
        tableOfContent.classList.add('x')
      }
    })
    
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
        let position = e.target.getBoundingClientRect()
        tableOfContent.style.top = `${position.y+20}px`
        tableOfContent.style.left = `${position.x+100}px`

        // 點擊contextmenu 的 rename，顯示renameform
        renamebtn.addEventListener('click',()=>{
          renameform.classList.remove('x')
          deleteform.classList.add('x')
          renameform.querySelector('#currentName').textContent = target.textContent
          if(target.className.match('chapter') != null){
            renameform.querySelector('p span').textContent ='Chapter'
          }else if(target.className.match('section') != null){
            renameform.querySelector('p span').textContent ='Section'
          }
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

        // 同意更改章節名稱
        renameAgree.addEventListener('click',(e)=>{
          e.preventDefault()
          e.stopPropagation()
          if(newName.value == ""){
            // 使用者沒填寫名稱就按送出
            newName.style.border = '1px solid red'
            newName.placeholder = 'New name can not be blank'
            setTimeout(function(){
              newName.style.border = '1px solid black'
              newName.placeholder = 'New name'
            }, 3000);
          }else{
            // 判斷目標是 chapter or section
            let chapterOrder
            let chapter
            let section
            let chapterName
            if(target.className.match('chapter') != null ){
              chapterOrder = target.dataset.order
              chapter = true
              section = false
              chapterName = target.textContent
            }else if (target.className.match('section') != null ){
              chapterOrder = target.dataset.chapterOrder
              chapter = false
              section = true
              chapterName= document.querySelector(`[data-order="${chapterOrder}"]`).textContent
            }
            let currentName = target.textContent
            let newName = document.querySelector('#newName').value
            // 收集好新增 chapter section 相關訊息朝後端打
            let params = {bookName:bookName,chapterOrder:chapterOrder,chapterName:chapterName,chapter:chapter,section:section,currentName:currentName,newName:newName}
            let token = document.querySelector("meta[name=csrf-token]").content
            axios.defaults.headers.common['X-CSRF-Token']= token
            
            axios({
              method: 'post',
              url: '/books/rename.json',
              data: params
            })
            .then( result=>{
              if(result.data['message']=="ok"){
                target.textContent = newName
                // 隱藏renameform
                renameform.classList.add('x')
                alert('Success to change name')
              }
            })
            .catch(function(err){
              console.log(err)
            })

          }
        })


        
      }
    })
  }
})
