const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";
const copyEP = cascadeEP + "/api/v1/copy";
const APIKey = config.API_KEY;

const pages = config.pages;

let operations = 0;
async function performTransform() {
    for (let i = 0; i < pages.length; i++) {
        try {
            oldAsset = await readAsset("page", pages[i]);
            let displayName = oldAsset.page.metadata.displayName;
            let transformedName = sanitizeFileName(displayName);

            let blankAsset = {
                'page': {
                    'name': transformedName.toLowerCase(),
                    'parentFolderPath': "blog/2020",
                    'siteName': "The Wolfsonian - 2025",
                    'contentTypeId': config.contentTypeId,
                    'metadata': {
                        "displayName": displayName
                    },
                    'structuredData': {
                        "structuredDataNodes": []
                    }
                }
            }
            let result = await createAsset(blankAsset);

            if (result.success === true) {
                document.getElementById("output").innerHTML += `|--- ✅ ${displayName} created from ${pages[i]} <br>`;
            } else {
                document.getElementById("output").innerHTML += `|--- ❌ Error creating page ${displayName} from ${pages[i]} <br>`;
            }

            let newAsset = await readAsset("page", result.createdAssetId);
            copyContents(oldAsset, newAsset);
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
        .replaceAll("'", "")
        .replaceAll('"', "")
        .replaceAll(",", "")
        .replaceAll("/", "-")
        .replaceAll("\\", "-")      // backslash
        .replaceAll(":", "")       // colon
        .replaceAll("?", "")
        .replaceAll("&", "and")
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

    // Metadata
    newAsset.page.metadata.displayName = oldAsset.page.metadata.displayName;
    newAsset.page.metadata.summary = oldAsset.page.metadata.summary;
    newAsset.page.metadata.metaDescription = oldAsset.page.metadata.metaDescription;
    newAsset.page.metadata.teaser = oldAsset.page.metadata.teaser;
    newAsset.page.metadata.keywords = oldAsset.page.metadata.keywords;
    newAsset.page.metadata.title = oldAsset.page.metadata.title;
    newAsset.page.metadata.author = oldAsset.page.metadata.author;


    newAsset.page.createdBy = oldAsset.page.createdBy;
    newAsset.page.createdDate = oldAsset.page.createdDate;
    newAsset.page.lastModifiedBy = oldAsset.page.lastModifiedBy;
    newAsset.page.lastModifiedDate = oldAsset.page.lastModifiedDate;
    newAsset.page.lastPublishedBy = oldAsset.page.lastPublishedBy;
    newAsset.page.lastPublishedDate = oldAsset.page.lastPublishedDate;

    let nodes = newAsset.page.structuredData.structuredDataNodes;
    let oldAssetNodes = oldAsset.page.structuredData.structuredDataNodes;

    // Banner
    if (oldAssetNodes[1].structuredDataNodes[2].fileId) {
        let bannerFileName = oldAssetNodes[1].structuredDataNodes[2].filePath.split("/");
        let bannerImgId = oldAssetNodes[1].structuredDataNodes[2].fileId;
        let postImageNode = nodes.find(node => node.identifier === "post-image");

        postImageNode.filePath = "blog/_assets/img/" + bannerFileName[bannerFileName.length - 1];
        if (oldAssetNodes[1].structuredDataNodes[3].text != null) {
            let postImageAltNode = nodes.find(node => node.identifier === "post-image-caption");
            postImageAltNode.text = oldAssetNodes[1].structuredDataNodes[3].text;
        }

        if (oldAssetNodes[1].structuredDataNodes[1].text === "::CONTENT-XML-CHECKBOX::Yes") {
            console.log("Video Banner for Page: " + newAsset.page.id);
        }

        // let addBanner = await copyAsset("file", bannerImgId, "The Wolfsonian - 2025", bannerFileName[bannerFileName.length - 1], "blog/_assets/img");
        // if (addBanner.success === true) {
        //     document.getElementById("output").innerHTML += "|--- ✅ File copied:  <br>";
        // } else {
        //     document.getElementById("output").innerHTML += "|--- ❌ Error copying file: <br>";
        // }
    }

    // Content-Area
    if (oldAssetNodes[2].structuredDataNodes.length > 0) {
        let contentAreaNode = nodes.find(node => node.identifier === "post-content");
        let contentAreaText = "";

        for (let i = 0; i < oldAssetNodes.length; i++) {
            if (oldAssetNodes[i].identifier === 'content-area') {
                let postContent = oldAssetNodes[i].structuredDataNodes;
                for (let j = 0; j < postContent.length; j++) {
                    if (postContent[j].identifier === "content-block") {
                        // First Column
                        if (postContent[j].structuredDataNodes[7]?.text != null) {
                            contentAreaText += postContent[j].structuredDataNodes[7].text;
                        }

                        // Second Column
                        if (postContent[j].structuredDataNodes[8]?.text != null) {
                            contentAreaText += postContent[j].structuredDataNodes[8].text;
                        }

                        // Third Column
                        if (postContent[j].structuredDataNodes[9]?.text != null) {
                            contentAreaText += postContent[j].structuredDataNodes[9].text;
                        }

                        // Accordions
                        if (postContent[j].structuredDataNodes[10].structuredDataNodes[1]?.text != null) {
                            console.log("Accordions being used.");
                        }

                        // Tags
                        if (postContent[j].structuredDataNodes[11].structuredDataNodes[1]?.text != null) {
                            console.log("Tags being used.");
                        }
                    }
                }
            }
        }
        contentAreaNode.text = contentAreaText.replaceAll('/_assets/images/blog/', '/blog/_assets/img/');
    }
    console.log(newAsset);

    let response = await editAsset("file", newAsset.page.id, newAsset);
    if (response.success === true) {
        document.getElementById("output").innerHTML += `|--- ✅ Page edited with new id: ${newAsset.page.id} <br> <br>`;
    } else {
        document.getElementById("output").innerHTML += `|--- ❌ Error editing page with new id: ${newAsset.page.id} <br><br>`;
    }
}

async function updateDate() {
    for (let i = 0; i < pages.length; i++) {
        const asset = await readAsset("page", pages[i]);
        console.log(asset);
        let contentAreaNode = asset.page.structuredData.structuredDataNodes.find(node => node.identifier === "post-content");
        let textContent = contentAreaNode.text;
        const match = textContent.match(/[A-Za-z]+ \d{1,2}, \d{4}/);
        const date = new Date(match[0]);
        const isoFormat = date.toISOString();

        const removeDateRegex = new RegExp(`<p><strong>${match[0]}</strong></p>`, 'g');

        const newContent = textContent.replace(removeDateRegex, '');

        console.log(asset.page.id + ": " + isoFormat);
        asset.page.metadata.startDate = isoFormat;
        contentAreaNode.text = newContent;
        const success = await editAsset("page", pages[i], asset);
        if (success.success === "false") {
            console.log(pages[i] + ": " + success);
        }
        else {
            console.log(success)

        }
        operations += 1;
    }
    console.log(operations);
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