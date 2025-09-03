const cascadeEP = "https://cascade.fiu.edu";
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getAllUsers() { // Get all the users, adds them to a set
    document.getElementById("output").textContent = "";
    const users = {};
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
            if (site.path.path.includes("CASE")) {
                const asset = await readAsset("site", site.id); // Read the site info

                if (asset?.site?.roleAssignments?.length > 0) { // Checks if the users array exist
                    const roles = asset.site.roleAssignments;  // Gets the users array
                    const set = new Set(); // Create a set for the users
                    const siteName = site.path.path;

                    for (const role of roles) { // Loop through each role/element of the array
                        if (role.groups !== undefined) { // If role is a group
                            const nameArr = role.groups.split(","); // Names are in a string seperated by ','
                            for (const item of nameArr) { // Loop through each name and add them to the set
                                const response = await readAsset("group", item) // Get info of the users in the group
                                const names = response.group.users;
                                const nameArr = names.split(";");
                                for (const name of nameArr) { // Loop through each name and add them to the set
                                    set.add(name);
                                }
                            }
                        }

                        if (role.users !== undefined) { // If the role is a user
                            const nameArr = role.users.split(","); // Name of users are in a string seperated by commas, so we create an array of these names using split(',')
                            for (const item of nameArr) { // Loop through each name
                                set.add(item); // Add name to the set
                            }
                        }
                    }
                    const cnt = set.size;
                    users[siteName + `(${cnt})`] = Array.from(set);
                }

            }
        }

        // Call the finished function to print output
        finished(users);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function oneSite() { // Get all the users, adds them to a set for ONE site
    document.getElementById("output").textContent = "";
    const set = new Set(); // Create a set for the users
    const json = [''];
    try {
        // Process sites sequentially
        for (const site of json) {
            const asset = await readAsset("site", site); // Read the site info

            if (asset?.site?.roleAssignments?.length > 0) { // Checks if the users array exist
                const roles = asset.site.roleAssignments;  // Gets the users array
                for (const role of roles) { // Loop through each role/element of the array
                    if (role.groups !== undefined) { // If role is a group
                        const nameArr = role.groups.split(","); // Names are in a string seperated by ','
                        for (const item of nameArr) { // Loop through each name and add them to the set
                            const response = await readAsset("group", item) // Get info of the users in the group
                            const names = response.group.users;
                            const nameArr = names.split(";");
\                            for (const name of nameArr) { // Loop through each name and add them to the set
                                set.add(name);
                            }
                        }
                    }

                    if (role.users !== undefined) { // If the role is a user
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

function finished(users) { // With JSON, output each user with their email and output to the page
    let htmlText = "";
    for (const siteName in users) { // Loop through the JSON and add to htmlText
        htmlText += `<h3>${siteName}</h3>`;
        htmlText += "<ul>";
        for(const userName of users[siteName]){
            htmlText += `<li>${userName}@fiu.edu</li>`;
        }
        htmlText += "</ul>";
    }
    document.getElementById("output").innerHTML += htmlText; // Output to the index.html "output" id 
    console.log(users);
}

// Reads an asset given an id and type and returns a JSON object of the asset
async function readAsset(type, id) {
    var assetType = type;
    var assetID = id;
    try {
        console.log("trying to read " + id);
        var response = await fetch(readEP + "/" + assetType + "/" + assetID, {
            "headers": {
                "Authorization": "Bearer " + APIKey,
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

    } catch (error) {
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
