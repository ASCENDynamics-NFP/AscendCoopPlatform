import {enableProdMode, importProvidersFrom} from "@angular/core";
import {bootstrapApplication} from "@angular/platform-browser";
import {RouteReuseStrategy, provideRouter} from "@angular/router";
import {IonicModule, IonicRouteStrategy} from "@ionic/angular";
import {defineCustomElements} from "@ionic/pwa-elements/loader";

import {routes} from "./app/app.routes";
import {AppComponent} from "./app/app.component";
import {environment} from "./environments/environment";
import {initializeApp} from "firebase/app";
import {AuthService} from "./app/core/services/auth.service";
// LANGUAGE
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

if (environment.production) {
  enableProdMode();
}

// Initialize Firebase before the application has been bootstrapped
initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    importProvidersFrom(IonicModule.forRoot({})),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
    ),
    provideRouter(routes),
    AuthService,
  ],
});
