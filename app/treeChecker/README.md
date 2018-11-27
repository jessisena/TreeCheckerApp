# Table of contents
1. [Introduction](#introduction)
2. [Building the app](#compiling)
	1. [Requirements](#requirements)
    2. [Instructions](#instructions)
    3. [Signin the package](#considerations)
	4. [Changing the base layers](#changeLayers)
	5. [Translating the app](#translate)
3. [App walkthrough](#walkthrough)

# Introduction <a name="introduction"></a>
This document describes the Canhemon project app implementation.

For a detailed explanation about this project please refer to the documentation [here](https://github.com/jessisena/TreeCheckerApp/blob/master/README.md).

# Compiling <a name="compiling"></a>
## Requirements <a name="requirements"></a>
To build the app the following software must be installed first:
* Node
* Python
* JDK
* Android Studio

The easy way is to follow the instructions found [here](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies)

## Instructions <a name="instructions"></a>
1. Get the code from the repository:
```bash
	git clone https://github.com/jessisena/TreeCheckerApp.git
```

2. Install the project dependencies
```bash
	cd TreeCheckerApp\app\
	npm install
```

3. Install webpack globally
```bash
	npm install -g webpack
```

3. Install react-native cli globally
```bash
	npm install -g react-native-cli
```

4. Point the base URL to your domain
* Open the file *TreecheckerApp\app\treeChecker\src\actions\urls.js* and edit the following lines:

**Line 2:** Change *URL_BASE* to your domain  
**Line 3:** Change *URL_STATIC* to the url that points to the static files in your domain (see step 3 of the [server installation instructions](https://github.com/jessisena/TreeCheckerApp/tree/master/web#instructions-) )
 
5. Bundle the web views with webpack
```bash
	npm run build-web
```

6. Run the app for testing purposes
```bash
	react-native run-android
```

If something fails, please run the following command and try again
```bash
	cd android
	gradlew clean
```	

## Signing the package <a name="considerations"></a>
To sign the package so it can be freely distributed you can follow the guide found [here](https://facebook.github.io/react-native/docs/signed-apk-android.html)

## Changing the layers <a name="changeLayers"></a>
The base layers currently used by the app are defined in a JSON-like file found in `treeChecker\src\common\layerDefinitions.js` (which can be seen [here](https://github.com/jessisena/TreeCheckerApp/blob/master/app/treeChecker/src/common/layerDefinitions.js) )
* The base layer is defined in the *osm* object
* The *downloadables* array contains the names of the objects where the layers that must be downloaded when creating a new AOI are defined. **Warning:** The names defined in the array must be the names of one of the objects found in the *LayerDefinitions* object
* To add or replace a layer definition you only have to change the WMS parameters defined there.

## Translating the app <a name="translate"></a>
The app uses the [ReactNativeLocalization](https://github.com/stefalda/ReactNativeLocalization) plugin to manage the app translations. It's, currently, only translated in English but it's really easy to add a localization to another language.

The app reads all the text it uses from a JSON-like file found in `treeChecker\src\screens\string.js` (which can be seen [here](https://github.com/jessisena/TreeCheckerApp/blob/master/app/treeChecker/src/screens/strings.js) )

To add a translation just follow the structure defined in the *en* object.

To use another language just execute the following instruction when the language is selected or in the app initialization:
```javascript
	strings.setLanguage('it');
```

# App walkthrough <a name="walkthrough"></a>
Here is a list of app screens with a short description of what they do

| | |
|---|---|
| ![startup](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/startup.png)  |  **Start screen** |
| ![login](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/login.png) | **Login screen:** The user enters the email and password used to log in the application |
| ![tutorial](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/tutorial.png) | **Tutorial:** A brief explanation about the application |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/selectGZ.png) | **Select geographical zone:** The app presents the user a list of the geographical zones in the server. Some of the geographical zones may be disabled if the user doesn't have enough privileges |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/aoiList.png) | **AOI list:** The app presents the user with a list of the own areas of interest. The user can select or delete one of the existing areas or create a new one|
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/createAOI.png) | **Create AOI:** To create an AOI the user needs to select an area with less than 15 square kilometers. |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/nameAOI.png) | **Download AOI:** After selecting the area and introducing a name, the user can download the data contained within the area to be available when offline |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/mapView.png) | **Map view:** The screen shows a map with an OSM base layer, another for the downloaded layer and another for the survey data the user has introduced |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/dataView.png) | **Data view:** The screen shows the same data as before but in a list format |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/viewSD.png) | **View survey data:** When the user clicks a marker in the map view screen or an element of the data view screen, this screen appears where the user can see all the data linked to that survey data |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/editSD.png) | **Edit survey data:** The user can edit a survey data changing all its data and its position |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/addData.png) | **Add survey data:** When the user long clicks a position on the map, the create survey data screen is presented |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/menu.png) | **Menu:** Pressing the menu button on the header of most screens the user can enter the menu screen where he can see its profile data, see the tutorial or change the geographical zone |
| ![gz](https://github.com/jessisena/TreeCheckerApp/raw/master/app/treeChecker/docs/profile.png) | **Profile:** The user can see its data and logout |