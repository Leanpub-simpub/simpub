import axios from "axios"
import Swal from "sweetalert2";

window.addEventListener("turbolinks:load", function () {
  if(document.querySelector('.book-box')){
    let bookcase = document.querySelector('.book-box')

    bookcase.addEventListener('click',(e)=>{
      if(e.target.className == 'download'){
        
        let bookName = e.target.parentElement.parentElement.querySelector('.book-title').textContent
        let params = {bookName:bookName}
        let token = document.querySelector("meta[name=csrf-token]").content
        axios.defaults.headers.common['X-CSRF-Token']= token
        axios({
          method: 'post',
          url: '/books/download_pdf.json',
          data: params
        })
        .then( (result)=>{
          let url = result.data['url']
          window.open(
            url,
            '_blank' // <- This is what makes it open in a new window.
          );
        })
        .catch(function(err){
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'This book is only for online-reading',
            showConfirmButton: true,
            // timer: 1000
          })
          
        })
      }

    })
  }

})