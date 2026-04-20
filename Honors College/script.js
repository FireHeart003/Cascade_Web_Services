const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";

const APIKey = config.API_KEY;

const courseBlocks = {
}
//    "Film from the 'Developing World': Arab Film. The Middle East and Beyond": "9670433f0a73710c12938598b98d86a0",
async function applyCourseFilters() {
    const filterBlock = await readAsset("block", "fbdd0d950a73710c6974f956125ecd04");
    const subjectFilter = filterBlock.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[3];
    const semesterFilter = filterBlock.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[4];
    const formatFilter = filterBlock.xhtmlDataDefinitionBlock.structuredData.structuredDataNodes[6];

    const response = await fetch('./honors.csv');
    const data = await response.text();
    const parsedData = parseCsv(data);

    for (let i = 0; i < parsedData.length; i++) {
        const template = {
            "type": "asset",
            "identifier": "block-chooser",
            "blockId": "",
            "blockPath": "",
            "assetType": "block",
            "recycled": false
        }

        const course = parsedData[i];
        const courseName = course["Course Name"];

        const subjects = course["Subject"]?.split("|").map(s => s.trim());
        const semester = course["Semester(s)"];
        const format = course["Format"];
        console.log(courseName, subjects, semester, format);
        let blockId = courseBlocks[courseName];
        if (!blockId) {
            blockId = courseBlocks["Film from the 'Developing World': Arab Film. The Middle East and Beyond"];
            console.warn(`No blockId found for course: ${courseName}`);
        }

        template["blockId"] = blockId;
        for (const subject of subjects) {
            const filter = subjectFilter.structuredDataNodes.find(node => node.identifier === 'filter-value' && node.structuredDataNodes[0].text === subject);
            if (filter) {
                console.log(filter);
                filter.structuredDataNodes.push(template);
                console.log(filter)
            }
        }

        const semesterNode = semesterFilter.structuredDataNodes.find(node => node.identifier === 'filter-value' && node.structuredDataNodes[0].text === semester);
        if (semesterNode) {
            semesterNode.structuredDataNodes.push(template);
        }

        const formatNode = formatFilter.structuredDataNodes.find(node => node.identifier === 'filter-value' && node.structuredDataNodes[0].text === format);
        if (formatNode) {
            formatNode.structuredDataNodes.push(template);
        }
    }
    console.log(filterBlock)
    let editResult = await editAsset("block", "fbdd0d950a73710c6974f956125ecd04", filterBlock);
    if (editResult.success === true) {
        document.getElementById("output").innerHTML += `|---  ✅ Successfully updated block<br><br>`;
    } else {
        document.getElementById("output").innerHTML += `|--- ❌ Error updating block <br><br>`;
    }
}

function parseCsv(csvText) {
    parsedData = "";
    Papa.parse(csvText, {
        header: true,          // Automatically use first row as headers
        dynamicTyping: true,   // Convert numbers and booleans
        skipEmptyLines: true,
        complete: function (results) {
            parsedData = results.data;
        },
        error: function (err) {
            console.error("Parsing error:", err);
        }
    });
    return parsedData;
}

async function applyFilters() {
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