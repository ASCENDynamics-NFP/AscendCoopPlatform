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
import {Component, Input, OnDestroy} from "@angular/core";
import {
  Account,
  Address,
  Email,
  PhoneNumber,
  ContactInformation,
} from "@shared/models/account.model";
import {AccountSectionsService} from "../../../../services/account-sections.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-contact-information",
  templateUrl: "./contact-information.component.html",
  styleUrls: ["./contact-information.component.scss"],
})
export class ContactInformationComponent implements OnDestroy {
  _account!: Partial<Account>;
  private contactInfoSub?: Subscription;
  contactInfo: ContactInformation | null = null;
  contactInfoLoadTried = false;
  showMore = {
    phone: false,
    email: false,
    address: false,
  };

  @Input() isProfileOwner: boolean = false;
  @Input() isGroupAdmin: boolean = false;
  @Input() privacySettings: any = null;

  get account() {
    return this._account;
  }

  constructor(private sections: AccountSectionsService) {}

  @Input() set account(account: Partial<Account> | undefined) {
    if (!account) {
      return;
    }
    this._account = account;
    // Attempt to load gated contact info from sections with graceful fallback
    if (this.contactInfoSub) {
      this.contactInfoSub.unsubscribe();
    }
    if (account.id) {
      this.contactInfoLoadTried = true;
      this.contactInfoSub = this.sections
        .contactInfo$(account.id)
        .subscribe((ci) => (this.contactInfo = ci));
    }
  }

  ngOnDestroy(): void {
    this.contactInfoSub?.unsubscribe();
  }

  get isOwnerOrAdmin(): boolean {
    return this.isProfileOwner || this.isGroupAdmin;
  }

  get contactInfoPrivacyData(): {
    visibility: string;
    color: string;
    label: string;
  } {
    if (!this.privacySettings) {
      return {visibility: "public", color: "success", label: "Public"};
    }

    const section = this.privacySettings.contactInformation || {};
    const visibility = section.visibility || "public";
    const {text, color} = this.mapVisibility(visibility);

    return {visibility, color, label: text};
  }

  private mapVisibility(v: string): {text: string; color: string} {
    switch (v) {
      case "public":
        return {text: "Public", color: "success"};
      case "friends":
        return {text: "Friends", color: "warning"};
      case "private":
        return {text: "Private", color: "danger"};
      default:
        return {text: "Public", color: "success"};
    }
  }

  get resolvedContactInfo(): ContactInformation | undefined {
    // Prefer gated section; fallback to legacy field during migration
    return this.contactInfo ?? this._account?.contactInformation ?? undefined;
  }

  get hasMoreThanOnePhoneNumber(): boolean {
    const ci = this.resolvedContactInfo;
    return !!(ci?.phoneNumbers && ci.phoneNumbers.length > 1);
  }

  get hasMoreThanOneEmail(): boolean {
    const ci = this.resolvedContactInfo;
    return !!(ci?.emails && ci.emails.length > 1);
  }

  get hasMoreThanOneAddress(): boolean {
    const ci = this.resolvedContactInfo;
    return !!(ci?.addresses && ci.addresses.length > 1);
  }

  getFirstPhoneNumber(): string {
    const phoneNumbers = this.resolvedContactInfo?.phoneNumbers;
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
    return `${phone.type || ""}${emergencyIndicator}: ${formattedNumber}`;
  }

  getFirstEmail(): string {
    const emails = this.resolvedContactInfo?.emails;
    if (!emails || emails.length === 0) {
      return "-";
    }
    return this.formatEmail(emails[0]);
  }

  formatEmail(email: Email): string {
    if (!email.email) return "-";
    return `${email.name || "-"}: ${email.email}`;
  }

  getFirstAddress(): string {
    const addresses = this.resolvedContactInfo?.addresses;
    if (!addresses || addresses.length === 0) {
      return "-";
    }
    return addresses[0] ? this.formatAddress(addresses[0]) : "-";
  }

  formatAddress(address: Address): string {
    if (!address.street) return "-";
    const primary = address.isPrimaryAddress ? "(Primary)" : "";
    return `${address.name || ""} ${primary}\n${address.street}\n${address.city || ""}, ${address.state || ""}, ${address.country || ""} ${address.zipcode || ""}`;
  }

  toggleShow(type: "phone" | "email" | "address") {
    this.showMore[type] = !this.showMore[type];
  }

  get otherPhoneNumbers(): PhoneNumber[] {
    const nums = this.resolvedContactInfo?.phoneNumbers ?? [];
    return nums.slice(1);
  }

  get otherEmails(): Email[] {
    const items = this.resolvedContactInfo?.emails ?? [];
    return items.slice(1);
  }

  get otherAddresses(): (Address | null)[] {
    const items = this.resolvedContactInfo?.addresses ?? [];
    return items.slice(1);
  }

  get preferredMethodOfContact(): string {
    const pref = this.resolvedContactInfo?.preferredMethodOfContact;
    return pref ?? "-";
  }
}
