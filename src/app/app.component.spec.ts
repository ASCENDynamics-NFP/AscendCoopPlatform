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
import {TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AppComponent} from "./app.component";
import {of} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AuthStoreService} from "./core/services/auth-store.service";
import {StoreService} from "./core/services/store.service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

describe("AppComponent", () => {
  let service: AuthStoreService;
  let authSpy: any;
  let storeSpy: any;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj("auth", ["onSignOut"]);
    // Mock authUser$ as an Observable that emits null
    authSpy.authUser$ = of(null);
    authSpy.onSignOut.and.returnValue(Promise.resolve());

    // Create a spy for StoreService
    storeSpy = jasmine.createSpyObj("store", ["users$", "currentUser$"]);
    // Mock users$ and currentUser$ as Observables
    storeSpy.users$ = of([]);
    storeSpy.currentUser$ = of(null);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        {provide: AuthStoreService, useValue: authSpy},
        {provide: StoreService, useValue: storeSpy}, // Provide the mock StoreService
        TranslateService,
      ],
    }).compileComponents();

    service = TestBed.inject(AuthStoreService);
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
