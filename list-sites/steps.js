/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;
const assetID = document.getElementById('assetID').value;
let redirectFileID = assetID;

// Store data for use later
let redirects = {};
let filenames = [];

function lookup(event) {
    event.preventDefault();
    let assetID = document.getElementById('assetID').value;
    redirectFileID = assetID;
    if(assetID != ""){
        document.getElementById('lookupresults').innerHTML = "Loading...";

        readAsset("page",assetID).then((asset) => {
            document.getElementById('lookupresults').innerHTML = `<br>
            <strong>${asset.page.siteName} ${asset.page.parentFolderPath}  ${asset.page.path}</strong>
            `;
        })
    }
}


/** Step 1.
 *  - Preview list of all redirects from the data file
 */
function step1() {
    redirectsArray = []; // reset array
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        redirects = data;
        data.forEach(element => {
            redirectsArray.push(element);
        });
        document.getElementById("output").textContent = JSON.stringify(redirectsArray, undefined, 2);
    });
}

/** Step 2.
 *  - Add redirects to page
 */
function step2() {

    // reset output
    document.getElementById("output").textContent = "";

    readAsset("page",redirectFileID).then((asset) => {
        console.log(asset.page.id);
        //document.getElementById("output").textContent = JSON.stringify(asset.page.structuredData.structuredDataNodes, undefined, 2);


        // Append the new redirect object to the existing data
        redirectsArray.forEach(element => {

            // New redirect object to append
            const newRedirect = {
                "type": "group",
                "identifier": "redirect",
                "structuredDataNodes": [
                {
                    "type": "text",
                    "identifier": "old-path" ,
                    "text": element.oldUrl
                },
                {
                    "type": "text",
                    "identifier": "new-path",
                    "text": element.newUrl
                },
                {
                    "type": "text",
                    "identifier": "type",
                    "text": "301"
                }
                ]
            };            
        
            asset.page.structuredData.structuredDataNodes.push(newRedirect);

        });


        editAsset("page", asset.page.id, asset).then((data) =>{
            if( data.success === true){
                document.getElementById("output").textContent += "|--- ✅ Redirects added!"  + "\n\n";
            } else {
                document.getElementById("output").textContent += "|--- ❌ Error adding redirects!" + "\n\n";
            }        
        });

    });
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