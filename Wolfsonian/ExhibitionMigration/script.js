const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";
const copyEP = cascadeEP + "/api/v1/copy";
const APIKey = config.API_KEY;
const pages = ['37c907700a73710c6f16e7026856b518'];

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
                    'parentFolderPath': "whats-on/exhibitions+installations/2025/12",
                    'siteName': "The Wolfsonian - 2025",
                    'contentTypeId': "507bbfee0a73710b06d73cd17545f75c",
                    'metadata': oldAsset.page.metadata,
                    // "title": displayName,
                    // "displayName": displayName

                    'structuredData': {
                        "structuredDataNodes": []
                    }
                }
            }
            blankAsset.page.metadata.displayName = transformedName;
            // blankAsset.page.name = "rhythms-of-modern-life-british-prints,-19141939".toLowerCase();
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

    let nodes = newAsset.page.structuredData.structuredDataNodes;
    let oldAssetNodes = oldAsset.page.structuredData.structuredDataNodes;
    newAsset.page.structuredData.structuredDataNodes = oldAssetNodes;

    text = oldAssetNodes[7].text;
    console.log(text)
    // contentAreaNode.text = contentAreaText.replaceAll('/_assets/images/blog/', '/blog/_assets/img/');

    console.log(newAsset);

    let response = await editAsset("file", newAsset.page.id, newAsset);
    if (response.success === true) {
        document.getElementById("output").innerHTML += `|--- ✅ Page edited with new id: ${newAsset.page.id} <br> <br>`;
    } else {
        document.getElementById("output").innerHTML += `|--- ❌ Error editing page with new id: ${newAsset.page.id} <br><br>`;
    }
}

async function breadcrumbDisplayName() {
    let folderId = "9fdf1bfc0a73710b6baef29394495fd5";
    let folderAsset = await readAsset("folder", folderId);

    let folders = folderAsset.folder.children;
    for (let i = 15; i < 17; i++) {
        let id = folders[i].id;
        let yearFolder = await readAsset("folder", id);
        let monthFolder = yearFolder.folder.children;
        let sum = 0;
        for (let j = 0; j < monthFolder.length; j++) {
            console.log(monthFolder[j]);
            let folderContent = await readAsset("folder", monthFolder[j].id);
            console.log(folderContent)
            if (folderContent.folder.children.length > 0) {
                sum += folderContent.folder.children.length;
                let exhibitions = folderContent.folder.children;
                console.log(exhibitions)
                for (let k = 0; k < exhibitions.length; k++) {
                    let pageAsset = await readAsset("page", exhibitions[k].id);
                    pageAsset.page.metadata.displayName = pageAsset.page.metadata.title;
                    let result = await editAsset("page", exhibitions[k].id, pageAsset);

                    if (result.success === true) {
                        document.getElementById("output").innerHTML += `|--- ✅ ${monthFolder[j].path.path} --| <a target="_blank" href = "https://cascade.fiu.edu/entity/open.act?id=${exhibitions[k].id}&type=page">Click Me</a><br>`;
                    } else {
                        document.getElementById("output").innerHTML += `|--- ❌ ${monthFolder[j].path.path} --| <a target="_blank" href = "https://cascade.fiu.edu/entity/open.act?id=${exhibitions[k].id}&type=page">Click Me</a> <br>`;
                    }
                }
                // document.getElementById("output").innerHTML += `|--- ${monthFolder[j].path.path} ---| ${folderContent.folder.children.length}---| <br>`;
            }
        }
        document.getElementById("output").innerHTML += `|--- Total ${sum} ---| <br>`;
        sum = 0;
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