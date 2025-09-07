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
import {ModalController, ToastController} from "@ionic/angular";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {Account} from "../../../../../../../../shared/models/account.model";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {Timestamp} from "firebase/firestore";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {provideMockStore} from "@ngrx/store/testing";
import {Router} from "@angular/router";
import {ChatService} from "../../../../../messaging/services/chat.service";
import {NetworkConnectionService} from "../../../../../../core/services/network-connection.service";
import {OfflineSyncService} from "../../../../../../core/services/offline-sync.service";
import {FirestoreOfflineService} from "../../../../../../core/services/firestore-offline.service";
import {of} from "rxjs";

describe("HeroComponent", () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockModalController: jasmine.SpyObj<ModalController>;
  let mockToastController: jasmine.SpyObj<ToastController>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAngularFirestore: jasmine.SpyObj<AngularFirestore>;
  let mockAngularFireStorage: jasmine.SpyObj<AngularFireStorage>;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let mockNetworkService: jasmine.SpyObj<NetworkConnectionService>;
  let mockOfflineSync: jasmine.SpyObj<OfflineSyncService>;
  let mockFirestoreOffline: jasmine.SpyObj<FirestoreOfflineService>;

  // Mock Data
  const mockAccountId = "12345";
  const mockAccount: Account = {
    id: mockAccountId,
    name: "Test Account",
    type: "user",
    privacySettings: {profile: {visibility: "public"}},
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
    modalSpy.onDidDismiss.and.returnValue(Promise.resolve({data: null}));

    // Create all the required mocks
    mockModalController = jasmine.createSpyObj("ModalController", ["create"]);
    mockToastController = jasmine.createSpyObj("ToastController", ["create"]);
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    mockAngularFirestore = jasmine.createSpyObj("AngularFirestore", [
      "collection",
    ]);
    mockAngularFireStorage = jasmine.createSpyObj("AngularFireStorage", [
      "ref",
    ]);
    mockChatService = jasmine.createSpyObj("ChatService", [
      "createChat",
      "sendMessage",
    ]);
    mockNetworkService = jasmine.createSpyObj("NetworkConnectionService", [], {
      isOnline$: of(true),
      connectionType$: of("wifi"),
      networkQuality$: of("good"),
    });
    mockOfflineSync = jasmine.createSpyObj(
      "OfflineSyncService",
      ["queueMessage", "retryFailedMessages", "setCurrentUserId"],
      {
        isOnline$: of(true),
        syncStatus$: of("idle"),
        queueLength$: of(0),
      },
    );
    mockFirestoreOffline = jasmine.createSpyObj("FirestoreOfflineService", [
      "initializeOfflinePersistence",
      "preCacheCollections",
    ]);

    mockModalController.create.and.returnValue(Promise.resolve(modalSpy));
    mockToastController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy(),
      } as any),
    );

    await TestBed.configureTestingModule({
      declarations: [HeroComponent],
      providers: [
        {provide: ModalController, useValue: mockModalController},
        {provide: ToastController, useValue: mockToastController},
        {provide: Router, useValue: mockRouter},
        {provide: AngularFirestore, useValue: mockAngularFirestore},
        {provide: AngularFireStorage, useValue: mockAngularFireStorage},
        {provide: ChatService, useValue: mockChatService},
        {provide: NetworkConnectionService, useValue: mockNetworkService},
        {provide: OfflineSyncService, useValue: mockOfflineSync},
        {provide: FirestoreOfflineService, useValue: mockFirestoreOffline},
        provideMockStore(),
      ],
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
    expect(component.getLocation).toBe("CityName, CountryName");
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
        imageHeight: 300,
        imageWidth: 900,
        fieldName: "heroImage",
        currentImageUrl: mockAccount.heroImage,
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
      {category: "Website", url: "https://website.com", name: ""},
    ];
    component.onLink("Website");
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
