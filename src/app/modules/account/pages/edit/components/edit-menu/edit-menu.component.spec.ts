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
import {EditMenuComponent} from "./edit-menu.component";
import {ModalController} from "@ionic/angular";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {By} from "@angular/platform-browser";
import {EventEmitter} from "@angular/core";

describe("EditMenuComponent", () => {
  let component: EditMenuComponent;
  let fixture: ComponentFixture<EditMenuComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj("ModalController", ["create"]);

    await TestBed.configureTestingModule({
      declarations: [EditMenuComponent],
      imports: [IonicModule.forRoot(), CommonModule],
      providers: [{provide: ModalController, useValue: modalControllerSpy}],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit selected item", () => {
    spyOn(component.itemSelected, "emit");
    component.selectItem("profile");
    expect(component.itemSelected.emit).toHaveBeenCalledWith("profile");
  });

  it("should not open image upload modal if account id is missing", async () => {
    component.account = {};
    await component.openImageUploadModal();
    expect(modalControllerSpy.create).not.toHaveBeenCalled();
  });

  it("should open image upload modal if account id is present", async () => {
    const mockModal = jasmine.createSpyObj("Modal", ["present"]);
    modalControllerSpy.create.and.returnValue(Promise.resolve(mockModal));

    component.account = {id: "test-account-id"};
    component.isProfileOwner = true;
    await component.openImageUploadModal();

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: "test-account-id",
        firestoreLocation: `accounts/test-account-id/profile`,
        maxHeight: 200,
        maxWidth: 200,
        fieldName: "iconImage",
      },
    });
    expect(mockModal.present).toHaveBeenCalled();
  });

  it("should not open modal if user is not the profile owner", async () => {
    component.account = {id: "test-account-id"};
    component.isProfileOwner = false;

    await component.openImageUploadModal();
    expect(modalControllerSpy.create).not.toHaveBeenCalled();
  });
});
