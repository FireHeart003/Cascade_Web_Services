/* Start a web server in this directory 
    sample: python3 -m http.server
*/

const cascadeEP = "https://cascade.fiu.edu"
const editEP =  cascadeEP + "/api/v1/edit";
const readEP = cascadeEP + "/api/v1/read";
const createEP = cascadeEP + "/api/v1/create";
const publishEP = cascadeEP + "/api/v1/publish"
const APIKey = config.API_KEY;
const posts = [ "032e57b10a73710b02377f92ebf56537",
    "035b75d00a73710b7b8e7e3d712d77d7",
    "04aafffa0a73710b46ad875ac1fb5b95",
    "053e734a0a73710b2c56332af11c970e",
    "091842290a73710b7b8e7e3dc8dbb25e",
    "097f784a0a73710b05bc88558f407daa",
    "09e994820a73710b6df9fa124bb9027d",
    "0a02c6e60a73710b6137a08311215841",
    "0a5e387f0a73710b4801d664ef817df1",
    "0c0c40fd0a73710b6cbafc3533e35441",
    "0e39a5fc0a73710b05bc88558a158765",
    "11f746ae0a73710b39e8d264915e29e7",
    "12259fbf0a73710b390ab47249e5bcbe",
    "12297bf80a73710b32044a02082004d8",
    "132356c80a73710b05cb3ab53a3d6e7f",
    "1544313a0a73710b269f632147a5b6c4",
    "15f9a6df0a73710b454464e152745b89",
    "16c84d690a73710b32044a02eac86b48",
    "1741fa8e0a73710b32044a02ca339a6f",
    "17e68f240a73710b176a13eba264c016",
    "1865b1690a73710b2792a5db2019db4b",
    "1b4fc6790a73710b32044a02f209f93a",
    "1c7578d10a73710b32044a021374c28b",
    "1d81cea90a73710b33b57507aeaa784a",
    "1db5ba020a73710b38c280d8a97e0bab",
    "1dd5c4280a73710b38c280d8513b951d",
    "20fcb1320a73710b6137a0837f2d7782",
    "219912310a73710b32044a02b666c61c",
    "21af76400a73710b2ad39af63501fd39",
    "22a581d40a73710b33b575074578c591",
    "23c44f2f0a73710b15e70c2ff6991ae6",
    "23fe243a0a73710b2792a5dbfc00bc34",
    "24e4d3eb0a73710b2e5b81a4a0af218f",
    "251fd7b20a73710b15e70c2fdb8fd009",
    "27668f2b0a73710b090bcd91581f3f44",
    "27ea3f8a0a73710b2c56332a21683812",
    "28040d680a73710b2ad39af601212dff",
    "2f10b3f20a73710b2ad39af66bfcfd24",
    "2fbbdf970a73710b60dcc59aa01a74f0",
    "30c3b1040a73710b760c5d13a891ccb6",
    "30f8b8230a73710b390ab472d25217dd",
    "31a46f1d0a73710b002663b6835c6742",
    "3238fdac0a73710b760c5d135f22a43b",
    "32faf4a40a73710b090bcd91fda6f4ff",
    "3310260a0a73710b002663b6ae2576a4",
    "3397f10d0a73710b2a000eb2cebd6f33",
    "33b826450a73710b2ad39af6843672f3",
    "341af4310a73710b0872fa6fb78eeecc",
    "35bc0b380a73710b450b0123f1b13bb0",
    "373907bb0a73710b33b5750790a2e79c",
    "374d39080a73710b0e9d8218733da639",
    "37abd7a60a73710b760c5d137270c057",
    "39b06c980a73710b60dcc59a8aa4b1e3",
    "3a6b5ee30a73710b0872fa6fa8973974",
    "3b790cc40a73710b6f49e4a35510667a",
    "3cb33f3f0a73710b33b57507718fb617",
    "3e1a863d0a73710b0872fa6f89b3ac04",
    "3e1d8ff50a73710b0872fa6fc48828a7",
    "3e2e94af0a73710b15a88cbb9ad62642",
    "3e2f9d5f0a73710b0872fa6f69bf70ea",
    "3e420f620a73710b0872fa6febe61467",
    "3ea972ad0a73710b6cbafc35d811b59c",
    "3ec853c10a73710b0872fa6fcaaccd76",
    "407566200a73710b125cd643f7bca69e",
    "437548460a73710b2a000eb2b5bc80d2",
    "44f00c960a73710b6aae9c0b4320efda",
    "455287f30a73710b0872fa6f4960bb1d",
    "4643fcc40a73710b6847361ecc806b8f",
    "46c7ac860a73710b15eb2e4104849a37",
    "47b59d500a73710b2a000eb23cac951f",
    "47e8d3b80a73710b38c280d8a59eb64b",
    "49832a8f0a73710b6a9a465c56b569b1",
    "4af1954f0a73710b2ad39af6386877fc",
    "4b82b1da0a73710b0030f20da7037832",
    "4f8d06720a73710b37d489d83d6e3f1f",
    "4fe620580a73710b2768c7785a4ee8b9",
    "504990d90a73710b450b01230be718a5",
    "5202791e0a73710b2c56332ad1c99d55",
    "52e035bf0a73710b1042b782985c716f",
    "540a3f8c0a73710b6cbafc3572080088",
    "54cc25d60a73710b125cd643c381cfeb",
    "54e7c4f90a73710b60dcc59a8cb8b9ea",
    "573021b00a73710b094e2a9913975d31",
    "57e548aa0a73710b2a17925bd0dffe0b",
    "5cb4b15c0a73710b4b9ed2a30c3cedda",
    "5ccc328c0a73710b2a000eb26ea8b067",
    "630ac56e0a73710b125cd643a61b095e",
    "635034710a73710b0872fa6fa91be1b0",
    "63de014c0a73710b760c5d13b90e3166",
    "646262ce0a73710b6aae9c0b92521cf8",
    "656eed200a73710b3f551545b719ef8a",
    "65de77b40a73710b38c280d8ac3c563c",
    "6689eb620a73710b38c280d88b61b70d",
    "6b16d0c90a73710b0761abea220eed71",
    "6b74aab80a73710b0761abea7192195d",
    "6c36c5610a73710b38c280d81d96f8b9",
    "6c76c74b0a73710b1042b7824213359f",
    "6e0b0ed20a73710b6aae9c0b73bafe48",
    "7023ea020a73710b38c280d8def1102d",
    "71801ac10a73710b010f980ff06e5734",
    "749e72190a73710b450b012339f817e2",
    "7883adba0a73710b777467abba0c5b95",
    "79ace4020a73710b25d8a9857bbe78e4",
    "7fe00f130a73710b0761abea757e7fb4",
    "8122a0890a73710b2beab39cf73205a5",
    "83a1d8200a73710b08f35634ea91872b",
    "85b0ca760a73710b15e70c2f57f6f5a6",
    "86ff85b00a73710b313a67b291265690",
    "873a91f70a73710b2788d36f7b74192b",
    "89cf3f450a73710b08f35634155697af",
    "8aae8d730a73710b183af00fdddca938",
    "8bd040650a73710b5557c17f4ccf2f8b",
    "920516d40a73710b17a1cd57c31f38cc",
    "9389fc680a73710b54abc8c08bb4ba51",
    "94ce029a0a73710b07655fb51faed6cd",
    "97c8d9fb0a73710b390ab472d89cba2c",
    "98facd800a73710b3f551545d72bc1db",
    "991a5f470a73710b390ab472d65406e1",
    "9931cc080a73710b454464e1b5a7119c",
    "99567d5a0a73710b777467abc1621f58",
    "9dda09cf0a73710b66b06c6c3b83c1f3",
    "a0238bcb0a73710b37f02237ee6f014a",
    "a2c659e20a73710b54abc8c0ccfff3ef",
    "a3855f4e0a73710b66185d6d8949115a",
    "a3b900330a73710b11871e7aa6c0f81d",
    "a419efca0a73710b2a937b9db2794a92",
    "ac2f88320a73710b20c45affa8df4247",
    "ac6d56410a73710b54abc8c0b52f17c5",
    "ad55d6d00a73710b37aa6d6cffcd58dc",
    "ae4dc7cf0a73710b010f980f255c6d44",
    "ae5546f40a73710b0096c1035a143f10",
    "af2fe9630a73710b07655fb5cba869cf",
    "af59565e0a73710b07655fb58df2ecfd",
    "b1c9a6730a73710b1c630e624a299f8e",
    "b20e63df0a73710b21ae58ac722286fe",
    "b210a3f90a73710b21ae58ac0ac06a99",
    "b58fcf720a73710b7c0091d901214353",
    "b76ef4730a73710b0d9c77841354ed4f",
    "bd4c44410a73710b5a990a9ab7d1fdc2",
    "bd7e58760a73710b1283a78898899521",
    "bf2cabca0a73710b37f02237c133404c",
    "bf2fd0590a73710b5c833c0dbaa1b865",
    "c3211b1e0a73710b5a990a9a1f312b7e",
    "c37956750a73710b0761abeaa001ed1b",
    "c6d747b70a73710b0d9c778435b242e3",
    "c7a152000a73710b66185d6d17ac307a",
    "c8ab13b50a73710b269f632133644d4f",
    "ca10173b0a73710b39e8d26462da83f6",
    "cc67cc780a73710b0d9c778417d666d9",
    "cea5680a0a73710b181e3eeacc2f136f",
    "cec104a10a73710b5a48e7ecf7873537",
    "d1a34ec70a73710b0304f90eb72c2d78",
    "d1c5a9a30a73710b0d9c77846b887877",
    "d36c334c0a73710b5c833c0d0751d0d7",
    "d6d538b70a73710b0d9c7784c23608ac",
    "d6edb7650a73710b09ab1b512979b6cc",
    "daf1bd920a73710b4c08c65a3e64357e",
    "db19ba9d0a73710b1a9ce07f8940afb4",
    "de2682530a73710b5924f7ec9dea4059",
    "df148fe10a73710b1a9ce07f3ae3d40e",
    "e0a0bfc30a73710b66b06c6cd5157ec3",
    "e110e3890a73710b37aa6d6cae9d0ae1",
    "e1a09caf0a73710b39e8d2645187911c",
    "e23993f90a73710b72dd333bdf0bd5c1",
    "e4978cc60a73710b090bcd912df3463d",
    "e51e28f20a73710b2c56332a0c896f45",
    "eae9d4b40a73710b4801d664b9408415",
    "ebe2ae420a73710b41b155f16114e08e",
    "ecaae10a0a73710b32044a0225fcd1fd",
    "eeafc60b0a73710b39e8d264e5a4bbe1",
    "ef0b64130a73710b7b8e7e3d9e8ceb16",
    "ef6da0d10a73710b7b8e7e3d6c414c4f",
    "efd2be0c0a73710b4545e559e7bb060d",
    "f1e2152c0a73710b4801d664cb383e7c",
    "f25898440a73710b2e5b81a42a0d837e",
    "f2ae5c750a73710b2d4192f7bdc7b3f8",
    "f46f1ac70a73710b7b8e7e3dc863c954",
    "f5b06a190a73710b4801d66415209992",
    "f6056c850a73710b1283a788d0b52957",
    "f6d56ecc0a73710b634179d4859d1e25",
    "f6e1d53e0a73710b6cbafc35aa75424b",
    "f6e7347b0a73710b634179d4189caf4e",
    "f75d1d670a73710b0872fa6f329734f3",
    "f79df6630a73710b72dd333ba76c03b2",
    "f8994e880a73710b00e02c506a9029a6",
    "f8bc6ad00a73710b0fb239850f0f2625",
    "fa6283880a73710b1283a78866affdaf",
    "fed53aa30a73710b05bc885528032eff"];

async function getSites() {
        for(let i = 0; i<posts.length; i++){
            try{
                //Read each page and update the node for name with the author + middle name
                asset = await readAsset("page", posts[i]);
                asset.page.structuredData.structuredDataNodes[3].text = "Gisela Maria Valencia";
                console.log(asset.page.structuredData.structuredDataNodes[3].text);
                editAsset("page",posts[i],asset);
            } catch(error){
                console.error(`: ${error}`);
            }
        }        
}

async function publishSites() {
    for(let i = 0; i<posts.length; i++){
        try{
            asset = await publishAsset("page", posts[i]);
            console.log(asset)
        } catch(error){
            console.error(`: ${error}`);

        }
    }        
}

// Publishes an asset in Cascade 
async function publishAsset(type, id) {
    try {
        let response = await fetch( publishEP + "" + "/"+ type +"/" + id, { 
            "headers": {
                "Authorization": "Bearer "+ APIKey,
                "Access-Control-Allow-Origin": "*"
                },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "mode": "cors"
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

// Reads an asset given an id and type and returns a JSON object of the asset
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

// Creates asset on Cascade given parameters for the asset
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

// Edits an asset in Cascade with the given parameters for the update
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

