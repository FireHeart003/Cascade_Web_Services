const url = 'https://cnhs.fiu.edu/';

const section = document.querySelector('[aria-label="Home Page Content"]')
if(section === null){
  const announcement = document.querySelectorAll('.fiu-announcement');
  if(announcement.length == 0){
    if(sessionStorage.getItem("announcement") !== ""){
      insertBanner(sessionStorage.getItem("announcement"))
    }
    else{
      fetch(url)
      .then(response => response.text())
      .then(html => {
       const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const div = doc.querySelector('.fiu-announcement');
        insertBanner(div.outerHTML);
        sessionStorage.setItem("announcement", banner);
      })
      .catch(err => {
        console.log('Error:', err); 
      });
    }
  }
}

function insertBanner(banner){
    var div = document.getElementById("main-content");
    console.log(div)
    div.insertAdjacentHTML("beforebegin", banner);    
}

/*
If we're not on homepage
  check session storage to see if announcement is there if not:
    do the fetch
      store the announcement into session storage
if we are on the homepage
  do nothing
*/
