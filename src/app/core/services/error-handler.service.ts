/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {ToastController} from "@ionic/angular";
import {Injectable} from "@angular/core";

interface AuthError {
  title: string;
  message: string;
}
interface AuthErrorMap {
  [key: string]: AuthError;
}

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  private readonly FIREBASE_AUTH_ERROR: AuthErrorMap = {
    "auth/email-already-in-use": {
      title: "Uh Oh! That Email is Busy",
      message: "The email address is already in use by another account.",
    },
    "auth/invalid-email": {
      title: "Hmm, Something's Wrong with that Email",
      message: "The email address you have entered is not valid.",
    },
    "auth/weak-password": {
      title: "Eek! Your Password Needs More Juice",
      message:
        "The password you have entered is too weak. Please choose a stronger password.",
    },
    "auth/claims-too-large": {
      title: "Whoa! Your Claims are a Bit Chunky",
      message: "The payload size exceeds the maximum size of 1000 bytes.",
    },
    "auth/email-already-exists": {
      title: "Hang on! That Email Already Exists",
      message:
        "The provided email is already in use by another user. Please use a different email.",
    },
    "auth/id-token-expired": {
      title: "Uh Oh! Your ID Token Has Expired",
      message: "The Firebase ID token you are using has expired.",
    },
    "auth/id-token-revoked": {
      title: "Oh No! Your ID Token Got Revoked",
      message: "The Firebase ID token you are using has been revoked.",
    },
    "auth/insufficient-permission": {
      title: "Hold Up! You Need More Permissions",
      message:
        "The current user does not have the necessary permissions to perform this operation.",
    },
    "auth/internal-error": {
      title: "Oopsie Daisy! Something's Not Right Inside",
      message:
        "An internal error occurred while processing your request. Please try again later.",
    },
    "auth/invalid-argument": {
      title: "Hmm, That Argument Doesn't Look Right",
      message: "An invalid argument was provided to the method.",
    },
    "auth/invalid-claims": {
      title: "Whoops, Claims are not playing nice!",
      message:
        "The custom claim attributes you've entered are not valid. Please check them and try again.",
    },
    "auth/missing-oauth-client-secret": {
      title: "Sshhh! Secret's Missing!",
      message:
        "The OAuth configuration client secret is required to enable OIDC code flow.",
    },
    "auth/operation-not-allowed": {
      title: "Oops! This move is not allowed!",
      message: "Email/password accounts are not enabled.",
    },
    "auth/phone-number-already-exists": {
      title: "Wait, this number is taken!",
      message:
        "The provided phone number is already in use by an existing user. Each user must have a unique phone number.",
    },
    "auth/project-not-found": {
      title: "Where's the Project? Can't find it!",
      message:
        "No Firebase project was found for the credential used to initialize the Admin SDKs. Refer to Set up a Firebase project for documentation on how to generate a credential for your project and use it to authenticate the Admin SDKs.",
    },
    "auth/session-cookie-expired": {
      title: "Tick Tock, Session's up!",
      message: "The provided Firebase session cookie is expired.",
    },
    "auth/weakschema": {
      title: "Hold Up! Your Security Schema is a Bit Weak",
      message:
        "The security rules provided are not strong enough. Please provide stronger security rules and try again.",
    },
    "auth/invalid-continue-uri": {
      title: "Oops! That Continue URL Isn't Valid",
      message: "The continue URL must be a valid URL.",
    },
    "auth/invalid-creation-time": {
      title: "Uh Oh! Something's Off About That Creation Time",
      message: "The creation time must be a valid UTC date string.",
    },
    "auth/invalid-credential": {
      title: "Hang on! Your Credential is Off",
      message:
        "The credential used for authentication is not valid. Initialize the SDK with a certificate credential.",
    },
    "auth/invalid-disabled-field": {
      title: "Oops! Invalid Disabled Field",
      message:
        "The value for the disabled user property is invalid. It must be a boolean.",
    },
    "auth/invalid-display-name": {
      title: "Uh Oh! That Display Name Isn't Quite Right",
      message:
        "The value for the display name is invalid. It must be a non-empty string.",
    },
    "auth/invalid-dynamic-link-domain": {
      title: "Hold Up! That Dynamic Link Domain is Off",
      message:
        "The dynamic link domain is not authorized or configured for the current project.",
    },
    "auth/invalid-email-verified": {
      title: "Hmm, That Email Verification Status Looks Funny",
      message:
        "The value for the email verification status is invalid. It must be a boolean.",
    },
    "auth/invalid-hash-algorithm": {
      title: "Wait a Sec! That Hash Algorithm is Incorrect",
      message: "The hash algorithm must match one of the supported algorithms.",
    },
    "auth/invalid-hash-block-size": {
      title: "Whoa! Your Hash Block Size is Off",
      message: "The hash block size must be a valid number.",
    },
    "auth/invalid-hash-derived-key-length": {
      title: "Oops! Your Hash Derived Key Length Looks Odd",
      message: "The hash derived key length must be a valid number.",
    },
    "auth/invalid-hash-key": {
      title: "Uh Oh! Your Hash Key is Wrong",
      message: "The hash key must be a valid byte buffer.",
    },
    "auth/invalid-hash-memory-cost": {
      title: "Hmm, Your Hash Memory Cost is Off",
      message: "The hash memory cost must be a valid number.",
    },
    "auth/invalid-hash-parallelization": {
      title: "Hold On! Your Hash Parallelization is Not Right",
      message: "The hash parallelization must be a valid number.",
    },
    "auth/invalid-hash-rounds": {
      title: "Oops! Your Hash Rounds Value is Incorrect",
      message: "The hash rounds must be a valid number.",
    },
    "auth/invalid-hash-salt-separator": {
      title: "Uh Oh! Your Hash Salt Separator Isn't Quite Right",
      message:
        "The hashing algorithm salt separator field must be a valid byte buffer.",
    },
    "auth/invalid-id-token": {
      title: "Oops! Your ID Token Isn't Valid",
      message: "The provided ID token is not a valid Firebase ID token.",
    },
    "auth/invalid-last-sign-in-time": {
      title: "Whoa! That Last Sign-In Time Looks Off",
      message: "The last sign-in time must be a valid UTC date string.",
    },
    "auth/invalid-page-token": {
      title: "Oops! Your Page Token Isn't Quite Right",
      message:
        "The provided next page token in listUsers() is invalid. It must be a valid non-empty string.",
    },
    "auth/invalid-password": {
      title: "Hmm, That Password Isn't Quite Right",
      message:
        "The provided value for the password user property is invalid. It must be a string with at least six characters.",
    },
    "auth/invalid-password-hash": {
      title: "Whoa! Your Password Hash is Off",
      message: "The password hash must be a valid byte buffer.",
    },
    "auth/invalid-password-salt": {
      title: "Uh Oh! Your Password Salt is Wrong",
      message: "The password salt must be a valid byte buffer.",
    },
    "auth/invalid-phone-number": {
      title: "Hold Up! That Phone Number Looks Odd",
      message:
        "The provided value for the phoneNumber is invalid. It must be a non-empty E.164 standard compliant identifier string.",
    },
    "auth/invalid-photo-url": {
      title: "Whoa! That Photo URL Looks Off",
      message:
        "The provided value for the photoURL user property is invalid. It must be a string URL.",
    },
    "auth/invalid-provider-data": {
      title: "Oops! Your Provider Data Isn't Quite Right",
      message: "The providerData must be a valid array of UserInfo objects.",
    },
    "auth/invalid-provider-id": {
      title: "Uh Oh! Your Provider ID Looks Wrong",
      message:
        "The providerId must be a valid supported provider identifier string.",
    },
    "auth/invalid-oauth-responsetype": {
      title: "Hold On! Your OAuth Response Type is Incorrect",
      message: "Only exactly one OAuth responseType should be set to true.",
    },
    "auth/invalid-session-cookie-duration": {
      title: "Whoa! Your Session Cookie Duration is Off",
      message:
        "The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks.",
    },
    "auth/invalid-uid": {
      title: "Oops! That UID Looks Odd",
      message:
        "The provided uid must be a non-empty string with at most 128 characters.",
    },
    "auth/invalid-user-import": {
      title: "Uh Oh! Your User Import Looks Off",
      message: "The user record to import is invalid.",
    },
    "auth/maximum-user-count-exceeded": {
      title: "Yikes! You've Hit the User Count Limit",
      message:
        "The maximum allowed number of users to import has been exceeded.",
    },
    "auth/missing-android-pkg-name": {
      title: "Oops! Your Android Package Name is Missing",
      message:
        "An Android Package Name must be provided if the Android App is required to be installed.",
    },
    "auth/missing-continue-uri": {
      title: "Uh Oh! You're Missing a Continue URL",
      message: "A valid continue URL must be provided in the request.",
    },
    "auth/missing-hash-algorithm": {
      title: "Hold Up! You're Missing a Hash Algorithm",
      message:
        "Importing users with password hashes requires that the hashing algorithm and its parameters be provided.",
    },
    "auth/missing-ios-bundle-id": {
      title: "Whoa! Your iOS Bundle ID is Missing",
      message: "The request is missing a Bundle ID.",
    },
    "auth/missing-uid": {
      title: "Oops! You're Missing a UID",
      message: "A uid identifier is required for the current operation.",
    },
    "auth/reserved-claims": {
      title: "Yikes! You're Using Reserved Claims",
      message:
        "One or more custom user claims provided to setCustomUserClaims() are reserved. For example, OIDC specific claims such as (sub, iat, iss, exp, aud, auth_time, etc) should not be used as keys for custom claims.",
    },
    "auth/session-cookie-revoked": {
      title: "Oh No! Your Session Cookie Got Revoked",
      message: "The Firebase session cookie has been revoked.",
    },
    "auth/uid-already-exists": {
      title: "Hold On! That UID Already Exists",
      message:
        "The provided UID is already in use by an existing user. Each user must have a unique UID.",
    },
    "auth/unauthorized-continue-uri": {
      title: "Whoa! You Can't Continue to That URI",
      message:
        "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console.",
    },
    "auth/user-not-found": {
      title: "Oops! We Couldn't Find That User",
      message:
        "There is no existing user record corresponding to the provided identifier.",
    },
    "auth/wrong-password": {
      title: "Oops! Slippery Fingers?",
      message:
        "The password you've entered is incorrect. Don't worry, we all forget sometimes! Try again, and remember, your password is case sensitive.",
    },
    "auth/invalid-action-code": {
      title: "Hmm, That's a Puzzling Code",
      message:
        "The action code in your link seems to be incorrect or expired. Make sure you've copied it right or request a new one!",
    },
    "storage/unauthorized": {
      title: "Uh Oh! You Don't Have Permission to Upload That File",
      message:
        "You don't have permission to upload this file. Please ensure the file is a JPEG, PNG, or GIF and is no larger than 5MB.",
    },
  };

  constructor(private toastController: ToastController) {}

  handleFirebaseAuthError(error: {code: string; message: string}) {
    let title = "Error";
    let message = error.message;

    if (this.FIREBASE_AUTH_ERROR.hasOwnProperty(error.code)) {
      title = this.FIREBASE_AUTH_ERROR[error.code]?.title;
      message = this.FIREBASE_AUTH_ERROR[error.code]?.message;
    }

    this.showToast(message, title); // Show the toast with the error message

    return message;
  }

  private async showToast(message: string, title: string): Promise<void> {
    const toast = await this.toastController.create({
      message: `${title}: ${message}`,
      duration: 8000,
      position: "top",
      color: "danger",
      buttons: [
        {
          text: "Close",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }
}
