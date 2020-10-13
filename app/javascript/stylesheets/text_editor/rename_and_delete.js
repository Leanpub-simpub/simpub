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
    let renameAgree = document.querySelector('#renameAgree')
    let renameDisAgree = document.querySelector('#renameDisAgree')
    let renameformErr = document.querySelector('#renameformErr')
    let newName = document.querySelector('#newName')
    let deleteAgree = document.querySelector('#deleteAgree')
    let deleteDisAgree = document.querySelector('#deleteDisAgree')
    let deleteformErr = document.querySelector('#deleteformErr')
    let deleteinput = document.querySelector('#deleteinput')
    let bookName = document.querySelector('.book_name').textContent
    let chapterOrder
    let chapter
    let section
    let chapterName
    
    document.addEventListener('click',(e)=>{
      if(document.querySelector('#tableOfContent')&& e.target != tableOfContent){
        tableOfContent.classList.add('x')
      }
    })
    
    //關掉瀏覽器預設的contextmenu
    chapterList.addEventListener('contextmenu',(e)=>{
      e.preventDefault();
      // 紀錄點選到的目標是誰，後續表單操作會用到
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
          deleteform.querySelector('#deleteTarget').textContent = ""
          deleteinput.value = ""
        })

        // 同意更改章節名稱
        renameAgree.addEventListener('click',(e)=>{
          e.preventDefault()
          e.stopPropagation()
          if(newName.value == ""){
            // 使用者沒填寫名稱就按送出
            newName.style.border = '1px solid red'
            renameformErr.textContent = 'New name can not be blank'
            setTimeout(function(){
              newName.style.border = '1px solid black'
              renameformErr.textContent =""
            }, 3000);
          }else{
            // 判斷目標是 chapter or section
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
                renameformErr.textContent =""
                alert('Success to change name')
              }
            })
            .catch(function(err){
              alert('Fail to change name')
            })
          }
        })

        // 確認刪除
        deleteAgree.addEventListener('click',(e)=>{
          e.preventDefault()
          e.stopPropagation()
          if(deleteinput.value == ""){
            // 當使用者沒有填寫輸入框
            deleteinput.style.border = '1px solid red'
            deleteformErr.textContent = 'Please type DELETE'
            setTimeout(function(){
              deleteinput.style.border = '1px solid black'
              deleteformErr.textContent = ''
            },5000)
          }else if(deleteinput.value != "DELETE"){
            // 使用者填寫錯誤
            deleteinput.style.border = '1px solid red'
            deleteformErr.textContent = 'Please comfirm again'
            setTimeout(function(){
              deleteinput.style.border = '1px solid black'
              deleteformErr.textContent = ''
            },5000)
          }else{
            // 使用者正確填寫輸入框
            let sectionBelongToChapter=[]
            if(target.className.match('chapter') != null ){
              // 使用者要修改的是 chapter
              chapterOrder = target.dataset.order
              chapter = true
              section = false
              chapterName = target.textContent
              document.querySelectorAll(`[data-chapter-order="${chapterOrder}"]`).forEach((section)=>{
                sectionBelongToChapter.push(section.textContent)
              })
            }else if (target.className.match('section') != null ){
              // 使用者要修改的是 section
              chapterOrder = target.dataset.chapterOrder
              chapter = false
              section = true
              chapterName= document.querySelector(`[data-order="${chapterOrder}"]`).textContent
            }
            let token = document.querySelector("meta[name=csrf-token]").content
            axios.defaults.headers.common['X-CSRF-Token']= token
            // 收集刪除所需相關資料
            let params = {bookName:bookName,chapterOrder:chapterOrder,chapterName:chapterName,chapter:chapter,section:section,target:target.textContent,allSection:sectionBelongToChapter}

            axios({
              method: 'post',
              url: '/books/delete_chapter_or_section.json',
              data: params
            })
            .then( result=>{
              // 隱藏renameform
              deleteform.classList.add('x')
              deleteformErr.textContent =""
              if (target.className.match('section') != null ){
                target.remove()
              }else if(target.className.match('chapter') != null ){
                document.querySelectorAll(`[data-chapter-order="${chapterOrder}"]`).forEach((section)=>{
                  section.remove()
                })
                target.parentElement.remove()
              }
            })
            .catch(function(err){
            })
            // // 更改 chapter and section 編號
            let allChapter = document.querySelectorAll('.chapter')
            let collet = []
            
            for(let i = 0; i< allChapter.length;i++){
              if(allChapter[i]!=target){
                collet.push(allChapter[i])
              }
            }
            for(let i = 0; i < collet.length; i++){
              let index =  collet[i].dataset.order
              collet[i].dataset.order = i
              let allSection = document.querySelectorAll(`[data-chapter-order='${index}']`)
              
              if(allSection.length!=0 ){
                allSection.forEach(section =>{
                  section.dataset.chapterOrder = i
                })
              }
            }
          }
        })
      }
    })
  }
})
