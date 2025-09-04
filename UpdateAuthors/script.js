/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish"
const APIKey = config.API_KEY;
const posts = []

async function getSites() {
        for(let i = 0; i<posts.length; i++){
            try{
                //Read each page and update the node for name with the author + middle name
                asset = await readAsset("page", posts[i]);
                asset.page.structuredData.structuredDataNodes[3].text = "Gisela Maria Valencia";
                console.log(asset.page.structuredData.structuredDataNodes[3].text);
                editAsset("page",posts[i],asset);
            } catch(error){
                console.error(`: ${error}`);
            }
        }        
}

async function publishSites() {
    for(let i = 0; i<posts.length; i++){
        try{
            asset = await publishAsset("page", posts[i]);
            console.log(asset)
        } catch(error){
            console.error(`: ${error}`);

        }
    }        
}

// Publishes an asset in Cascade 
async function publishAsset(type, id) {
    try {
        let response = await fetch( publishEP + "" + "/"+ type +"/" + id, { 
            "headers": {
                "Authorization": "Bearer "+ APIKey,
                "Access-Control-Allow-Origin": "*"
                },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "mode": "cors"
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

