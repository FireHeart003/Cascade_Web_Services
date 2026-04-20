# Cascade Web Services
A repository of simple web application that uses the Cascade API to automate many tasks such as updating and removing tags, updating authors of blog posts, and checking relationships of assets.

Worked on by: Nathan Chen

Last Updated: Spring 2026

## Installation
1. Clone the Repo

   ```bash
   git clone https://github.com/FireHeart003/Cascade_Web_Services.git
   cd Cascade_Web_Services
   ```
2. Create a `config.js` file and add the following in the file:

   ```js
   var config = { API_KEY : "Your_Cascade_API_KEY" }
   ```

3. Get your Cascade API key:

   1. Log into Cascade
   2. Go to Profile → API Key
   3. Click on "Generate API Key" or "Regenerate API Key"
   4. Copy and paste the API Key in your `config.js`

3. Begin Development!

## Running the Project

This project is a simple frontend application using `index.html` and `script.js`.

### Using Live Server (VS Code)

1. Install the **Live Server** extension in Visual Studio Code
2. Open the project folder
3. Right-click `index.html`
4. Select **"Open with Live Server"**

Your browser will automatically open the app. Many of these index html files have a button element to execute the js script.

## Core Script Functions

Most scripts in this project are built around three core Cascade API functions:

#### `readAsset(type, id)`

Retrieves data for a specific asset in Cascade given the type of asset and its Cascade ID as parameters. This returns the `asset` field from the JSON response and is typically used to inspect an asset’s data, determine whether to modify it, or collect it for further processing (e.g., grouping or reporting).

#### `editAsset(type, id, asset)`

Edits an asset in Cascade given the type of asset, its Cascade ID, and the updated asset as parameters. This is typically used after reading the asset and modifying the content in the Javascript.

The `asset` parameter represents the modified version of the asset, which is sent in the request body to update the existing asset in Cascade.


#### `deleteAsset(id)`

Removes an asset from Cascade given its Cascade ID. Use with caution, as this action is permanent.

---

These three functions form the foundation of most web service interactions with the Cascade API.
By combining them, you can build automation scripts for viewing, updating, and managing content within Cascade.

