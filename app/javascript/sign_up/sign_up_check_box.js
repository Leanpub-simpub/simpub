
window.addEventListener('turbolinks:load',()=>{
  if(document.querySelector('[class="new_user"]')){
    let sign_up_form = document.querySelector('[class="new_user"]')
    let check_box = document.querySelector('[class="txt mr-2"][type="checkbox"]')
    let createBtn = document.querySelector('[value="Create Account"]')
    createBtn.addEventListener('click',(e)=>{
      e.preventDefault()
      // createBtn.removeAttribute('disabled')
      if(check_box.checked){
        sign_up_form.submit()
      }else{
        check_box.parentElement.style.color = 'red'
      }
      // createBtn.disabled = false

    })
  }
})

