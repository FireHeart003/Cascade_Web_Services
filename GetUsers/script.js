const cascadeEP = "https://cascade.fiu.edu";
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getSiteUsers() { // Gets Site Users and output them to the page
    document.getElementById("output").textContent = ""; 
    try {
        // Fetch all the sites given the API Key
        var response = await fetch( cascadeEP + "/api/v1/listSites" , {
            "headers": {
                "Authorization": "Bearer "+ APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors"
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert result to json
        var json = await response.json();
        
        // loop through the data in the json variable 
        json.sites.forEach(site => {
            let siteOptions = readAsset("site",site.id); // Read the site info
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){ // If the site/asset exists
                    if (typeof asset.site.roleAssignments[0]?.users !== 'undefined'){ // Checks if the users array exist
                        let siteId = asset.site.rootFolderId;
                        let name = asset.site.name;
                        var roles = asset.site.roleAssignments;
                        let htmlText = '' // htmlText to output to the screen
                        htmlText += `   
                            <li>
                                <strong><a href="https://cascade.fiu.edu/entity/open.act?type=folder&id=${siteId}" target="_blank" rel="noopener noreferrer">${name}</a><br></strong>
                            <ul>
                        `;
                        for(var i = 0; i<roles.length; i++){ // For loop going through the roles array of the users array
                            if(roles[i].groups !== undefined){ // Checks if there are any groups
                                console.log(roles[i])
                                var name_arr = roles[i].groups.split(','); // Name of groups are in a string seperated by commas, so we create an array of these names using split(',')
                                console.log(name_arr);
                                for(let item of name_arr){ // Loop through the array of names
                                    htmlText += `<li>${item}</li>`; // Outputs them as a list
                                }
                            }
                            if(roles[i].users !== undefined){ // Checks if there are any users
                                var name_arr = roles[i].users.split(','); // Name of users are in a string seperated by commas, so we create an array of these names using split(',')
                                console.log(name_arr)
                                for(let item of name_arr){ // Loop through the array of names
                                    htmlText += `<li>${item}</li>`; // Outputs them as a list
                                }
                            }
                        }
                        document.getElementById("output").innerHTML += htmlText + `</ul></li>`; // Output to the index.html "output" id
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
}

async function getSetUsers() { // Get all the users, adds them to a set
    document.getElementById("output").textContent = "";
    const set = new Set(); // Create a set for the users

    try {
        // Fetch all the sites given the API Key
        const response = await fetch(cascadeEP + "/api/v1/listSites", {
            headers: {
                Authorization: "Bearer " + APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        // Convert result to json
        const json = await response.json();

        // Process sites sequentially
        for (const site of json.sites) {
            const asset = await readAsset("site", site.id); // Read the site info

            if (asset?.site?.roleAssignments?.[0]?.users) { // Checks if the users array exist
                const roles = asset.site.roleAssignments;  // Gets the users array
                for (const role of roles) { // Loop through each role/element of the array
                    if (role.groups !== undefined) continue; // Ignore users in groups
                    
                    if (role.users !== undefined) { // If the role is a user
                        console.log(asset)
                        const nameArr = role.users.split(","); // Name of users are in a string seperated by commas, so we create an array of these names using split(',')
                        for (const item of nameArr) { // Loop through each name
                            set.add(item); // Add name to the set
                        }
                    }
                }
            }
        }

        // Call the finished function to print output
        finished(set);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function finished(set) { // Given a set, output each user with their email and output to the page
    let htmlText = "";
    for (const value of set) { // Loop through the set and add to htmlText the email of the user
        htmlText += value + "@fiu.edu, ";
    }
    document.getElementById("output").innerHTML += htmlText; // Output to the index.html "output" id 
    console.log(htmlText);
}


// Reads an asset given an id and type and returns a JSON object of the asset
async function readAsset(type,id) {
    var assetType = type;
    var assetID = id;
    try {
        console.log("trying to read "+ id);
        var response = await fetch( readEP + "/"+assetType+"/" + assetID, {
            "headers": {
                "Authorization": "Bearer "+ APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "GET",
            "mode": "cors"
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        var json = await response.json();
        return json.asset;

    } catch(error) {
        console.error(`: ${error}`);
    }
}
/*
async function processItems(items) {
  for (const item of items) {
    try {
      const result = await callApi(item); // Call the API and wait for the response
      console.log(`Processed item: ${item}, Result: ${result}`);
    } catch (error) {
      console.error(`Error processing item: ${item}, Error: ${error}`);
    }
  }
}

async function callApi(item) {
  // Simulating an API call with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`API response for ${item}`);
    }, 1000);
  });
}

// Example usage
const items = ['item1', 'item2', 'item3'];
processItems(items).then(() => console.log('All items processed!'));
*/
