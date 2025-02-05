/*
If we're not on homepage
  check session storage to see if announcement is there if not:
    do the fetch
      store the announcement into session storage
if we are on the homepage
  do nothing
*/

 
const url = 'https://cnhs.fiu.edu/';
const announcement = document.querySelector('.fiu-announcement');
if (!announcement) {
  const storedBanner = sessionStorage.getItem("announcement");
  if (storedBanner) {
    insertBanner(storedBanner);
  } else {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const div = doc.querySelector('.fiu-announcement');
        if (div) {
          insertBanner(div.outerHTML);
          sessionStorage.setItem("announcement", div.outerHTML);
        }
      })
      .catch(err => {
        console.log('Error:', err);
      }); 
    }
  }
function insertBanner(banner) {
  const div = document.getElementById("main-content");
  if (div) {
    div.insertAdjacentHTML("beforebegin", banner);
  } else {
    console.log("main-content not found");
  }
}
 
 