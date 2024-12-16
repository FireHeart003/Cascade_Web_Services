/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;
let temp;

async function getFolder() { // Gets Folder ID and goes through the files, checking for relationships. If no relationships are found, the file is deleted 
    let htmlText = '';
    folderId = document.getElementById("folderId").value;
    siteName = document.getElementById("siteName").value;
    console.log(folderId)
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

        // For loop going through contents of the folder
        for(const asset of json.asset.folder.children){
            //If the content type is a file, check to see if there are any relationships
            if(asset.type === "file"){ 
                // Calls checkRelationships method, returning an array
                const subs = await checkRelationships(asset.id); 

                temp = subs; // Only used for debugging purposes

                // If there is only one element in the array, meaning that there is not any relationship, delete the file
                if(subs.length === 1 && subs[0].path.siteName === siteName){ 
                    console.log(subs);
                    const del = await deleteAsset(asset.id);
                    console.log(del)
                    htmlText += `Deleting file: ${asset.path.path} : ${subs[0].path.siteName}<br>`
                }
            }
        }
        if(htmlText === ""){ // Debugging to check if the folder is empty
            console.log("empty")
        }
        document.getElementById("output").innerHTML += htmlText;
    } catch (error) {
        console.error(`Error: ${error}`);
        console.log(temp)
    }
}

// Deletes the asset by calling the Cascade API by calling the Cascade API Endpoint
async function deleteAsset(fileId) { 
    try {
        const del = await fetch(cascadeEP + "/api/v1/delete/file/" + fileId, {
            headers: {
                Authorization: "Bearer " + APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            method: "GET",
            mode: "cors"
        });
        return del;
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

// Checks for any relationships and return the array of relationships for the file by calling the Cascade API Endpoint
async function checkRelationships(fileId) { 
    try {
        const response = await fetch(cascadeEP + "/api/v1/listSubscribers/file/" + fileId, {
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
        return json.subscribers;
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