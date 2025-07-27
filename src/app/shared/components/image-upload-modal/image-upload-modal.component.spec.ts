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
import {ComponentFixture, TestBed, waitForAsync} from "@angular/core/testing";
import {IonicModule, ModalController} from "@ionic/angular";
import {ImageUploadModalComponent} from "./image-upload-modal.component";
import {ImageUploadService} from "../../../core/services/image-upload.service";
import {DomSanitizer} from "@angular/platform-browser";

describe("ImageUploadModalComponent", () => {
  let component: ImageUploadModalComponent;
  let fixture: ComponentFixture<ImageUploadModalComponent>;
  let mockImageUploadService: Partial<ImageUploadService>;
  let mockModalController: Partial<ModalController>;

  beforeEach(waitForAsync(() => {
    mockImageUploadService = {
      uploadImage: jasmine
        .createSpy("uploadImage")
        .and.returnValue(Promise.resolve("test-url")),
    };

    mockModalController = {
      dismiss: jasmine.createSpy("dismiss").and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      declarations: [ImageUploadModalComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        {provide: ImageUploadService, useValue: mockImageUploadService},
        {provide: ModalController, useValue: mockModalController},
        {
          provide: DomSanitizer,
          useValue: {bypassSecurityTrustUrl: (url: string) => url},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadModalComponent);
    component = fixture.componentInstance;
    component.collectionName = "test";
    component.docId = "test-id";
    component.firestoreLocation = "test/location";
    component.imageHeight = 100;
    component.imageWidth = 100;
    component.fieldName = "testField";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
