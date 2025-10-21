const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";
const copyEP = cascadeEP + "/api/v1/copy";
const APIKey = config.API_KEY;

let operations = 0;


async function performSearch() {
    const json = await readAsset("folder", "");
    const children = json.folder.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].type == "page") {
            let relationships = await checkRelationships("page", children[i].id);
            if (relationships.length == 0) {
                let page = await readAsset("page", children[i].id);
                let department = page.page.structuredData.structuredDataNodes[6].text;
                let name = page.page.metadata.displayName;
                document.getElementById("results").innerHTML += `${name}+${department}+<a href = "https://cascade.fiu.edu/entity/open.act?id=${children[i].id}&type=page">${children[i].id}</a><br>`
            }
        }
    }
    console.log("FINISHED");
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
