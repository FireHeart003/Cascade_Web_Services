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

Most scripts in this project are built around three core Cascade API functions.

***Attention: These methods directly affects the assets on Cascade. Please make sure you understand what you are doing, especially with the use of `deleteAsset(id)`***

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

# Web Services
This section will include information on how to perform common automation tasks using the Cascade API.

## Tag Automation
This script will automatically update the tags of posts given their Cascade IDs and is in `Cascade_Web_Services/TagManagement/`

### Running the Script
1. Right click on index.html and click on "Open with Live Server"
2. The index.html will open on localhost. Click on the "Change Tags" button to run the script.
3. Wait for the results to show on the screen(Tags deleted and pages published should be same amount)

### How it Works
1. Loop through an array of Cascade IDs for posts
2. Use `readAsset()` to retrieve the news asset by its Cascade ID
3. Find the array of tags: `json.page.tags`
4. Find the tag(s) we want to change and replace/modify the name as needed
5. Pass the updated asset into `editAsset()` to push the changes back to Cascade
6. Publish all posts to update the tags for posts in production using `publishPosts(pages)`

### Getting Cascade IDs
Use the below velocity snippet on Cascade CMS to get a list of Cascade IDs with a specific tag name.
```velocity
#set($posts = $_.query().byContentType('site://siteName/News Article').bySiteName("Site Name").hasTag("Academic and Student Affairs").maxResults(2000).execute())
#foreach ($post in $posts)
  "$post.assetId",
#end
```

### Notes
- After `changeTags()` runs, all updated pages are published using `publishPosts(pages)`. If an article has multiple tags that need to be changed, do not run the script again on the same article until the first publish has fully completed in Cascade.

- Running the script again before the publish finishes may overwrite or conflict with the previous changes, causing tags to not update correctly in production.

- Best practice: Check Cascade to confirm the article has finished publishing before running `changeTags()` on the *same* articles again.

## CEC Profile Imports(Can be replicated for other sites)
This script automates the creation of faculty/staff profile pages in Cascade by reading data from a CSV file (newProfiles.csv) and populating each profile with corresponding information. This is in "Cascade_Web_Services/CEC Redesign/ImportProfiles".

There are 3 main functionalities for the script:
- Import Profiles
- Create references for the profiles
- Update profiles with respective images

### Running the Script
1. Right click on index.html and click on "Open with Live Server"
2. The index.html will open on localhost. Click on the "Import Profiles", "Create References", and "Update Images" buttons to run the script.
3. Check for any success or error messages on the page and/or in DevTools

### How it Works
#### Import Profiles
1. Fetch and parse `newProfiles.csv` using PapaParse
2. For each profile in the CSV, create a blank page asset in Cascade using `createAsset()`
3. Use `readAsset()` to get the JSON structure of the new page
4. Populate the profile's structured data fields with CSV data, such as: Title/Position, Department, Office, Phone, Email, Research Interests, Biography, Awards & Honors, and Education
5. Pass the fully updated profile back to Cascade using `editAsset()`

#### Create References
1. Fetch and parse `newProfiles.csv` using PapaParse
2. Loop through each profile and read their name and department from the CSV
3. Match the department field to a Cascade folder path using keyword detection.
- "Biomedical" → biomedical-engineering
- "Computing" → computing-and-information-sciences
4. If a matching department is found, use `createReference()` to place the profile under that department folder in Cascade
5. If no department match is found, log an error to the output on the page(May require manual developer input to address)

#### Update Profile Images
1. Fetch and parse `newProfiles.csv` using PapaParse
2. Loop through each profile and read their first and last name from the CSV
3. Preprocess the file name into naming conventions used by Cascade (lowercase, hyphens instead of spaces, no special characters)
4. Look up the profile's Cascade asset ID from the profiles object using the parsed name
5. Read the existing profile page using `readAsset()`
6. Set the headshot image file path in the profile's structured data to /about/directory/_assets/images/[parsed-name]-headshot.webp
7. Pass the fully updated profile back to Cascade using `editAsset()`

### Notes
- With automation, there may be a need for human input to correct certain fields(Ex: The CSV might have data that is hard to parse/differnet format)
- Test with 5 rows of the CSV first by adjusting the lower and upper bounds of the for loop. This will help gauge whether the script is working as intended.

## Cascade Directory API
A browser-based tool that lets you visually navigate the Cascade CMS file structure and inspect any asset's JSON data directly from the page.

### Running the Script
1. Right click on index.html and click on "Open with Live Server"
2. The index.html will open on localhost. Click on the "List Sites" buttons to run the script.
3. Select the Cascade site in the dropdown menu.
4. Browse folders and files in a tree-like structure and displays the full JSON object

### How it Works
1. Once "List Sites" button is clicked, `getSites()` fetches all available sites from Cascade and populates the dropdown
2. When a site is selected, `getSiteData()` retrieves the site's root folder ID
3. `getRootFolder()` reads the folder contents and renders each asset as a list item with an icon based on its asset type (Folder, page, block, template, XSLT format, etc.)
4. Clicking a folder expands or collapses its contents
5. Clicking any other asset will trigger `readAsset()` and displays the full JSON in an interactive JSONEditor on the page

### Notes
- Can be expanded to check for relationships
- Works similarly to API requests on Insomnia without having to know the Cascade ID of each asset
- Uses third party libraries such as: JSONEditor for displaying asset data and Foundations for UI







