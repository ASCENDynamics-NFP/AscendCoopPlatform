// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Not sure if I should be including this information in the project, but it is to the Dev environment.
// If anyone has any suggestions on how to move these variables to somewhere more secure, please open an issue or discussion.
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyANjzfTzU-62ekvFggGw245pW-hGRUVDTs",
    authDomain: "ascendcoopplatform-dev.firebaseapp.com",
    databaseURL: "https://ascendcoopplatform-dev-default-rtdb.firebaseio.com",
    projectId: "ascendcoopplatform-dev",
    storageBucket: "ascendcoopplatform-dev.appspot.com",
    messagingSenderId: "360409127691",
    appId: "1:360409127691:web:2f85677b217e07ea0ca00e",
    measurementId: "G-NP98VWJ3S9",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
