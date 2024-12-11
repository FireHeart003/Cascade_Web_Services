/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getSites() {
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
            let siteOptions = readAsset("block",site.path.path + "/site-info"); // Read the site info block
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){ // Checks if the asset exists
                    let name = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[0].text; // Gets the name of the asset for the output
                    let blockId = asset.xhtmlDataDefinitionBlock.id; // Gets the id of the block for the output
                    let check;
                    if(blockId == "c55ad89d0a73710b1e08b2e64d00221a"){
                        console.log(asset);
                    }
                    if(asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[3].identifier === "fiu-brand-text"){ // Checks if "Add 'FIU' brand text to meta title" is an option avaialble
                        check = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[3].text; // Gets the value that determines if the "Add 'FIU' brand text to meta title" is selected or not
                        if(name.startsWith("FIU")){ // Checks if website name starts with FIU
                            displaySite(check, blockId, name, "output");  // Displays the site if "Add 'FIU' brand text to meta title" is selected or not
                        }
                        else if(name.includes("FIU")){ // Checks if website name includes FIU
                            displaySite(check, blockId, name, "output2"); // Displays the site if "Add 'FIU' brand text to meta title" is selected or not 
                        }
                        else if(name.includes("Florida International University")){ // Checks if website name includes Florida International University
                            displaySite(check, blockId, name, "output3"); // Displays the site if "Add 'FIU' brand text to meta title" is selected or not
                        }
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
}

// Displays the site if "Add 'FIU' brand text to meta title" is selected or not
function displaySite(check, blockId, name, output){
    if(check == "::CONTENT-XML-CHECKBOX::"){ // Checks if checkbox is NOT selected and outputs the name of the website as a link to site-info block of site
        document.getElementById(output).innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
    }
    else{ // Checkbox IS selected and outputs the name of the website as a link to site-info block of site with a checkmark 
        document.getElementById(output).innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><span>&#10003;</span><br>`;
    }
}
// Function that outputs sites that have FIU or Florida International University in the site name
async function checkFiuNames(){
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
            let siteOptions = readAsset("block",site.path.path + "/site-info");
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){
                    let name = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[0].text;
                    if(name.startsWith("FIU")){
                        console.log(asset);
                        let blockId = asset.xhtmlDataDefinitionBlock.id;
                        document.getElementById("output").innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
                    }
                    else if(name.includes("FIU")){
                        let blockId = asset.xhtmlDataDefinitionBlock.id;
                        document.getElementById("output2").innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
                    }
                    else if(name.includes("Florida International University")){
                        let blockId = asset.xhtmlDataDefinitionBlock.id;
                        document.getElementById("output3").innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
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

// Creates asset on Cascade given parameters for the asset
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