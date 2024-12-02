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
            let siteOptions = readAsset("block",site.path.path + "/site-info");
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){
                    let name = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[0].text;
                    let blockId = asset.xhtmlDataDefinitionBlock.id;
                    let check;
                    console.log(asset);
                    if(asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[3].identifier === "fiu-brand-text"){
                        check = asset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[0].structuredDataNodes[3].text;
                        if(name.startsWith("FIU")){
                            displaySite(check, blockId, name, "output");            
                        }
                        else if(name.includes("FIU")){
                            displaySite(check, blockId, name, "output2");     
                        }
                        else if(name.includes("Florida International University")){
                            displaySite(check, blockId, name, "output3");    
                        }
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
}

function displaySite(check, blockId, name, output){
    if(check == "::CONTENT-XML-CHECKBOX::"){
        document.getElementById(output).innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><br>`;
    }
    else{
        document.getElementById(output).innerHTML += `<a href="https://cascade.fiu.edu/entity/open.act?type=block&id=${blockId}" target="_blank" rel="noopener noreferrer">${name}</a><span>&#10003;</span><br>`;
    }
}
 
async function step2(){
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