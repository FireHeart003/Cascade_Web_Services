const cascadeEP = "https://cascade.fiu.edu";
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;


async function getSiteUsers() {
    document.getElementById("output").textContent = "";
    try {
        var response = await fetch( cascadeEP + "/api/v1/listSites" , {
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
        
        //loop through the data in the json variable and output the name of the site 
        json.sites.forEach(site => {
            let siteOptions = readAsset("site",site.id);
            siteOptions.then((asset) => {
                if(typeof asset !== 'undefined'){
                    if (typeof asset.site.roleAssignments[0]?.users !== 'undefined'){
                        let siteId = asset.site.rootFolderId;
                        let name = asset.site.name;
                        var roles = asset.site.roleAssignments;
                        let htmlText = ''
                        htmlText += `   
                            <li>
                                <strong><a href="https://cascade.fiu.edu/entity/open.act?type=folder&id=${siteId}" target="_blank" rel="noopener noreferrer">${name}</a><br></strong>
                            <ul>
                        `;
                        for(var i = 0; i<roles.length; i++){
                            if(roles[i].groups !== undefined){
                                console.log(roles[i])
                                var name_arr = roles[i].groups.split(',');
                                console.log(name_arr);
                                for(let item of name_arr){
                                    htmlText += `<li>${item}</li>`;
                                }
                            }
                            if(roles[i].users !== undefined){
                                var name_arr = roles[i].users.split(',');
                                console.log(name_arr)
                                for(let item of name_arr){
                                    htmlText += `<li>${item}</li>`;
                                }
                            }
                        }
                        document.getElementById("output").innerHTML += htmlText + `</ul></li>`;
                    }
                }
            })
        });   
    } catch(error) {
        console.error(`: ${error}`);
    }
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