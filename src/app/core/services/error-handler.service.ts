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
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlerService {
  constructor(
    private toastController: ToastController,
    private translate: TranslateService,
  ) {}

  handleFirebaseAuthError(error: {code: string; message: string}) {
    // Map Firebase error codes to translation keys
    const errorMapping: {
      [key: string]: {titleKey: string; messageKey: string};
    } = {
      "auth/email-already-in-use": {
        titleKey: "errors.auth_email_already_in_use_title",
        messageKey: "errors.auth_email_already_in_use_message",
      },
      "auth/invalid-email": {
        titleKey: "errors.auth_invalid_email_title",
        messageKey: "errors.auth_invalid_email_message",
      },
      "auth/weak-password": {
        titleKey: "errors.auth_weak_password_title",
        messageKey: "errors.auth_weak_password_message",
      },
      "auth/user-disabled": {
        titleKey: "errors.auth_user_disabled_title",
        messageKey: "errors.auth_user_disabled_message",
      },
      "auth/user-not-found": {
        titleKey: "errors.auth_user_not_found_title",
        messageKey: "errors.auth_user_not_found_message",
      },
      "auth/account-exists-with-different-credential": {
        titleKey: "errors.auth_account_exists_with_different_credential_title",
        messageKey:
          "errors.auth_account_exists_with_different_credential_message",
      },
      "auth/email-not-verified": {
        titleKey: "errors.auth_email_not_verified_title",
        messageKey: "errors.auth_email_not_verified_message",
      },
      "auth/requires-recent-login": {
        titleKey: "errors.auth_requires_recent_login_title",
        messageKey: "errors.auth_requires_recent_login_message",
      },
      "auth/provider-already-linked": {
        titleKey: "errors.auth_provider_already_linked_title",
        messageKey: "errors.auth_provider_already_linked_message",
      },
      "auth/credential-already-in-use": {
        titleKey: "errors.auth_credential_already_in_use_title",
        messageKey: "errors.auth_credential_already_in_use_message",
      },
      "auth/invalid-credential": {
        titleKey: "errors.auth_invalid_credential_title",
        messageKey: "errors.auth_invalid_credential_message",
      },
      "auth/operation-not-allowed": {
        titleKey: "errors.auth_operation_not_allowed_title",
        messageKey: "errors.auth_operation_not_allowed_message",
      },
      "auth/invalid-phone-number": {
        titleKey: "errors.auth_invalid_phone_number_title",
        messageKey: "errors.auth_invalid_phone_number_message",
      },
      "auth/missing-phone-number": {
        titleKey: "errors.auth_missing_phone_number_title",
        messageKey: "errors.auth_missing_phone_number_message",
      },
      "auth/quota-exceeded": {
        titleKey: "errors.auth_quota_exceeded_title",
        messageKey: "errors.auth_quota_exceeded_message",
      },
      "auth/email-already-exists": {
        titleKey: "errors.auth_email_already_exists_title",
        messageKey: "errors.auth_email_already_exists_message",
      },
      "auth/phone-number-already-exists": {
        titleKey: "errors.auth_phone_number_already_exists_title",
        messageKey: "errors.auth_phone_number_already_exists_message",
      },
      "auth/uid-already-exists": {
        titleKey: "errors.auth_uid_already_exists_title",
        messageKey: "errors.auth_uid_already_exists_message",
      },
      "auth/unauthorized-continue-uri": {
        titleKey: "errors.auth_unauthorized_continue_uri_title",
        messageKey: "errors.auth_unauthorized_continue_uri_message",
      },
      "auth/invalid-continue-uri": {
        titleKey: "errors.auth_invalid_continue_uri_title",
        messageKey: "errors.auth_invalid_continue_uri_message",
      },
      "auth/missing-continue-uri": {
        titleKey: "errors.auth_missing_continue_uri_title",
        messageKey: "errors.auth_missing_continue_uri_message",
      },
      "auth/missing-email": {
        titleKey: "errors.auth_missing_email_title",
        messageKey: "errors.auth_missing_email_message",
      },
      "auth/missing-uid": {
        titleKey: "errors.auth_missing_uid_title",
        messageKey: "errors.auth_missing_uid_message",
      },
      "auth/invalid-login-credentials": {
        titleKey: "errors.auth_invalid_login_credentials_title",
        messageKey: "errors.auth_invalid_login_credentials_message",
      },
      "auth/too-many-requests": {
        titleKey: "errors.auth_too_many_requests_title",
        messageKey: "errors.auth_too_many_requests_message",
      },
      "auth/network-request-failed": {
        titleKey: "errors.auth_network_request_failed_title",
        messageKey: "errors.auth_network_request_failed_message",
      },
      "auth/internal-error": {
        titleKey: "errors.auth_internal_error_title",
        messageKey: "errors.auth_internal_error_message",
      },
      "auth/wrong-password": {
        titleKey: "errors.auth_wrong_password_title",
        messageKey: "errors.auth_wrong_password_message",
      },
      "auth/invalid-action-code": {
        titleKey: "errors.auth_invalid_action_code_title",
        messageKey: "errors.auth_invalid_action_code_message",
      },
      "storage/unauthorized": {
        titleKey: "errors.storage_unauthorized_title",
        messageKey: "errors.storage_unauthorized_message",
      },
    };

    let titleKey = "errors.generic_error";
    let messageKey = "";
    const fallbackMessage = error.message;

    if (errorMapping.hasOwnProperty(error.code)) {
      titleKey = errorMapping[error.code].titleKey;
      messageKey = errorMapping[error.code].messageKey;
    }

    // Get translated strings
    const title = this.translate.instant(titleKey);
    const message = messageKey
      ? this.translate.instant(messageKey)
      : fallbackMessage;

    this.showToast(message, title);

    return message;
  }

  private async showToast(message: string, title: string): Promise<void> {
    const closeText = this.translate.instant("errors.close");
    const toast = await this.toastController.create({
      message: `${title}: ${message}`,
      duration: 8000,
      position: "top",
      color: "danger",
      buttons: [
        {
          text: closeText,
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }
}
