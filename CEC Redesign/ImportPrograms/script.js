const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";

const APIKey = config.API_KEY;
programs = [
]

async function importPrograms() {
    var template = await readAsset("block", "");
    console.log(template);
    for (let i = 0; i < programs.length; i++) {
        let newAsset = template;
        newAsset.xhtmlDataDefinitionBlock.metadata.displayName = programs[i];
        newAsset.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[2].text = "Learn more about the " + programs[i];
        newAsset.xhtmlDataDefinitionBlock.name = programs[i].toLowerCase().replaceAll(" ", "-").replaceAll("&", "and");
        let result = await createAsset(newAsset);
        if (result.success === true) {
            document.getElementById("output").innerHTML += `|--- ✅ ${programs[i]}: Created successfully. <br>`;
        } else {
            document.getElementById("output").innerHTML += `|--- ❌ ${programs[i]}: Error creating block. <br>`;
            console.log(result);
        }
    }
    console.log("Finished importing programs");
}

async function applyProgramFilters() {
    var filters = await readAsset("block", "");
    filter = filters.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[6];
    console.log(filters);
    currentFilter = filter.structuredDataNodes[10];

    template = currentFilter.structuredDataNodes[2];

    for (let i = 0; i < programs.length; i++) {
        let newFilterNode = JSON.parse(JSON.stringify(template));
        programName = programs[i].toLowerCase().replaceAll(" ", "-").replaceAll("&", "and").replaceAll("ph.d.", "phd");
        newFilterNode.blockId = "";
        console.log(programName);
        newFilterNode.blockPath = "/degrees-programs/items/" + programName;
        currentFilter.structuredDataNodes.push(newFilterNode);
        
        let result = await editAsset("block", "", filters);
        if (result.success === true) {
            document.getElementById("output").innerHTML += `|--- ✅ ${programs[i]}: Created successfully. <br>`;
        } else {
            document.getElementById("output").innerHTML += `|--- ❌ ${programs[i]}: Error creating block. <br>`;
            console.log(result);
        }
    }
    document.getElementById("output").innerHTML += "Finished applying program filters";
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

// Creates asset on Cascade given parameters for the asset
async function createAsset(asset) {
    try {
        var response = await fetch(createEP, {
            "headers": {
                "Authorization": "Bearer " + APIKey,
                "Access-Control-Allow-Origin": "*"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "method": "POST",
            "mode": "cors",
            "body": JSON.stringify({ "asset": asset })
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        var json = await response.json();
        return json;

    } catch (error) {
        console.error(`: ${error}`);
    }
}

// Edits an asset in Cascade with the given parameters for the update
async function editAsset(type, id, asset) {
    try {
        let response = await fetch(editEP + "" + "/" + type + "/" + id,
            {
                method: 'POST',
                headers: { "Authorization": "Bearer " + APIKey, "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ 'asset': asset })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        var json = await response.json();
        console.log(json);
        return json;


    } catch (error) {
        console.error(`: ${error}`);
        return { "success": false };
    }
}