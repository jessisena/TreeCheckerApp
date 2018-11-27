import LocalizedStrings from 'react-native-localization';

export const strings = new LocalizedStrings({
 'en': {

   Welcome: 'Welcome',
   start: 'START',

   username: 'username',
   Username: 'Username',
   Email: 'Email',
   password: 'password',
   Password: 'Password',
   connectionNeeded: 'Network connection needed',
   errorRefreshingToken: 'An error ocurred while refreshing your session. Please, do log out and log in again to solve it',

   walk01: 'First of all choose your region of interest, among the available options.',
   walk02: '',


   regionOfInterest: 'Region of interest',
   go: 'GO',
   gznotrefreshed: 'The data has not been refreshed with the server (Local data will be used)',

   selectAOItitle: 'Select your area of interest:',
   deleteAOI: 'Delete AOI',
   uploadAOIerror: 'Problem uploading to the server. The AOI may not have been created correctly',
   funcWithConnection: 'Functionality only available with connection',
   noAOIS: 'No AOIs added yet',
   aoinotdeleted: 'The AOI has not been deleted from the server',
   errordownloadtiles: 'A problem ocurred while downloading the AOI, and the map could be not propperly stored for the offline use.',

   myObservations: 'MY OBSERVATIONS',
   itemAlreadySync: 'Observation already up to date',
   obshasbeensync: 'has been synchronized with the server',
   obshasnotbeensync: 'has not been synchronized with the server',
   obshasbeendeleted: 'has been deleted from the server',
   obshasnotbeendeleted: 'has not been deleted from the server',

   progressDialog: 'Progress Dialog',
   syncMessage: 'Synchronizing, please wait ...',
   infoAddMessage: 'Long-click on the map to add a new observation',
   selAOI: 'Select your area of interest:',
   selNewAOI: '1. Select your new area of interest:',
   nameAOI: '2. Please, name your area of interest and press the download button',
   createAOI1: 'Create AOI (1/2)',
   createAOI2: 'Create AOI (2/2)',
   aoiNameInput: 'AOI name',
   close: 'Close',
   download: 'Download',
   next: 'Next',
   prev: 'Previous',

   moveMap: 'Move the map to a new Position',
   editData: 'Update data...',
   addData: 'Add new data...',
   name: 'Name',
   treeSpecies: 'Tree Species',
   treeSpecie: 'Tree Specie',
   crown: 'Crown diameter',
   canopy: 'Canopy status',
   photo: 'Photo',
   comment: 'Comment',
   edit: 'Edit',
   delete: 'Delete',
   deleteImage: 'Delete Image',
   goto: 'Go to',
   mydata: 'My data',
   headerDetailDataScreen: 'Detail Data Observation',
   cancel: 'Cancel',
   save: 'Save',
   deleteObservation: 'Delete Observation',
   confirmDeleteMessage: 'Are you sure you want to delete this?',
   yes: 'yes',
   no: 'no',
   yourprof: 'Your profile',
   tutorial: 'Tutorial',
   changeRegion: 'Change Region',
   userInfo: 'User Information',
   email: 'Email',
   occupation: 'Occupation',
   countryRegion: 'Country/Region',
   logout: 'LOG OUT',
   login: 'LOG IN',
   menu: 'Menu',
   aoiList: 'AOI List',
   dataTabName: 'DATA',
   mapTabName: 'MAP',

   regionOfInterestWTText: 'First of all, choose your region of interest.',
   areaOfInterest: 'Area of interest',
   areaOfInterestWTText: 'Select your area of interest. If you haven’t created one yet, press the bottom right button. ',
   createAOI1WTText: 'Drag the vertices of the polygon to cover the area you are interested in. Once the download process has finished, data for this area will be available offline. Note that bigger areas will take longer to download and more storage space.',
   createAOI2WTText: 'Give the selected area a name, and press the Download button. Then wait for the download to complete',
   mapWTTitle: 'Map visualization',
   mapWTText: 'Once you have selected an area, you will enter in the Map View. Here you can navigate through the map and explore all the observations available in the area. You can check and edit your own observations, by selecting them on the map.',
   dataWTTitle: 'Data visualization',
   dataWTText: 'By pressing the Data tab, you can visualize all your data in a List View. It will tell you if your observations are not synchronized with the server.server. When you\'re online you can sync the new observations, in List View.',
   detailWTTitle: 'Detail Data',
   detailWTText: 'You can check the information recorded for each observation',
   editWTTitle: 'Edit Data',
   editWTText: 'You can edit the information of an observation.',
   menuWTText: 'By pressing the menu button (top right header of the main screens), you can access your user profile, log out, or check this tutorial again.',

 }
});
