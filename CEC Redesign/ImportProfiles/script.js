// const { profile } = require("console");

const cascadeEP = "https://cascade.fiu.edu"
const editEP = cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish";

const APIKey = config.API_KEY;
profiles = {}

async function importProfiles() {
    const response = await fetch('./extraProfiles.csv'); 
    const data = await response.text();
    const parsedData = parseCsv(data);

    for (let i = 30; i < 39; i++) {
        console.log(parsedData[i]);
        try {
            let name = parsedData[i]["Name - First"] + " " + parsedData[i]["Name - Last"];

            let blankAsset = {
                'page': {
                    'name': name.toLowerCase().replaceAll("(","").replaceAll(")", "").replaceAll(" ", "-").replaceAll('"', ""),
                    'parentFolderPath': "about/directory/profiles",
                    'siteName': "College of Engineering and Computing - CEC",
                    'contentTypeId': "",
                    'metadata':  {
                        "displayName": name,
                        "summary": `Learn more about ${name}, ${parsedData[i]["Title/Position"].toLowerCase()} at FIU's College of Engineering & Computing.`
                    },
                    'structuredData': {
                        "structuredDataNodes": []
                    }
                }
            }

            let result = await createAsset(blankAsset);
            let newId = result.createdAssetId;
            if (result.success === true) {
                document.getElementById("output").innerHTML += `|--- ${i}: ✅ ${name} created <a target = "_blank" href = "https://cascade.fiu.edu/entity/open.act?id=${newId}&type=page">Link</a><br>`;
            } else {
                document.getElementById("output").innerHTML += `|--- ${i}: ❌ Error creating page ${name}<br>`;
            }

            let newProfile = await readAsset("page", newId);
            newProfile.page.structuredData.structuredDataNodes[1].text = parsedData[i]["Title/Position"];
            newProfile.page.structuredData.structuredDataNodes[6].text = parsedData[i]["Department"];
            
            let researchInterest = parsedData[i]["List all research interests (if applicable)."];
            if(researchInterest){
                newProfile.page.structuredData.structuredDataNodes[4].text = "::CONTENT-XML-CHECKBOX::Yes";
            }

            let office = parsedData[i]["Office"];
            if(office.length > 4) {
                newProfile.page.structuredData.structuredDataNodes[7].text = office;
            }

            let phone = parsedData[i]["FIU Phone Number"];
            if(phone) {
                newProfile.page.structuredData.structuredDataNodes[8].text = phone;
            }

            let email = parsedData[i]["FIU Email"];
            if(email) {
                newProfile.page.structuredData.structuredDataNodes[9].text = email;
            }

            let discoveryLink = parsedData[i]["Link to your FIU Discovery profile (if applicable)."];
            customFieldTemplate = {};
            if(discoveryLink && discoveryLink.includes("discovery.fiu.edu")) {
                newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[0].text = "Publications";
                newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[1].text = "external-link";
                newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[3].text = "FIU Discovery";
                newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[5].text = discoveryLink;
            }
            let labLink = parsedData[i]["Link to your center, lab or institute (if applicable)."];
            if(labLink) {
                if(discoveryLink){
                    template = {
                        "type": "group",
                        "identifier" : "custom-field",
                        "structuredDataNodes": [
                            {
                                "type": "text",
                                "identifier": "label",
                                "text": "Lab"
                            },
                            {
                                "type": "text",
                                "identifier": "type",
                                "text": "external-link"
                            },
                            {
                                "type": "text",
                                "identifier": "value",
                            },
                            {
                                "type": "text", 
                                "identifier": "link-text",
                                "text": ""
                            },
                            {
                                "type": "asset",
                                "identifier": "internal-link",
                                "assetType": "page,file,symlink"
                            },
                            {
                                "type": "text",
                                "identifier": "external-link",
                                "text": labLink
                            }
                        ]
                    }
                    newProfile.page.structuredData.structuredDataNodes.push(template);
                }
                else{
                    newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[0].text = "Lab";
                    newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[1].text = "external-link";
                    newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[3].text = "";
                    newProfile.page.structuredData.structuredDataNodes[12].structuredDataNodes[5].text = labLink;
                }
            }

            let biography = parsedData[i]["Enter your most up-to-date professional biography. Make sure your bio follows the FIU Style Guide."];
            let awards = parsedData[i]["List relevant professional honors and awards with the year (if applicable)."];
            let education = parsedData[i]["List all completed academic degrees with the year."];

            if(biography !== null && biography !== ""){
                console.log(biography)
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[0].text = "Biography";
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text = "<p>" + biography.replaceAll("\"", "").replaceAll("\n\n", "</p><p>").replaceAll("\n", "</p><p>") + "</p>";
                if(awards){
                    console.log(awards);
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += "<h2>Awards &amp; Honors</h2>";
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += `<ul class = "list-unstyled"><li>${awards.replaceAll("\"", "").replaceAll("\n\n", "</li><li>").replaceAll("\n", "</li><li>")}</li></ul>`;
                }
                if(education){
                    console.log(education)
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += "<h2>Education</h2>";
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += `<ul class = "list-unstyled"><li>${education.replaceAll("\"", "").replaceAll("\n\n", "</li><li>").replaceAll("\n", "</li><li>")}</li></ul>`;
                }
            }           
            else if(awards !== null && awards !== ""){
                console.log("Awards without bio")
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[0].text = "Awards & Honors";
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text = `<ul class = "list-unstyled"><li>${awards.replaceAll("\"", "").replaceAll("\n\n", "</li><li>").replaceAll("\n", "</li><li>")}</li></ul>`;
                if(education){
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += "<h2>Education</h2>";
                    newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text += `<ul class = "list-unstyled"><li>${education.replaceAll("\"", "").replaceAll("\n\n", "</li><li>").replaceAll("\n", "</li><li>")}</li></ul>`;
                }
            }
            else if(education !== null && education !== ""){
                console.log("Education without bio")
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[0].text = "Education";
                newProfile.page.structuredData.structuredDataNodes[13].structuredDataNodes[1].text = `<ul class = "list-unstyled"><li>${education.replaceAll("\"", "").replaceAll("\n\n", "</li><li>").replaceAll("\n", "</li><li>")}</li></ul>`;
            }

            let researchInterestText = parsedData[i]["List all research interests (if applicable)."];
            if(researchInterestText) {
                console.log(researchInterestText)
                researchInterestText = researchInterestText.replaceAll("\"", "");
                researchArray = researchInterestText.split(",");
                if(researchArray.length <= 2){
                    researchInterestText = "\n" + researchInterestText;
                    researchInterestText = researchInterestText.replace("-", "\n\n-");
                    researchArray = researchInterestText.split("\n\n-");
                    console.log(researchInterestText)
                    if(researchArray.length <= 2){
                        researchInterestText = researchInterestText.replace("-", "\n-");
                        console.log(researchInterestText)
                        researchArray = researchInterestText.split("\n-");
                    }
                    if(researchArray.length <= 2){
                        researchArray = researchInterestText.split("\n-");
                    }
                }
                for(let j = 0; j < researchArray.length; j++){
                    researchArray[j] = researchArray[j].trim();
                    researchArray[j] = researchArray[j].charAt(0).toUpperCase() + researchArray[j].slice(1).trim();
                    if (j === researchArray.length -1){
                        researchArray[j] = researchArray[j].toLowerCase().replaceAll("and", "");
                        researchArray[j] = researchArray[j].trim();
                        researchArray[j] = researchArray[j].charAt(0).toUpperCase() + researchArray[j].slice(1).trim();
                    }
                }
                console.log(researchArray)
                researchInterestText = researchArray.join(",");
                newProfile.page.structuredData.structuredDataNodes[14].text = `<h2 class="display-text--medium">Research Interests</h2><ul class="list-unstyled"><li>${researchInterestText.replaceAll(",", "</li><li>")}</li></ul>`;
            }


            let editResult = await editAsset("page", newId, newProfile);
            if (editResult.success === true) {
                document.getElementById("output").innerHTML += `|--- ${i}: ✅ ${name} updated<br><br>`;
            } else {
                document.getElementById("output").innerHTML += `|--- ${i}: ❌ Error updating page ${name}<br><br>`;
            }
        } catch (error) {
            console.error(`: ${error}`);
        }
    }
    console.log("Finished importing profiles");
}

