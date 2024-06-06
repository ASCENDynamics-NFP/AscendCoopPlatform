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
      title: "Email Already in Use",
      message:
        "The email address is already in use by another account. Please use a different email.",
    },
    "auth/invalid-email": {
      title: "Invalid Email",
      message:
        "The email address you have entered is not valid. Please enter a valid email address.",
    },
    "auth/weak-password": {
      title: "Weak Password",
      message:
        "The password you have entered is too weak. Please choose a stronger password.",
    },
    "auth/claims-too-large": {
      title: "Claims Too Large",
      message: "The payload size exceeds the maximum size of 1000 bytes.",
    },
    "auth/email-already-exists": {
      title: "Email Already Exists",
      message:
        "The provided email is already in use by another user. Please use a different email.",
    },
    "auth/id-token-expired": {
      title: "ID Token Expired",
      message:
        "The Firebase ID token you are using has expired. Please log in again.",
    },
    "auth/id-token-revoked": {
      title: "ID Token Revoked",
      message:
        "The Firebase ID token you are using has been revoked. Please log in again.",
    },
    "auth/insufficient-permission": {
      title: "Insufficient Permissions",
      message:
        "You do not have the necessary permissions to perform this operation.",
    },
    "auth/internal-error": {
      title: "Internal Error",
      message:
        "An internal error occurred while processing your request. Please try again later.",
    },
    "auth/invalid-argument": {
      title: "Invalid Argument",
      message:
        "An invalid argument was provided. Please check the input and try again.",
    },
    "auth/invalid-claims": {
      title: "Invalid Claims",
      message:
        "The custom claim attributes you have entered are not valid. Please check them and try again.",
    },
    "auth/missing-oauth-client-secret": {
      title: "Missing OAuth Client Secret",
      message:
        "The OAuth configuration client secret is required to enable OIDC code flow.",
    },
    "auth/operation-not-allowed": {
      title: "Operation Not Allowed",
      message:
        "Email/password accounts are not enabled. Please contact support at support@ascendynamics.org.",
    },
    "auth/phone-number-already-exists": {
      title: "Phone Number Already Exists",
      message:
        "The provided phone number is already in use by another user. Each user must have a unique phone number.",
    },
    "auth/project-not-found": {
      title: "Project Not Found",
      message:
        "No Firebase project was found for the credential used to initialize the Admin SDKs.",
    },
    "auth/session-cookie-expired": {
      title: "Session Cookie Expired",
      message:
        "The provided Firebase session cookie is expired. Please log in again.",
    },
    "auth/weakschema": {
      title: "Weak Security Schema",
      message:
        "The security rules provided are not strong enough. Please provide stronger security rules and try again.",
    },
    "auth/invalid-continue-uri": {
      title: "Invalid Continue URL",
      message: "The continue URL must be a valid URL.",
    },
    "auth/invalid-creation-time": {
      title: "Invalid Creation Time",
      message: "The creation time must be a valid UTC date string.",
    },
    "auth/invalid-credential": {
      title: "Invalid Credential",
      message:
        "The credential used for authentication is not valid. Please use a valid credential.",
    },
    "auth/invalid-disabled-field": {
      title: "Invalid Disabled Field",
      message:
        "The value for the disabled user property is invalid. It must be a boolean.",
    },
    "auth/invalid-display-name": {
      title: "Invalid Display Name",
      message:
        "The value for the display name is invalid. It must be a non-empty string.",
    },
    "auth/invalid-dynamic-link-domain": {
      title: "Invalid Dynamic Link Domain",
      message:
        "The dynamic link domain is not authorized or configured for the current project.",
    },
    "auth/invalid-email-verified": {
      title: "Invalid Email Verification Status",
      message:
        "The value for the email verification status is invalid. It must be a boolean.",
    },
    "auth/invalid-hash-algorithm": {
      title: "Invalid Hash Algorithm",
      message: "The hash algorithm must match one of the supported algorithms.",
    },
    "auth/invalid-hash-block-size": {
      title: "Invalid Hash Block Size",
      message: "The hash block size must be a valid number.",
    },
    "auth/invalid-hash-derived-key-length": {
      title: "Invalid Hash Derived Key Length",
      message: "The hash derived key length must be a valid number.",
    },
    "auth/invalid-hash-key": {
      title: "Invalid Hash Key",
      message: "The hash key must be a valid byte buffer.",
    },
    "auth/invalid-hash-memory-cost": {
      title: "Invalid Hash Memory Cost",
      message: "The hash memory cost must be a valid number.",
    },
    "auth/invalid-hash-parallelization": {
      title: "Invalid Hash Parallelization",
      message: "The hash parallelization must be a valid number.",
    },
    "auth/invalid-hash-rounds": {
      title: "Invalid Hash Rounds",
      message: "The hash rounds must be a valid number.",
    },
    "auth/invalid-hash-salt-separator": {
      title: "Invalid Hash Salt Separator",
      message:
        "The hashing algorithm salt separator field must be a valid byte buffer.",
    },
    "auth/invalid-id-token": {
      title: "Invalid ID Token",
      message: "The provided ID token is not a valid Firebase ID token.",
    },
    "auth/invalid-last-sign-in-time": {
      title: "Invalid Last Sign-In Time",
      message: "The last sign-in time must be a valid UTC date string.",
    },
    "auth/invalid-page-token": {
      title: "Invalid Page Token",
      message:
        "The provided next page token in listUsers() is invalid. It must be a valid non-empty string.",
    },
    "auth/invalid-password": {
      title: "Invalid Password",
      message:
        "The provided value for the password user property is invalid. It must be a string with at least six characters.",
    },
    "auth/invalid-password-hash": {
      title: "Invalid Password Hash",
      message: "The password hash must be a valid byte buffer.",
    },
    "auth/invalid-password-salt": {
      title: "Invalid Password Salt",
      message: "The password salt must be a valid byte buffer.",
    },
    "auth/invalid-phone-number": {
      title: "Invalid Phone Number",
      message:
        "The provided value for the phone number is invalid. It must be a non-empty E.164 standard compliant identifier string.",
    },
    "auth/invalid-photo-url": {
      title: "Invalid Photo URL",
      message:
        "The provided value for the photoURL user property is invalid. It must be a string URL.",
    },
    "auth/invalid-provider-data": {
      title: "Invalid Provider Data",
      message: "The providerData must be a valid array of UserInfo objects.",
    },
    "auth/invalid-provider-id": {
      title: "Invalid Provider ID",
      message:
        "The providerId must be a valid supported provider identifier string.",
    },
    "auth/invalid-oauth-responsetype": {
      title: "Invalid OAuth Response Type",
      message: "Only exactly one OAuth responseType should be set to true.",
    },
    "auth/invalid-session-cookie-duration": {
      title: "Invalid Session Cookie Duration",
      message:
        "The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks.",
    },
    "auth/invalid-uid": {
      title: "Invalid UID",
      message:
        "The provided UID must be a non-empty string with at most 128 characters.",
    },
    "auth/invalid-user-import": {
      title: "Invalid User Import",
      message: "The user record to import is invalid.",
    },
    "auth/maximum-user-count-exceeded": {
      title: "Maximum User Count Exceeded",
      message:
        "The maximum allowed number of users to import has been exceeded.",
    },
    "auth/missing-android-pkg-name": {
      title: "Missing Android Package Name",
      message:
        "An Android Package Name must be provided if the Android App is required to be installed.",
    },
    "auth/missing-continue-uri": {
      title: "Missing Continue URL",
      message: "A valid continue URL must be provided in the request.",
    },
    "auth/missing-hash-algorithm": {
      title: "Missing Hash Algorithm",
      message:
        "Importing users with password hashes requires that the hashing algorithm and its parameters be provided.",
    },
    "auth/missing-ios-bundle-id": {
      title: "Missing iOS Bundle ID",
      message: "The request is missing a Bundle ID.",
    },
    "auth/missing-uid": {
      title: "Missing UID",
      message: "A UID identifier is required for the current operation.",
    },
    "auth/reserved-claims": {
      title: "Reserved Claims Used",
      message:
        "One or more custom user claims provided to setCustomUserClaims() are reserved and should not be used.",
    },
    "auth/session-cookie-revoked": {
      title: "Session Cookie Revoked",
      message: "The Firebase session cookie has been revoked.",
    },
    "auth/uid-already-exists": {
      title: "UID Already Exists",
      message:
        "The provided UID is already in use by another user. Each user must have a unique UID.",
    },
    "auth/unauthorized-continue-uri": {
      title: "Unauthorized Continue URL",
      message:
        "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console.",
    },
    "auth/user-not-found": {
      title: "User Not Found",
      message:
        "There is no existing user record corresponding to the provided identifier.",
    },
    "auth/wrong-password": {
      title: "Incorrect Password",
      message: "The password you have entered is incorrect. Please try again.",
    },
    "auth/invalid-action-code": {
      title: "Invalid Action Code",
      message:
        "The action code in your link seems to be incorrect or expired. Please request a new one.",
    },
    "storage/unauthorized": {
      title: "Unauthorized Upload",
      message:
        "You don't have permission to upload this file. Ensure the file is a JPEG, PNG, or GIF and is no larger than 5MB.",
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
