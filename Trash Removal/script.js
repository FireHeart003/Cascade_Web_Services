const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

// Updates site to have a recycleBinExpiration of 30 days
async function trash() {
    document.getElementById("output").textContent = "";
    try {
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
        var json = await response.json();
        
        //loop through the data in the json variable and output the name of the site 
        json.sites.forEach(site => {
            let siteOptions = readAsset("site",site.id); // Read the site info 
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){ // Checks if the asset exists
                    console.log(asset);
                    let check = asset.site.recycleBinExpiration;
                    let name = asset.site.name;
                    let siteId = site.id;
                    if(check != "30"){ // Checks if the recycleBinExpiration is not set to 30 days
                        asset.site.recycleBinExpiration = "30"; // Set the recyleBinExpiration to 30 days for the asset

                        // Call the editAsset method to update the asset with a recycleBinExpiration of 30 days
                        editAsset("site", siteId, asset).then((data) =>{ 
                            if(data.success === true){ // Outputs the name of the website as a link if asset was successfully edited
                                document.getElementById("output").innerHTML += `<a href="https://cascade.fiu.edu/site/open.act?action=edit&id=${siteId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
                                console.log("Successfully edited" + name);
                            }else{
                                console.log(data);
                            }
                        });
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
}

// Manually testing a site
async function getSites2() {
    document.getElementById("output").textContent = "";
    try {
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
        var json = await response.json();
        
        //loop through the data in the json variable and output the name of the site 
            let siteOptions = readAsset("site","Insert site id here");
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){
                    console.log(asset);
                    let check = asset.site.recycleBinExpiration;
                    let name = asset.site.name;
                    let siteId = "insert site id here";
                    if(check != "30"){
                        asset.site.recycleBinExpiration = "30";
                        editAsset("site", siteId, asset).then((data) =>{
                            if(data.success === true){
                                document.getElementById("output").innerHTML += `<a href="https://cascade.fiu.edu/site/open.act?action=edit&id=${siteId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
                                console.log("Successfully edited" + name);
                            }else{
                                console.log(data);
                            }
                        });
                    }
                }
            })   
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