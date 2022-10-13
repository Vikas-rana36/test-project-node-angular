// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APP_NAME:"Sync Healthcare",
  APP_SHORT_NAME:"SH",
  VERSION:"1.0.0",
  APP_TOKEN_NAME:"SH-Admin-auth-token",
  //API_ENDPOINT: 'https://apisynchealth.trigma.in',
  API_ENDPOINT: 'http://localhost:3028',
  MESSAGES:{
    "SUCCESSFULLY-LOGOUT":"Loggedout Successfully",
    "CHECKING-AUTHORIZATION":"Checking Authorization",
    "SAVING-INFO":"Saving Information. Please Wait..",
    "SUCCESSFULLY-SAVED":"Your information has been saved successfully.",
    "FETCHING-RECORDS":"Fetching Records",
    "SUCCESSFULLY-DELETED":"Record has been deleted successfully.",
    "CAN-NOT-DELETE":"Can not delete this record because it is attached with other records",
    "EMAIL-SENT":"Email has been sent. Please check your inbox for further instructions.",
    "STATUS-UPDATED":"Status has been updated successfully.",
    "SYSTEM-ERROR":"We got some system error. Please try again."    
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
