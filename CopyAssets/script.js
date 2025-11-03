const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";

const APIKey = config.API_KEY;
sourceBlock = "";
newBlock = "";
sourcePage = "";
newPage = "";

async function copyAsset(){
    var sourceJson = await readAsset("page", sourcePage);
    var newJson = await readAsset("page", newPage);
    newJson.page.structuredData = sourceJson.page.structuredData;
    let editResponse = await editAsset("page", newPage, newJson);
    console.log(editResponse);
}   

async function copyBlock(){
    var sourceJson = await readAsset("block", sourceBlock);
    var newJson = await readAsset("block", newBlock);
    console.log(sourceJson);
    newJson.xhtmlDataDefinitionBlock.structuredData = sourceJson.xhtmlDataDefinitionBlock.structuredData;
    let editResponse = await editAsset("block", newBlock, newJson);
    console.log(editResponse);
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