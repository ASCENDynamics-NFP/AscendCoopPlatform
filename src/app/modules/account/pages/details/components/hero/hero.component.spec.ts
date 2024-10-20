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
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroComponent} from "./hero.component";
import {ModalController} from "@ionic/angular";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Account} from "../../../../../../models/account.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {Timestamp} from "firebase/firestore";

describe("HeroComponent", () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockModalController: jasmine.SpyObj<ModalController>;

  // Mock Data
  const mockAccountId = "12345";
  const mockAccount: Account = {
    id: mockAccountId,
    name: "Test Account",
    type: "user",
    privacy: "public",
    relatedAccounts: [],
    tagline: "",
    description: "",
    iconImage: "",
    heroImage: "",
    legalAgreements: {
      termsOfService: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
      privacyPolicy: {
        accepted: false,
        datetime: new Timestamp(0, 0),
        version: "",
      },
    },
    webLinks: [],
    lastLoginAt: new Timestamp(0, 0),
    email: "",
  };

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj("HTMLIonModalElement", [
      "present",
      "onDidDismiss",
    ]);
    mockModalController = jasmine.createSpyObj("ModalController", ["create"]);
    mockModalController.create.and.returnValue(Promise.resolve(modalSpy));

    await TestBed.configureTestingModule({
      declarations: [HeroComponent],
      providers: [{provide: ModalController, useValue: mockModalController}],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    component.account = {...mockAccount}; // Clone to avoid mutations affecting other tests
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should return false for hasDonationURL if account has no donation URL", () => {
    expect(component.hasDonationURL).toBeFalse();
  });

  it("should return true for hasDonationURL if account has a donation URL", () => {
    component.account.webLinks = [
      {category: "Donation", url: "https://donate.com", name: ""},
    ];
    expect(component.hasDonationURL).toBeTrue();
  });

  it("should return formatted location if address is present", () => {
    component.account.contactInformation = {
      phoneNumbers: [],
      emails: [],
      preferredMethodOfContact: "Email",
      addresses: [{city: "CityName", country: "CountryName"}],
    };
    expect(component.getLocation).toBe("CityName / CountryName");
  });

  it("should return an empty string if no address is present", () => {
    component.account.contactInformation = {
      phoneNumbers: [],
      emails: [],
      preferredMethodOfContact: "Email",
      addresses: [],
    };
    expect(component.getLocation).toBe("");
  });

  it("should open the image upload modal if account ID is set and isProfileOwner is true", async () => {
    component.account = {...mockAccount, id: mockAccountId};
    component.isProfileOwner = true;
    await component.openImageUploadModal();
    expect(mockModalController.create).toHaveBeenCalledWith({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: mockAccountId,
        firestoreLocation: `accounts/${mockAccountId}/profile`,
        maxHeight: 300,
        maxWidth: 900,
        fieldName: "heroImage",
      },
    });
    const modal =
      await mockModalController.create.calls.mostRecent().returnValue;
    expect(modal.present).toHaveBeenCalled();
  });

  it("should not open the image upload modal if account ID is not set", async () => {
    component.account = {...mockAccount, id: ""}; // No ID set
    component.isProfileOwner = true;
    await component.openImageUploadModal();
    expect(mockModalController.create).not.toHaveBeenCalled();
  });

  it("should not open the image upload modal if isProfileOwner is false", async () => {
    component.account = {...mockAccount, id: mockAccountId};
    component.isProfileOwner = false;
    await component.openImageUploadModal();
    expect(mockModalController.create).not.toHaveBeenCalled();
  });

  it("should open a new window with the correct URL on link click", () => {
    spyOn(window, "open");
    component.account.webLinks = [
      {category: "Personal Website", url: "https://website.com", name: ""},
    ];
    component.onLink("Personal Website");
    expect(window.open).toHaveBeenCalledWith("https://website.com", "_blank");
  });

  it("should log an error if no URL is found for the category", () => {
    spyOn(console, "error");
    component.account.webLinks = [
      {category: "Donation", url: "https://donate.com", name: ""},
    ];
    component.onLink("NonExistingCategory");
    expect(console.error).toHaveBeenCalledWith(
      "No URL found for category: NonExistingCategory",
    );
  });
});
