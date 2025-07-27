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
// src/app/app.module.ts

import {NgModule, isDevMode} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouteReuseStrategy} from "@angular/router";
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import {getStorage} from "firebase/storage";
import {initializeApp} from "firebase/app";

import {AppComponent} from "./app.component";
import {environment} from "../environments/environment";

// LANGUAGE
import {HttpClientModule, HttpClient} from "@angular/common/http";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

// NgRx
import {localStorageSync} from "ngrx-store-localstorage";
import {ActionReducer, MetaReducer, StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

// Reducers and Effects
import {reducers} from "./state/reducers";
import {AccountEffects} from "./state/effects/account.effects";
import {AuthEffects} from "./state/effects/auth.effects";

// Services
import {ErrorHandlerService} from "./core/services/error-handler.service";
import {FirestoreService} from "./core/services/firestore.service";
import {ImageUploadService} from "./core/services/image-upload.service";
import {SuccessHandlerService} from "./core/services/success-handler.service";

import {AngularFireModule} from "@angular/fire/compat";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";

import {AuthSyncService} from "./core/services/auth-sync.service";
import {MenuComponent} from "./shared/components/menu/menu.component";
import {AppRoutingModule} from "./app-routing.module";

// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);

// Initialize Cloud Storage
getStorage(app);

// Custom Elements
defineCustomElements(window);

// Function to sync store with localStorage
export function localStorageSyncReducer(
  reducer: ActionReducer<any>,
): ActionReducer<any> {
  return localStorageSync({
    keys: ["auth", "accounts", "listings"], // Specify the state slices you want to persist
    rehydrate: true, // Rehydrate state on application startup
  })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot({}),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: "en", // Set default language
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([AuthEffects, AccountEffects]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: !isDevMode()}),
  ],
  providers: [
    AuthSyncService,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ErrorHandlerService,
    FirestoreService,
    ImageUploadService,
    SuccessHandlerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
