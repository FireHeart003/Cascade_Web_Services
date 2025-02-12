const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

$(document).foundation();

let table = new DataTable('#myTable',{
    "createdRow": function(row, data){
        console.log(data[3])
        if (data[1] >= 1000) {
            row.classList.add('yellow');
        }
        if(data[3] == "<ul>None</ul>"){
            row.classList.remove('yellow')
            row.classList.add('red');
        }
    }
});

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
        document.getElementById("siteOutput").addEventListener('change', loopFolder);
    } catch(error) {
        console.error(`: ${error}`);
    }
}

async function loopFolder(){
    table.clear().draw();
    document.getElementById("status").innerText = "Loading...";
    contents = await readAsset("site", this.value);
    await realRecurrsion(contents.site.rootFolderId);
    document.getElementById("status").innerText = "Finished!";
}

async function realRecurrsion(folderId){
    json = await readAsset("folder", folderId);
    for(const asset of json.folder.children){
        if(asset.type === "folder"){
           await realRecurrsion(asset.id);
        }
        else if(asset.type === "file"){
            let file = await readAsset(asset.type, asset.id);
            let ext = file.file.name.slice(-4);
            const img = file.file;
            if(ext === ".bmp" || ext === ".jpeg" || ext === ".jpg" || ext === ".png" || ext === ".webp"){
                console.log(file);
                div = document.getElementById("tableRow");
                let rowData = [];

                //File name with Link
                let create = img.createdBy;
                let path = img.path;
                rowData.push(`<a href = "https://cascade.fiu.edu/entity/open.act?id=${img.id}&type=file" target = "_blank">${img.name}</a>`);
                
                //File size
                let imgSize = (img.data.length / 1024).toFixed(0);
                rowData.push(`${imgSize}`)

                //Who uploaded? Article referencing image and the article's path
                let relationships = await checkRelationships("file", img.id);
                rowData.push(create)
                let text = '';
                text +=('<ul>')
                let subs = relationships.subscribers;
                if(subs.length === 0){
                    text += "None"
                }
                else{
                    for(const sub of subs){
                        text += (`<li><a href = "https://cascade.fiu.edu/entity/open.act?id=${sub.id}&type=page" target = "_blank">Article Path: ${sub.path.path}</a></li>`);
                    }
                }
                text += "</ul>"
                rowData.push(text)

                table.rows.add([rowData]).draw();
            }
        }
    }
}



// File name with link, file size, who uploaded, article referencing photo
/*
Initialize outisde of function an image[]
Use folder id
    Access the children of each folder
        If type === folder
            loopFolder(new folder Id)
        else if type == file
            readAsset of file using(id)
                if name ends with one of the extensions
                    image.push(parentFolderPath + ":" + name)

*/


// Checks for any relationships and return the array of relationships for the file
async function checkRelationships(type, fileId) { 
    try {
        const response = await fetch(cascadeEP + "/api/v1/listSubscribers/" + type+ "/" + fileId, {
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

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(`Error: ${error}`);
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