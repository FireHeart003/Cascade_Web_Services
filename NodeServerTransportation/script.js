/*
* The main requirement is to install Node.js(visit link): https://nodejs.org/en/download
* Use "node script.js" to run the script
*/

const fs = require('fs');
const APIKey = "";
const fileId = "";

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";

// Initial call
updateCascadeFile();

// Runs every 5 minutes
setInterval(updateCascadeFile, 300000);

async function updateCascadeFile() {
    // Step 1: Read the XML file
    fs.readFile('sample.xml', 'utf8', async function(err, data) {
        if (err) {
            console.error('Error reading the XML file:', err);
            return;
        }

        console.log('XML File Read Successfully:\n', data);

        console.log('Beginning transfer to Cascade');
        
        // Step 2: Edit the XML file on Cascade
        try{
            const asset = await readAsset("file", fileId);
            asset.file.text = data;
            const status = await editAsset("file", fileId, asset);
            console.log("Transfer Success Status: "+ status.success);
            console.log("================================================================================");
        } 
        catch(error) {
            console.error(`: ${error}`);
        }
    });   
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

// Reads an asset given an id and type and returns a JSON object of the asset
async function readAsset(type,id) {
    var assetType = type;
    var assetID = id;
    try {
        console.log("Trying to read "+ id);
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