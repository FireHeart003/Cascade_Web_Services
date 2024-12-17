/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getGroupUsers() {
    document.getElementById("output").textContent = "";
    const set = new Set(); // Store users in a set (no duplicates allowed)

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

            if (asset?.site?.roleAssignments?.[0]?.users) { // Checks if there are any users associated with the site id
                const roles = asset.site.roleAssignments; // Gets the array of users
                for (const role of roles) { // Loop through each role
                    if (role.users !== undefined) continue; // Ignore normal users

                    if (role.groups !== undefined) { // If there are groups
                        console.log(asset)
                        const nameArr = role.groups.split(","); // Names are in a string seperated by ','
                        for (const item of nameArr) { // Loop through each name and add them to the set
                            set.add(item);
                        }
                    }
                }
            }
        }

     // Call the finished function to output set
     finished(set);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// Generates the output
async function finished(set) {
    let htmlText = "";
    const nameSet = new Set();
    for (const value of set) { // Loop through each group name
        const response = await readAsset("group", value) // Get info of the users in the group
        console.log(response);
        const names = response.group.users;
        const nameArr = names.split(";");
        for(const name of nameArr){ // Loop through each name and add them to the set
            nameSet.add(name);
        }
    }
    console.log(nameSet)

    // Print out the email of the user
    for(const userName of nameSet){
        htmlText += userName + "@fiu.edu, ";
    }
    document.getElementById("output").innerHTML += htmlText;
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

// Creates an asset in Cascade
async function createAsset(asset) {
    try {
        var response = await fetch( createEP, {
            "headers": {
                "Authorization": "Bearer "+ APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "POST",
            "mode": "cors",
            "body": JSON.stringify({"asset":asset})
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        var json = await response.json();
        return json;

    } catch(error) {
        console.error(`: ${error}`);
    }
}

// Edits an asset in Cascade with the given parameters for the update
async function editAsset(type, id, asset) {
    try {
        let response = await fetch( editEP + "" + "/"+ type +"/" + id, 
            { 
                method: 'POST',
                headers: {"Authorization": "Bearer "+ APIKey},
                body: JSON.stringify({'asset': asset})
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        } 

        var json = await response.json();
        return json;
    

    } catch(error) {
        console.error(`: ${error}`);
        return {"success":false};
    }
}