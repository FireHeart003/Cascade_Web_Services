/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

async function getSites() {
    document.getElementById("output").textContent = "";
    const set = new Set();

    try {
        const response = await fetch(cascadeEP + "/api/v1/listSites", {
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

        // Process sites sequentially
        for (const site of json.sites) {
            const asset = await readAsset("site", site.id);

            if (asset?.site?.roleAssignments?.[0]?.users) {
                const roles = asset.site.roleAssignments;
                for (const role of roles) {
                    if (role.users !== undefined) continue;

                    if (role.groups !== undefined) {
                        console.log(asset)
                        const nameArr = role.groups.split(",");
                        for (const item of nameArr) {
                            set.add(item);
                        }
                    }
                }
            }
        }

     // Call the finished function
     finished(set);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function finished(set) {
    let htmlText = "";
    const nameSet = new Set();
    for (const value of set) {
        const response = await readAsset("group", value)
        console.log(response);
        const names = response.group.users;
        const nameArr = names.split(";");
        for(const name of nameArr){
            nameSet.add(name);
        }
    }
    console.log(nameSet)
    for(const userName of nameSet){
        htmlText += userName + "@fiu.edu, ";
    }
    document.getElementById("output").innerHTML += htmlText;
    console.log(htmlText);
}


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