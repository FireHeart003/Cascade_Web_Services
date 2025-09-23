const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";
const copyEP = cascadeEP + "/api/v1/copy";
const APIKey = config.API_KEY;

const blocks = config.blocks;
const del = config.del;
let operations = 0;

async function performTraversal() {
    document.getElementById("pageRelationship").innerHTML += "<ul>";
    document.getElementById("otherRelationship").innerHTML += "<ul>";
    document.getElementById("noRelationship").innerHTML += "<ul>";
    for (let i = 0; i < blocks.length; i++) {
        try {
            block = await readAsset("block", blocks[i]);
            if (block?.feedBlock) {
                let feedUrl = block.feedBlock.feedURL;

                let displayName = block.feedBlock.name;
                if (block.feedBlock.metadata.displayName) {
                    displayName = block.feedBlock.metadata.displayName;
                }

                if (feedUrl.includes("casenews.fiu.edu")) {
                    let relationships = await checkRelationships("block", blocks[i]);
                    console.log("Found Casenews");
                    if (relationships.length > 0) {
                        let hasPage = false;
                        for (let j = 0; j < relationships.length; j++) {
                            if (relationships[j].type === "page") {
                                console.log("Found Page");
                                hasPage = true;
                            }
                        }
                        if (hasPage) {
                            document.getElementById("pageRelationship").innerHTML += `<li><a href = "https://cascade.fiu.edu/entity/open.act?id=${blocks[i]}&type=block">${displayName}: ${blocks[i]}</a></li>`
                        }
                        else {
                            document.getElementById("otherRelationship").innerHTML += `<li><a href = "https://cascade.fiu.edu/entity/open.act?id=${blocks[i]}&type=block">${displayName}: ${blocks[i]}</a></li>`
                        }
                    }
                    else {
                        document.getElementById("noRelationship").innerHTML += `<li><a href = "https://cascade.fiu.edu/entity/open.act?id=${blocks[i]}&type=block">${displayName}: ${blocks[i]}</a></li>`
                        const success = await deleteAsset(blocks[i]);
                        console.log(success);
                    }
                }
            }

        } catch (error) {
            console.error(`: ${error}`);

        }
        operations += 1;

    }
    document.getElementById("pageRelationship").innerHTML += "</ul>";
    document.getElementById("otherRelationship").innerHTML += "</ul>";
    document.getElementById("noRelationship").innerHTML += "</ul>";

    document.getElementById("output").innerHTML += "Total Blocks Read: " + operations;
    console.log("FINISHED");
}

async function performDelete(){
    for(let i = 0; i < del.length; i++){
        const success = await deleteAsset(del[i]);
        console.log(success);
    }
}

// Reads an asset given an id and type and returns a JSON object of the asset
async function readAsset(type, id) {
    var assetType = type;
    var assetID = id;
    try {
        console.log("trying to read " + id);
        var response = await fetch(readEP + "/" + assetType + "/" + assetID, {
            "headers": {
                "Authorization": "Bearer " + APIKey,
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

    } catch (error) {
        console.error(`: ${error}`);
    }
}

// Checks for any relationships and return the array of relationships for the file
async function checkRelationships(type, fileId) {
    try {
        const response = await fetch(cascadeEP + "/api/v1/listSubscribers/" + type + "/" + fileId, {
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

// Deletes the asset by calling the Cascade API
async function deleteAsset(fileId) { 
    try {
        const del = await fetch(cascadeEP + "/api/v1/delete/block/" + fileId, {
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