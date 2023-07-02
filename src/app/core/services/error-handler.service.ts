import {ToastController} from "@ionic/angular";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  private readonly FIREBASE_AUTH_ERROR_CODE_TITLES = {
    "auth/email-already-in-use": "Uh Oh! That Email is Busy",
    "auth/invalid-email": "Hmm, Something's Wrong with that Email",
    "auth/weak-password": "Eek! Your Password Needs More Juice",
    "auth/claims-too-large": "Whoa! Your Claims are a Bit Chunky",
    "auth/email-already-exists": "Hang on! That Email Already Exists",
    "auth/id-token-expired": "Uh Oh! Your ID Token Has Expired",
    "auth/id-token-revoked": "Oh No! Your ID Token Got Revoked",
    "auth/insufficient-permission": "Hold Up! You Need More Permissions",
    "auth/internal-error": "Oopsie Daisy! Something's Not Right Inside",
    "auth/invalid-argument": "Hmm, That Argument Doesn't Look Right",
    "auth/invalid-continue-uri": "Oops! That Continue URL Isn't Valid",
    "auth/invalid-creation-time":
      "Uh Oh! Something's Off About That Creation Time",
    "auth/invalid-credential": "Hang on! Your Credential is Off",
    "auth/invalid-disabled-field": "Oops! Invalid Disabled Field",
    "auth/invalid-display-name": "Uh Oh! That Display Name Isn't Quite Right",
    "auth/invalid-dynamic-link-domain":
      "Hold Up! That Dynamic Link Domain is Off",
    "auth/invalid-email-verified":
      "Hmm, That Email Verification Status Looks Funny",
    "auth/invalid-hash-algorithm":
      "Wait a Sec! That Hash Algorithm is Incorrect",
    "auth/invalid-hash-block-size": "Whoa! Your Hash Block Size is Off",
    "auth/invalid-hash-derived-key-length":
      "Oops! Your Hash Derived Key Length Looks Odd",
    "auth/invalid-hash-key": "Uh Oh! Your Hash Key is Wrong",
    "auth/invalid-hash-memory-cost": "Hmm, Your Hash Memory Cost is Off",
    "auth/invalid-hash-parallelization":
      "Hold On! Your Hash Parallelization is Not Right",
    "auth/invalid-hash-rounds": "Oops! Your Hash Rounds Value is Incorrect",
    "auth/invalid-hash-salt-separator":
      "Uh Oh! Your Hash Salt Separator Isn't Quite Right",
    "auth/invalid-id-token": "Oops! Your ID Token Isn't Valid",
    "auth/invalid-last-sign-in-time": "Whoa! That Last Sign-In Time Looks Off",
    "auth/invalid-page-token": "Oops! Your Page Token Isn't Quite Right",
    "auth/invalid-password": "Hmm, That Password Isn't Quite Right",
    "auth/invalid-password-hash": "Whoa! Your Password Hash is Off",
    "auth/invalid-password-salt": "Uh Oh! Your Password Salt is Wrong",
    "auth/invalid-phone-number": "Hold Up! That Phone Number Looks Odd",
    "auth/invalid-photo-url": "Whoa! That Photo URL Looks Off",
    "auth/invalid-provider-data": "Oops! Your Provider Data Isn't Quite Right",
    "auth/invalid-provider-id": "Uh Oh! Your Provider ID Looks Wrong",
    "auth/invalid-oauth-responsetype":
      "Hold On! Your OAuth Response Type is Incorrect",
    "auth/invalid-session-cookie-duration":
      "Whoa! Your Session Cookie Duration is Off",
    "auth/invalid-uid": "Oops! That UID Looks Odd",
    "auth/invalid-user-import": "Uh Oh! Your User Import Looks Off",
    "auth/maximum-user-count-exceeded":
      "Yikes! You've Hit the User Count Limit",
    "auth/missing-android-pkg-name":
      "Oops! Your Android Package Name is Missing",
    "auth/missing-continue-uri": "Uh Oh! You're Missing a Continue URL",
    "auth/missing-hash-algorithm": "Hold Up! You're Missing a Hash Algorithm",
    "auth/missing-ios-bundle-id": "Whoa! Your iOS Bundle ID is Missing",
    "auth/missing-uid": "Oops! You're Missing a UID",
    "auth/reserved-claims": "Yikes! You're Using Reserved Claims",
    "auth/session-cookie-revoked": "Oh No! Your Session Cookie Got Revoked",
    "auth/uid-already-exists": "Hold On! That UID Already Exists",
    "auth/unauthorized-continue-uri": "Whoa! You Can't Continue to That URI",
    "auth/user-not-found": "Oops! We Couldn't Find That User",
    "auth/weakschema": "Hold Up! Your Security Schema is a Bit Weak",
    "auth/invalid-claims": "Whoops, Claims are not playing nice!",
    "auth/missing-oauth-client-secret": "Sshhh! Secret's Missing!",
    "auth/operation-not-allowed": "Oops! This move is not allowed!",
    "auth/phone-number-already-exists": "Wait, this number is taken!",
    "auth/project-not-found": "Where's the Project? Can't find it!",
    "auth/session-cookie-expired": "Tick Tock, Session's up!",
  };

  private readonly FIREBASE_AUTH_ERROR_CODE_MESSAGES = {
    "auth/email-already-in-use":
      "The email address is already in use by another account.",
    "auth/invalid-email": "The email address you have entered is not valid.",
    "auth/weak-password":
      "The password you have entered is too weak. Please choose a stronger password.",
    "auth/claims-too-large":
      "The payload size exceeds the maximum size of 1000 bytes.",
    "auth/email-already-exists":
      "The provided email is already in use by another user. Please use a different email.",
    "auth/id-token-expired": "The Firebase ID token you are using has expired.",
    "auth/id-token-revoked":
      "The Firebase ID token you are using has been revoked.",
    "auth/insufficient-permission":
      "The current user does not have the necessary permissions to perform this operation.",
    "auth/internal-error":
      "An internal error occurred while processing your request. Please try again later.",
    "auth/invalid-argument": "An invalid argument was provided to the method.",
    "auth/invalid-claims":
      "The custom claim attributes you've entered are not valid. Please check them and try again.",
    "auth/invalid-continue-uri": "The continue URL must be a valid URL.",
    "auth/invalid-creation-time":
      "The creation time must be a valid UTC date string.",
    "auth/invalid-credential":
      "The credential used for authentication is not valid. Initialize the SDK with a certificate credential.",
    "auth/invalid-disabled-field":
      "The value for the disabled user property is invalid. It must be a boolean.",
    "auth/invalid-display-name":
      "The value for the display name is invalid. It must be a non-empty string.",
    "auth/invalid-dynamic-link-domain":
      "The dynamic link domain is not authorized or configured for the current project.",
    "auth/invalid-email-verified":
      "The value for the email verification status is invalid. It must be a boolean.",
    "auth/invalid-hash-algorithm":
      "The hash algorithm must match one of the supported algorithms.",
    "auth/invalid-hash-block-size":
      "The hash block size must be a valid number.",
    "auth/invalid-hash-derived-key-length":
      "The hash derived key length must be a valid number.",
    "auth/invalid-hash-key": "The hash key must be a valid byte buffer.",
    "auth/invalid-hash-memory-cost":
      "The hash memory cost must be a valid number.",
    "auth/invalid-hash-parallelization":
      "The hash parallelization must be a valid number.",
    "auth/invalid-hash-rounds": "The hash rounds must be a valid number.",
    "auth/invalid-hash-salt-separator":
      "The hashing algorithm salt separator field must be a valid byte buffer.",
    "auth/invalid-id-token":
      "The provided ID token is not a valid Firebase ID token.",
    "auth/invalid-last-sign-in-time":
      "The last sign-in time must be a valid UTC date string.",
    "auth/invalid-page-token":
      "The provided next page token in listUsers() is invalid. It must be a valid non-empty string.",
    "auth/invalid-password":
      "The provided value for the password user property is invalid. It must be a string with at least six characters.",
    "auth/invalid-password-hash":
      "The password hash must be a valid byte buffer.",
    "auth/invalid-password-salt":
      "The password salt must be a valid byte buffer.",
    "auth/invalid-phone-number":
      "The provided value for the phoneNumber is invalid. It must be a non-empty E.164 standard compliant identifier string.",
    "auth/invalid-photo-url":
      "The provided value for the photoURL user property is invalid. It must be a string URL.",
    "auth/invalid-provider-data":
      "The providerData must be a valid array of UserInfo objects.",
    "auth/invalid-provider-id":
      "The providerId must be a valid supported provider identifier string.",
    "auth/invalid-oauth-responsetype":
      "Only exactly one OAuth responseType should be set to true.",
    "auth/invalid-session-cookie-duration":
      "The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks.",
    "auth/invalid-uid":
      "The provided uid must be a non-empty string with at most 128 characters.",
    "auth/invalid-user-import": "The user record to import is invalid.",
    "auth/maximum-user-count-exceeded":
      "The maximum allowed number of users to import has been exceeded.",
    "auth/missing-android-pkg-name":
      "An Android Package Name must be provided if the Android App is required to be installed.",
    "auth/missing-continue-uri":
      "A valid continue URL must be provided in the request.",
    "auth/missing-hash-algorithm":
      "Importing users with password hashes requires that the hashing algorithm and its parameters be provided.",
    "auth/missing-ios-bundle-id": "The request is missing a Bundle ID.",
    "auth/missing-uid":
      "A uid identifier is required for the current operation.",
    "auth/missing-oauth-client-secret":
      "The OAuth configuration client secret is required to enable OIDC code flow.",
    "auth/operation-not-allowed": "Email/password accounts are not enabled.",
    "auth/phone-number-already-exists":
      "The provided phone number is already in use by an existing user. Each user must have a unique phone number.",
    "auth/project-not-found":
      "No Firebase project was found for the credential used to initialize the Admin SDKs. Refer to Set up a Firebase project for documentation on how to generate a credential for your project and use it to authenticate the Admin SDKs.",
    "auth/reserved-claims":
      "One or more custom user claims provided to setCustomUserClaims() are reserved. For example, OIDC specific claims such as (sub, iat, iss, exp, aud, auth_time, etc) should not be used as keys for custom claims.",
    "auth/session-cookie-expired":
      "The provided Firebase session cookie is expired.",
    "auth/session-cookie-revoked":
      "The Firebase session cookie has been revoked.",
    "auth/uid-already-exists":
      "The provided UID is already in use by an existing user. Each user must have a unique UID.",
    "auth/unauthorized-continue-uri":
      "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console.",
    "auth/user-not-found":
      "There is no existing user record corresponding to the provided identifier.",
    // add more error code messages as needed...
  };
  constructor(private toastController: ToastController) {}

  handleFirebaseAuthError(error: {code: string; message: string}) {
    const errorTitle =
      this.FIREBASE_AUTH_ERROR_CODE_TITLES[error.code] || "Error";
    const errorMessage =
      this.FIREBASE_AUTH_ERROR_CODE_MESSAGES[error.code] ||
      "An unknown error occurred: " + error.message;

    this.showToast(errorMessage, errorTitle); // Show the toast with the error message

    return errorMessage;
  }

  private async showToast(message: string, title: string): Promise<void> {
    const toast = await this.toastController.create({
      message: `${title}: ${message}`,
      duration: 2000,
    });
    await toast.present();
  }
}
