const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";

const APIKey = config.API_KEY;

async function changeTags() {
    tags = [
        //Insert tag IDs
    ];

    cnt = 0;
    for(let i = 0; i< tags.length; i++){
        try {
            var json = await readAsset("page", tags[i]); //Read Asset

            arrTag = json.page.tags // Get array of tags

            for(let i = 0; i< arrTag.length; i++){
                if(arrTag[i].name === ''){ // If tag = 'Insert_Tag_Name'
                    console.log('deleting in progress');
                    arrTag[i].name = ''; //Edits a tag name
                    // arrTag.splice(i, 1); //Deletes a tag
                    // arrTag.push({"name": ""}); // Adds new tag
                    editAsset("page", tags[i], json);  //Edit asset
                    cnt += 1;
                    break;  
                }
            }
        } catch(error) {
            console.error(`: ${error}`);
        }
    }
    console.log("Deleted: " + cnt)

    const div = document.getElementById("status");
    const p = document.createElement("p");
    p.textContent = "Deleted: " + cnt;
    div.appendChild(p);

    publishPosts(tags)
}

async function publishPosts(tags){
    cnt = 0;
    pageId = tags;
    console.log("Total Pages to be Published: " + pageId.length);
    for(let i = 0; i< pageId.length; i++){
        try{
            asset = await publishAsset("page", pageId[i]);
            console.log(asset);
            cnt += 1;
        } 
        catch(error){
            console.error(`: ${error}`);
        }
    }
    console.log("Pages successfully published: " + cnt);
    const div = document.getElementById("status");
    const p = document.createElement("p");
    p.textContent = "Pages successfully published: " + cnt;
    div.appendChild(p);
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