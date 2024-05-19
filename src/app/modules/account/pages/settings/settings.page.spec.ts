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
import {SettingsPage} from "./settings.page";
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../../../app.component.spec";
import {ActivatedRoute} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {AuthStoreService} from "../../../../core/services/auth-store.service";
import {StoreService} from "../../../../core/services/store.service";

const mockStoreService = {
  loadInitialData: jasmine.createSpy("loadInitialData"),
  getCollection: jasmine.createSpy("getCollection"),
  // ... other methods and properties you want to mock
};

describe("UserSettingsPage", () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  // Mock the AuthStoreService
  const mockAuthStoreService = {
    getCurrentUser: jasmine.createSpy("getCurrentUser").and.returnValue({
      /* mock user data */
    }),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
        IonicModule, // You might need this if your component uses Ionic components
      ],
      providers: [
        TranslateService,
        {provide: AuthStoreService, useValue: mockAuthStoreService}, // Use the mock service
        {provide: StoreService, useValue: mockStoreService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "123",
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
