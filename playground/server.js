const express = require('express');
const config = require('../config.js');
const parse = require('csv-parse/sync');
const path = require('path');
const fs = require('fs');

const cascadeEP = "https://cascade.fiu.edu"
const createEP = cascadeEP + "/api/v1/create";
const APIKey = config.API_KEY;

const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

app.get('/api/get-data', (req, res) => {
    try {
        console.log('start parsing CSV');
        const csvParsed = readCSV();
        res.json({ ok: true, data: csvParsed });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Failed to fetch data' });
    }
});

app.post('/api/create-profiles', async (req, res) => {
    try {
        console.log('start creating profiles');
        const results = await createProfiles(req.body.data);
        res.json({ message: "Profiles creation initiated", data: results })
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Failed to create profiles' });
    }
});

function readCSV() {
    try {
        const csv = fs.readFileSync('data.csv', 'utf8');
        const records = parse.parse(csv, { columns: true, trim: true, skip_empty_lines: true });
        return records;
    } catch (error) {
        console.error(`Error reading CSV: ${error}`);
        return null;
    }
}

async function createProfiles(dataProfile) {
    profileOutput = "";

    for (let i = 0; i < data.length; i++) {
        profile = data[i];
        try {
            let asset = {
                'page': {
                    'name': profile.name,
                    'parentFolderPath': profile.location,
                    'siteName': profile.siteName,
                    'contentTypeId': profile.pageContentType,
                    'metadata': {},
                    'structuredData': {
                        "structuredDataNodes": []
                    }
                }
            }
            asset.page.metadata.displayName = profile.name;
            // document.getElementById("output").textContent += "|--- Name: " + asset.page.metadata.displayName + "\n";
            
            // Page Structure Data
            asset.page.structuredData = {
                "structuredDataNodes": [
                    {
                        "type": "asset",
                        "identifier": "picture",
                        "filePath": profile.photo !== "" ? "alumni/alumni-stories/profiles/_images/" + profile.photo.toLowerCase() : "_assets/images/headshot-placeholder.png",
                        "assetType": "file"
                    },
                    {
                        "type": "text",
                        "identifier": "title",
                        "text": profile.degrees
                    },
                    {
                        "type": "text",
                        "identifier": "department",
                        "text": profile.theme
                    },
                    {
                        "type": "text",
                        "identifier": "office"
                    },
                    {
                        "type": "text",
                        "identifier": "phone"
                    },
                    {
                        "type": "text",
                        "identifier": "email"
                    },
                    {
                        "type": "asset",
                        "identifier": "curriculum-vitae",
                        "assetType": "file"
                    },
                    {
                        "type": "group",
                        "identifier": "website",
                        "structuredDataNodes": [
                            {
                                "type": "text",
                                "identifier": "label"
                            },
                            {
                                "type": "asset",
                                "identifier": "link",
                                "assetType": "page,file,symlink"
                            }
                        ]
                    },
                    {
                        "type": "group",
                        "identifier": "custom-field",
                        "structuredDataNodes": [
                            {
                                "type": "text",
                                "identifier": "label"
                            },
                            {
                                "type": "text",
                                "identifier": "type",
                                "text": "text"
                            },
                            {
                                "type": "text",
                                "identifier": "value"
                            },
                            {
                                "type": "text",
                                "identifier": "link-text"
                            },
                            {
                                "type": "asset",
                                "identifier": "internal-link",
                                "assetType": "page,file,symlink"
                            },
                            {
                                "type": "text",
                                "identifier": "external-link"
                            }
                        ]
                    },
                    {
                        "type": "group",
                        "identifier": "content-group",
                        "structuredDataNodes": [
                            {
                                "type": "text",
                                "identifier": "heading"
                            },
                            {
                                "type": "text",
                                "identifier": "content",
                                "text": "<p>" + profile.bio + "</p>"
                            }
                        ]
                    }
                ]
            }

            let result = await createAsset(asset).then((data) => {
                if (data.success === true) {
                    profileOutput += "|--- ✅ Page created: " + profile.filename + "\n\n";
                } else {
                    profileOutput += "|--- ❌ Error creating page: " + profile.filename + "\n\n";
                }
            });

        } catch (error) {
            console.error(`Error creating profile for ${profile.name}: ${error}`);
        }
    }
    return profileOutput;
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