async function updateImages() {
    try{
        const response = await fetch('./extraProfiles.csv'); 
        const data = await response.text();
        const parsedData = parseCsv(data);

        for(let i = 0; i < 5; i++){
            profile = parsedData[i];
            let name = profile["Name - First"] + " " + profile["Name - Last"];
            parsedName = name.toLowerCase().replaceAll("(","").replaceAll(")", "").replaceAll(" ", "-").replaceAll('"', "");
            let assetId = profiles[parsedName];
            console.log(typeof assetId);
            console.log(parsedName)
            console.log(assetId);
            let profilePage = await readAsset("page", assetId);
            profilePage.page.structuredData.structuredDataNodes[0].filePath = "/about/directory/profiles/_assets/images/" + parsedName + "-headshot.webp";

            let editResult = await editAsset("page", assetId, profilePage);
            if (editResult.success === true) {
                document.getElementById("output").innerHTML += `|--- ${i}: ✅ ${name} updated<br><br>`;
            } else {
                document.getElementById("output").innerHTML += `|--- ${i}: ❌ Error updating page ${name}<br><br>`;
            }
        } 

    }
    catch(error){
        console.error(`: ${error}`);
    }
}

function parseCsv(csvText) {
    parsedData = "";
    Papa.parse(csvText, {
        header: true,          // Automatically use first row as headers
        dynamicTyping: true,   // Convert numbers and booleans
        skipEmptyLines: true,  
        complete: function(results) {
            parsedData = results.data;
        },
        error: function(err) {
            console.error("Parsing error:", err);
        }
    });
    return parsedData;
}

