$(document).foundation();
const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getSites() {
    let htmlText = `<option value="Select a Site">Select a Site</option>`;
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
            let name = site.path.path; // Gets the name of the asset for the output
            let siteId = site.path.siteId
            htmlText += `<option value = "${siteId}">${name}</option>`;
        });   
        document.getElementById("siteOutput").innerHTML = htmlText;
        document.getElementById("siteOutput").addEventListener('change', siteNameUpdater);
        console.log("hi" + htmlText)
    } catch(error) {
        console.error(`: ${error}`);
    }
}

async function siteNameUpdater(){
    var siteId = this.value;
    folderId = await getSiteData(siteId);
    console.log(folderId)
    getRootFolder(folderId)
}

async function getSiteData(siteId){
    try {
        // Fetch all the files inside a folder given the folder ID
        const response = await fetch(cascadeEP + "/api/v1/read/site/" + siteId, {
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
        
        return json.asset.site.rootFolderId;
    }catch (error) {
            console.error(`Error: ${error}`);
    }
}

async function getRootFolder(folderId){
    let text = 'Directory'
    let jsonText = ''
    try {
        // Fetch all the files inside a folder given the folder ID
        const response = await fetch(cascadeEP + "/api/v1/read/folder/" + folderId, {
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
        jsonText = JSON.stringify(json, undefined, 4);

        console.log(json.asset.folder.children.length);
        for(const asset of json.asset.folder.children){
            if(asset.type === "folder"){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = "folder"><i class = "fa-solid fa-folder"></i> ${asset.path.path}</a></li>`;
            }
            else if(asset.type === "template"){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = "template"><i class = "fa-solid fa-table-cells-large"></i> ${asset.path.path}</a></li>`;
            }
            else if(asset.type === "format_XSLT"){
                text += `<li class="tab-title"><a href="#" id = ${asset.id} data-type = "format_XSLT"><i class = "fa-solid fa-code"></i> ${asset.path.path}</a></li>`;
            }
            else if(asset.type.includes("block")){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = "block"><i class = "fa-solid fa-cube"></i> ${asset.path.path}</a></li>`;
            }
            else{
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = "file"><i class = "fa-solid fa-file"></i> ${asset.path.path}</a></li>`;
            }
        }
        document.getElementById("root").innerHTML = text;
        console.log(jsonText)
        addListeners();
        // document.getElementById("currDir").textContent = jsonText;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

function addListeners(){
    var elements = document.getElementsByClassName('tab-title');
    for(var i = 0; i< elements.length; i++){
        elements[i].addEventListener('click', updater)
    }
}

async function updater(event){
    console.log(event.target);
    console.log(event.target.dataset.type)
    type = event.target.dataset.type;
    // if(type === )
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