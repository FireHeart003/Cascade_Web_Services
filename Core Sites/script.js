const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getSites() { // Outputs all Core Sites to the page
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
        
        //loop through the data in the json variable and output the name of the site 
        json.sites.forEach(site => {
            let siteOptions = readAsset("block",site.path.path + "/site-info");  // Read the site info block
            console.log(site);
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){ // Checks if the asset exists
                    let name = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[0].text; // Gets the name of the asset for the output
                    console.log(asset);
                    if(asset.xhtmlDataDefinitionBlock.structuredData.definitionPath === "CDN:core/site-info"){ //Checks if the definitionPath of asset is a core site
                        // Outputs the name of the website as a link to parent folder of site
                        let id = asset.xhtmlDataDefinitionBlock.parentFolderId;
                        document.getElementById("output").innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?id=${id}&type=folder" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
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