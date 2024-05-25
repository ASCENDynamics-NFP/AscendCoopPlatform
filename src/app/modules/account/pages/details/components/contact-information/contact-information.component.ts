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
import {Component, Input} from "@angular/core";
import {
  Account,
  Address,
  Email,
  PhoneNumber,
} from "../../../../../../models/account.model";

@Component({
  selector: "app-contact-information",
  templateUrl: "./contact-information.component.html",
  styleUrls: ["./contact-information.component.scss"],
  standalone: false,
})
export class ContactInformationComponent {
  _account!: Partial<Account>;
  showMore = {
    phone: false,
    email: false,
    address: false,
  };

  get account() {
    return this._account;
  }

  @Input() set account(account: Partial<Account> | undefined) {
    if (!account) {
      return;
    }
    this._account = account;
  }

  get hasMoreThanOnePhoneNumber(): boolean {
    return (
      this.account?.contactInformation?.phoneNumbers?.length !== undefined &&
      this.account.contactInformation.phoneNumbers.length > 1
    );
  }

  get hasMoreThanOneEmail(): boolean {
    return (
      this.account?.contactInformation?.emails?.length !== undefined &&
      this.account.contactInformation.emails.length > 1
    );
  }

  get hasMoreThanOneAddress(): boolean {
    return (
      this.account?.contactInformation?.addresses?.length !== undefined &&
      this.account.contactInformation.addresses.length > 1
    );
  }

  getFirstPhoneNumber(): string {
    const phoneNumbers = this.account?.contactInformation?.phoneNumbers;
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return "-";
    }
    return this.formatPhoneNumber(phoneNumbers[0]);
  }

  formatPhoneNumber(phone: PhoneNumber): string {
    if (!phone.number) return "-";
    const formattedNumber = phone.number.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1 $2-$3",
    );
    const emergencyIndicator = phone.isEmergencyNumber ? "(E)" : "";
    return `${phone.type || ""}${emergencyIndicator}: ${phone.countryCode || ""} ${formattedNumber}`;
  }

  getFirstEmail(): string {
    const emails = this.account?.contactInformation?.emails;
    if (!emails || emails.length === 0) {
      return "-";
    }
    return this.formatEmail(emails[0]);
  }

  formatEmail(email: Email): string {
    if (!email.email) return "-";
    return `${email.name || "N/A"}: ${email.email}`;
  }

  getFirstAddress(): string {
    const addresses = this.account?.contactInformation?.addresses;
    if (!addresses || addresses.length === 0) {
      return "-";
    }
    return addresses[0] ? this.formatAddress(addresses[0]) : "-";
  }

  formatAddress(address: Address): string {
    if (!address.street) return "-";
    return `${address.name || ""}\n${address.street}\n${address.city || ""}, ${address.state || ""}, ${address.country || ""} ${address.zipcode || ""}`;
  }

  toggleShow(type: "phone" | "email" | "address") {
    this.showMore[type] = !this.showMore[type];
  }
}
