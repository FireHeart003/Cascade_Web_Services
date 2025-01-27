$(document).foundation();
const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

// Gets all the site names that can be selected by user
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

/* 
Helper function to:
- get site info
- use the info to get folder Id
- get the info inside the folder
- add the listeners to each file/folder in current directory
*/
async function siteNameUpdater(){
    var siteId = this.value;
    folderId = await getSiteData(siteId);
    console.log(folderId);
    let text = await getRootFolder(folderId);
    document.getElementById("root").innerHTML = text;
    addListeners();
}

// Fetches site info
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


// Returns html for current directory
async function getRootFolder(folderId){
    let text = ''
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

        // console.log(json.asset.folder.children.length);
        for(const asset of json.asset.folder.children){
            if(asset.type === "folder"){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = ${asset.type}><i class = "fa-solid fa-folder"></i> ${asset.path.path}</a></li>`;
                text += `<ul id = "${asset.id}Content" class="hidden"></ul>`
            }
            else if(asset.type === "template"){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = ${asset.type}><i class = "fa-solid fa-table-cells-large"></i> ${asset.path.path}</a></li>`;
            }
            else if(asset.type === "format_XSLT"){
                text += `<li class="tab-title"><a href="#" id = ${asset.id} data-type = ${asset.type}><i class = "fa-solid fa-code"></i> ${asset.path.path}</a></li>`;
            }
            else if(asset.type.includes("block")){
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = ${asset.type}><i class = "fa-solid fa-cube"></i> ${asset.path.path}</a></li>`;
            }
            else{
                text += `<li class="tab-title"><a href="#" data-id = ${asset.id} data-type = ${asset.type}><i class = "fa-solid fa-file"></i> ${asset.path.path}</a></li>`;
            }
        }

        console.log(jsonText);
        return text;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// Adding the click listener for when user clicks on a file or folder
function addListeners(){
    var elements = document.getElementsByClassName('tab-title');
    for(var i = 0; i< elements.length; i++){
        elements[i].addEventListener('click', updater)
    }
}

// Gets sub folders and files within a folder OR shows the JSON object for other file formats
async function updater(event){
    console.log(event.target);
    console.log(event.target.dataset.type)
    type = event.target.dataset.type;
    const bar = document.getElementById('output-format');
    bar.style.display='Block';
    bar.addEventListener('change', formatChange);
    if(type === "folder"){
        let dirFolder = await getRootFolder(event.target.dataset.id);
        const folderContents = document.getElementById(event.target.dataset.id + "Content");
        if(folderContents){
            if(folderContents.classList.contains("hidden")){
                folderContents.classList.remove("hidden");
                folderContents.innerHTML = dirFolder;
            }
            else{
                folderContents.classList.add("hidden");
            }
        }
        addListeners();
    }
    else{
        const container = document.getElementById("results");
        container.innerHTML = "";
        const options = {};
        const editor = new JSONEditor(container, options)
        json = await readAsset(type, event.target.dataset.id)
        editor.set(json)
    }
}

async function formatChange(){
    let type = this.data;
    if(type === "XML"){

    }
    else{
        const container = document.getElementById("results");
        container.innerHTML = "";
        const options = {};
        const editor = new JSONEditor(container, options)
        json = await readAsset(type, event.target.dataset.id)
        editor.set(json)
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