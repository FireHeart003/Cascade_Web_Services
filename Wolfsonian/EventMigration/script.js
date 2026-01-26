const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";
const copyEP = cascadeEP + "/api/v1/copy";
const APIKey = config.API_KEY;
const pages = [  '',
                   ];

let operations = 0;
async function beginTransfer() {
    for (let i = 0; i < pages.length; i++) {
        try {
            oldAsset = await readAsset("page", pages[i]);
            let displayName = oldAsset.page.metadata.title;
            let transformedName = sanitizeFileName(displayName);
            console.log(transformedName)
            let blankAsset = {
                'page': {
                    'name': transformedName.toLowerCase(),
                    'parentFolderPath': "whats-on/events/2026/04",
                    'siteName': "The Wolfsonian - 2025",
                    'contentTypeId': "",
                    'metadata': oldAsset.page.metadata,
                    // "title": displayName,
                    // "displayName": displayName
                    // Displayname breadcrumbs
                    'structuredData': {
                        "structuredDataNodes": []
                    }
                }
            }
            blankAsset.page.metadata.displayName = oldAsset.page.metadata.title;
            // blankAsset.page.name = oldAsset.page.metadata.name;
            // blankAsset.page.name = "howl-o-ween-at-the-wolf-dark-deco";
            let result = await createAsset(blankAsset);

            if (result.success === true) {
                document.getElementById("output").innerHTML += `|--- ✅ ${displayName} created from ${pages[i]} <br>`;
            } else {
                document.getElementById("output").innerHTML += `|--- ❌ Error creating page ${displayName} from ${pages[i]} <br>`;
            }

            let newAsset = await readAsset("page", result.createdAssetId);
            await copyContents(oldAsset, newAsset);
        } catch (error) {
            console.error(`: ${error}`);
        }
        operations += 1;

    }
    document.getElementById("output").innerHTML += "Total Files Created: " + operations;
}

function sanitizeFileName(fileName) {
    return fileName
        .replaceAll(" ", "-")
        .replaceAll("(", "-")
        .replaceAll(")", "")
        .replaceAll("#", "")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .replaceAll(",", "")
        .replaceAll("/", "-")
        .replaceAll("’", "-")
        .replaceAll("\\", "-")      // backslash
        .replaceAll(":", "")       // colon
        .replaceAll("?", "")
        .replaceAll("&", "and")
        .replaceAll("!", "")
        .replaceAll("*", "")
        .replaceAll("|", "")
        .replaceAll("<", "")
        .replaceAll(">", "")
        .replaceAll("^", "")
        .replaceAll("%", "")
        .replaceAll(";", "")
        .replace(/-+/g, "-")       // collapse multiple dashes to one
        .replace(/^-+|-+$/g, "")   // trim dashes from start and end
        .trim();
}

async function copyContents(oldAsset, newAsset) {
    console.log(oldAsset);
    console.log(newAsset);

    // Metadata
    newAsset.page.metadata = oldAsset.page.metadata;


    newAsset.page.createdBy = oldAsset.page.createdBy;
    newAsset.page.createdDate = oldAsset.page.createdDate;
    newAsset.page.lastModifiedBy = oldAsset.page.lastModifiedBy;
    newAsset.page.lastModifiedDate = oldAsset.page.lastModifiedDate;
    newAsset.page.lastPublishedBy = oldAsset.page.lastPublishedBy;
    newAsset.page.lastPublishedDate = oldAsset.page.lastPublishedDate;

    let oldAssetNodes = oldAsset.page.structuredData.structuredDataNodes;
    newAsset.page.structuredData.structuredDataNodes = oldAssetNodes;
    let bannerImage = oldAssetNodes[1].structuredDataNodes[2].filePath;
    if (bannerImage !== ""){
        newAsset.page.structuredData.structuredDataNodes[1].structuredDataNodes[2].fileId = "";
        newAsset.page.structuredData.structuredDataNodes[1].structuredDataNodes[2].filePath = bannerImage;        
    }

    let imagePath = oldAssetNodes[7].filePath
    if (imagePath !== ""){
        newAsset.page.structuredData.structuredDataNodes[7].fileId = "";
        newAsset.page.structuredData.structuredDataNodes[7].filePath = imagePath;        
    }

    // text = oldAssetNodes[5].text;
    // console.log(text)
    console.log(newAsset);

    let response = await editAsset("file", newAsset.page.id, newAsset);
    if (response.success === true) {
        document.getElementById("output").innerHTML += `|--- ✅ Page edited with new id: ${newAsset.page.id} <br> <br>`;
    } else {
        document.getElementById("output").innerHTML += `|--- ❌ Error editing page with new id: ${newAsset.page.id} <br><br>`;
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
        console.log(json);
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
                headers: { "Authorization": "Bearer " + APIKey },
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

// Edits an asset in Cascade with the given parameters for the update
async function copyAsset(type, id, siteName, fileName, path) {
    try {
        console.log(copyEP + "" + "/" + type + "/" + id)
        let response = await fetch(copyEP + "" + "/" + type + "/" + id,
            {
                method: 'POST',
                headers: { "Authorization": "Bearer " + APIKey },
                body: JSON.stringify({
                    "copyParameters": {
                        "newName": fileName,
                        "destinationContainerIdentifier": {
                            "type": "folder",
                            "path": {
                                "siteName": siteName,
                                "path": path
                            }
                        }
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        var json = await response.json();
        console.log(json)
        return json;


    } catch (error) {
        console.error(`: ${error}`);
        return { "success": false };
    }
}