async function createReferences() {
    const response = await fetch('./extraProfiles.csv'); 
    const data = await response.text();
    const parsedData = parseCsv(data);
//start at 90
    for (let i = 35; i < parsedData.length; i++) {
        profile = parsedData[i];
        let name = profile["Name - First"] + " " + profile["Name - Last"];

        let department = "";

        if(profile["Department"].includes("Biomedical")){
            department = "biomedical-engineering";
        }
        else if(profile["Department"].includes("Civil")){
            department = "civil-environmental-engineering";     
        }
        else if(profile["Department"].includes("Multidisciplinary")){
            department = "multidisciplinary-engineering-computing-education-systems-and-management";     
        }
        else if(profile["Department"].includes("Computing")){
            department = "computing-and-information-sciences";
        }
        else if(profile["Department"].includes("Construction")){
            department = "construction";     
        }
        else if(profile["Department"].includes("Electrical")){
            department = "electrical-computer-engineering";     
        }
        else if(profile["Department"].includes("Mechanical")){
            department = "mechanical-materials-engineering";     
        }

        if(department !== ""){
            await createReference(name, department);
        }
        else{
            document.getElementById("output").innerHTML += `|--- ❌ ${name}: No department found.<br>`;
        }
/*
        let position = "";
        hasPosition = false;
        cnt = 0;
        console.log(name + ": " + profile["Title/Position"].toLowerCase());
        if(profile["Title/Position"].toLowerCase().includes("professor")){
            console.log("found professor");
            position = "faculty";
            hasPosition = true;
            cnt += 1;
            await createReference(name, position);
        }
        if(profile["Title/Position"].toLowerCase().includes("advisor")){
            console.log("found advisor");
            position = "advisors";
            hasPosition = true;
            cnt += 1;
            await createReference(name, position);
        }
        if(profile["Title/Position"].toLowerCase().includes("dean")){
            console.log("found dean");
            position = "leadership";
            hasPosition = true;
            cnt += 1;
            await createReference(name, position);
        }
        if(profile["Title/Position"].toLowerCase().includes("program coordinator")){
            console.log("found program coordinator");
            position = "program-coordinators";
            hasPosition = true;
            cnt += 1;
            await createReference(name, position);
        }
        if(profile["Title/Position"].toLowerCase().includes("program director")){
            console.log("found program director");
            position = "program-directors";
            hasPosition = true;
            cnt += 1;
            await createReference(name, position);
        }

        if(!hasPosition && cnt == 0){
            position = "staff";
            console.log("defaulting to staff");
            await createReference(name, position);
        }*/
    }
    document.getElementById("output").innerHTML += "Finished applying program filters";
}

async function createReference(name, path){
        let reference = {
            "reference": {
                "referencedAssetPath" : "about/directory/profiles/" + name.toLowerCase().replaceAll("(","").replaceAll(")", "").replaceAll(" ", "-").replaceAll('"', ""),
                "referencedAssetType" : "page",
                "parentFolderPath": "about/directory/profiles/" + path,
                "siteName": "College of Engineering and Computing - CEC",
                "name": name.toLowerCase().replaceAll("(","").replaceAll(")", "").replaceAll(" ", "-").replaceAll('"', "")
            }
        };        

        let result = await createAsset(reference);
        console.log(result);
        if (result.success === true) {
            document.getElementById("output").innerHTML += `|--- ✅ ${name}: Reference created successfully in ${path}. <a href = "https://cascade.fiu.edu/entity/open.act?id=${result.createdAssetId}&type=reference" target = "_blank">Link here</a> <br>`;
        } else {
            document.getElementById("output").innerHTML += `|--- ❌ ${name}: Error creating reference in ${path}. <br>`;
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