const puppeteer = require('puppeteer');
const fs = require('fs');
async function scrape() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = "";

    // Navigate the page to a URL
    await page.goto('');
    
    console.log('Current page URL:', page.url());
    const profiles = await page.evaluate(() => {
      return searchableList.items;
    })
//   console.log(profiles);
  await browser.close();
  
  let data = []
  cnt = 0
  for(let profile of profiles){
    let values = profile['_values']
    let startIndex = values.query.indexOf("_self") + 7;
    let endIndex = 0;
    if(values.query.substring(startIndex).indexOf(",") !== -1){
        firstName = values.query.substring(startIndex); 
        endIndex = startIndex + firstName.indexOf(",");
    }
    else{
        endIndex = values.query.indexOf("</a>");
    }
    let name = values.query.substring(startIndex, endIndex);

    let department = "";
    if(values.affiliate){
        department = values.affiliate;
    }
    else{
        department = values["department--school"];
    }
    let deptStart = values.query.indexOf("href");
    let deptEnd = values.query.indexOf('" target');
    let link = url + values.query.substring(deptStart + 6, deptEnd)
    
    data.push([name, department, link])
  }
  console.log(data)
  let csvContent = "Name, Department/Affiliate, Link\n";
  for(let dataRow of data){
    let row = dataRow.join(",");
    csvContent += row + "\n";
  }
  fs.writeFileSync('output.csv', csvContent);
}
scrape();