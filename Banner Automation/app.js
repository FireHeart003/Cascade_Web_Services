const url = 'https://cnhs.fiu.edu/';

fetch(url)
  .then(response => response.text())
  .then(html => {
   const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const divs = doc.querySelectorAll('.fiu-announcement');
    divs.forEach((div) => {
      insertBanner(div.outerHTML)
    });
  })
  .catch(err => {
    console.log('Error:', err); 
  });

function insertBanner(banner){
    var div = document.getElementById("main-content");
    console.log(div)
    div.insertAdjacentHTML("beforebegin", banner);    
}


