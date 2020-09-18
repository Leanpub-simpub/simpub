const chapterTemplate = document.createElement("template");
chapterTemplate.innerHTML = `
    <div class="d-flex justify-content-between">
      <div class="chapter"></div>
      <div class="addsection">+</div>
    </div>
`
const sectionTemplate = document.createElement("template");
sectionTemplate.innerHTML = `
    <div class="section"></div>
`  
