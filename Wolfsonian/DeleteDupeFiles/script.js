/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;
let temp;

async function deleteDupes() { 
    let htmlText = '';
    folderId = "";
    siteName = "";
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
        cnt = 0

        // For loop going through contents of the folder
        for(let i = 0; i< json.asset.folder.children.length; i++){
            const asset = json.asset.folder.children[i];

            //If the content type is a file, check to see if there are any relationships
            if(asset.path.path.includes("1.")){ 
                const subs = await checkRelationships(asset.id); 
                temp = subs

                console.log(subs);
                console.log(asset.path.path);

                if(subs && subs.length < 1 ){ 
                    cnt += 1;
                    const del = await deleteAsset(asset.id);
                    console.log(del)
                    htmlText += `Deleting file: ${asset.path.path}<br>`
                }
            }
        }
        if(htmlText === ""){ // Debugging to check if the folder is empty
            console.log("empty")
        }
        document.getElementById("output").innerHTML += htmlText;
        console.log(cnt)
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