const chapterTemplate = document.createElement("template");
chapterTemplate.innerHTML = `
    <div class="d-flex justify-content-between">
      <div class="chapter"></div>
      <div class="addsession">+</div>
    </div>
`
const sessionTemplate = document.createElement("template");
sessionTemplate.innerHTML = `
    <div class="session"></div>
`  

// window.addEventListener('turbolinks:load',async()=>{
  
//   let chapter_list = document.querySelector('.chapter_list')
//   if(chapter_list){
//     let bookName = document.querySelector('.book_name').textContent
//     const response = await fetch(`s3://simpubtest/store/book/${bookName}/structure.json`)
//     const posts = await response
//     console.log(response)
    


//   }
// })