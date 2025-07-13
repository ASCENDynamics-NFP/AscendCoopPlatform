(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["main"],{

/***/ 4114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule),
/* harmony export */   routes: () => (/* binding */ routes)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
var _AppRoutingModule;



const routes = [{
  path: "",
  redirectTo: "",
  pathMatch: "full"
}, {
  path: "",
  // Used to remove "/auth" from landing page.
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts"), __webpack_require__.e("src_app_modules_auth_auth_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/auth/auth.module */ 7751)).then(m => m.AuthModule)
}, {
  path: "account",
  // Used to organize routes in "/account" folder.
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts"), __webpack_require__.e("common"), __webpack_require__.e("src_app_modules_account_account_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/account/account.module */ 1797)).then(m => m.AccountModule)
}, {
  path: "auth",
  // Used to organize routes in "/auth" folder.
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts"), __webpack_require__.e("src_app_modules_auth_auth_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/auth/auth.module */ 7751)).then(m => m.AuthModule)
}, {
  path: "listings",
  // Used to organize routes in "/listings" folder.
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts"), __webpack_require__.e("common"), __webpack_require__.e("src_app_modules_listing_listing_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/listing/listing.module */ 3461)).then(m => m.ListingModule)
}];
// Router options
const routerOptions = {
  anchorScrolling: "enabled",
  // Enable fragment scrolling
  scrollPositionRestoration: "enabled",
  // Restore scroll position on navigation
  onSameUrlNavigation: "reload" // Allow navigation to the same URL
};
class AppRoutingModule {}
_AppRoutingModule = AppRoutingModule;
_AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) {
  return new (t || _AppRoutingModule)();
};
_AppRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: _AppRoutingModule
});
_AppRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule.forRoot(routes, routerOptions), _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
  });
})();

/***/ }),

/***/ 92:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state/actions/auth.actions */ 2345);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 1969);
/* harmony import */ var swiper_element_bundle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! swiper/element/bundle */ 2472);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ionic/angular */ 3478);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _shared_components_menu_menu_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/components/menu/menu.component */ 8397);

var _AppComponent;









//  Import and Register Swiper
(0,swiper_element_bundle__WEBPACK_IMPORTED_MODULE_3__.register)();
class AppComponent {
  constructor(menuCtrl, translate, store, platform) {
    var _this = this;
    this.menuCtrl = menuCtrl;
    this.translate = translate;
    this.store = store;
    this.platform = platform;
    this.translate.addLangs(["en", "fr"]);
    this.initializeApp();
    // Initialize the observable
    this.isLoggedIn$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectIsLoggedIn).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.tap)( /*#__PURE__*/function () {
      var _ref = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (isLoggedIn) {
        yield _this.updateMenu(isLoggedIn);
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()));
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Set the default language
      this.translate.setDefaultLang("en");
      // Optionally, get the user's preferred language
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang !== null && browserLang !== void 0 && browserLang.match(/en|fr|es/) ? browserLang : "en");
    });
  }
  ngOnInit() {
    // Dispatch the initialization action
    this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.initializeAuth());
  }
  updateMenu(isLoggedIn) {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (isLoggedIn) {
        yield _this2.menuCtrl.enable(false, "guest");
        yield _this2.menuCtrl.enable(true, "user");
      } else {
        yield _this2.menuCtrl.enable(false, "user");
        yield _this2.menuCtrl.enable(true, "guest");
      }
    })();
  }
}
_AppComponent = AppComponent;
_AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || _AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.MenuController), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_9__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_10__.Platform));
};
_AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _AppComponent,
  selectors: [["app-root"]],
  decls: 2,
  vars: 0,
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-app");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-menu");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonApp, _shared_components_menu_menu_component__WEBPACK_IMPORTED_MODULE_4__.MenuComponent],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule),
/* harmony export */   createTranslateLoader: () => (/* binding */ createTranslateLoader),
/* harmony export */   localStorageSyncReducer: () => (/* binding */ localStorageSyncReducer)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/platform-browser */ 4199);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @ionic/angular */ 3478);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ionic_pwa_elements_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ionic/pwa-elements/loader */ 8577);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/storage */ 2626);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/app */ 7864);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ 92);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../environments/environment */ 5312);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/common/http */ 7008);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @ngx-translate/http-loader */ 5945);
/* harmony import */ var ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngrx-store-localstorage */ 5878);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @ngrx/store-devtools */ 9094);
/* harmony import */ var _state_reducers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state/reducers */ 1036);
/* harmony import */ var _state_effects_account_effects__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./state/effects/account.effects */ 4862);
/* harmony import */ var _state_effects_auth_effects__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./state/effects/auth.effects */ 9351);
/* harmony import */ var _core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/services/error-handler.service */ 6119);
/* harmony import */ var _core_services_firestore_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/services/firestore.service */ 3073);
/* harmony import */ var _core_services_image_upload_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/services/image-upload.service */ 7421);
/* harmony import */ var _core_services_success_handler_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core/services/success-handler.service */ 3038);
/* harmony import */ var _angular_fire_compat__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/fire/compat */ 4739);
/* harmony import */ var _angular_fire_compat_firestore__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/fire/compat/firestore */ 5351);
/* harmony import */ var _core_services_auth_sync_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./core/services/auth-sync.service */ 1602);
/* harmony import */ var _shared_components_menu_menu_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./shared/components/menu/menu.component */ 8397);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./app-routing.module */ 4114);
var _AppModule;
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









// LANGUAGE



// NgRx




// Reducers and Effects



// Services
















// Initialize Firebase
const app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_2__.initializeApp)(_environments_environment__WEBPACK_IMPORTED_MODULE_4__.environment.firebaseConfig);
// Initialize Cloud Storage
(0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getStorage)(app);
// Custom Elements
(0,_ionic_pwa_elements_loader__WEBPACK_IMPORTED_MODULE_0__.defineCustomElements)(window);
// Function to sync store with localStorage
function localStorageSyncReducer(reducer) {
  return (0,ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_15__.localStorageSync)({
    keys: ["auth", "accounts", "listings"],
    // Specify the state slices you want to persist
    rehydrate: true // Rehydrate state on application startup
  })(reducer);
}
const metaReducers = [localStorageSyncReducer];
function createTranslateLoader(http) {
  return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_16__.TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
class AppModule {}
_AppModule = AppModule;
_AppModule.ɵfac = function AppModule_Factory(t) {
  return new (t || _AppModule)();
};
_AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineNgModule"]({
  type: _AppModule,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__.AppComponent]
});
_AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineInjector"]({
  providers: [_core_services_auth_sync_service__WEBPACK_IMPORTED_MODULE_12__.AuthSyncService, {
    provide: _angular_router__WEBPACK_IMPORTED_MODULE_18__.RouteReuseStrategy,
    useClass: _ionic_angular__WEBPACK_IMPORTED_MODULE_19__.IonicRouteStrategy
  }, _core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_8__.ErrorHandlerService, _core_services_firestore_service__WEBPACK_IMPORTED_MODULE_9__.FirestoreService, _core_services_image_upload_service__WEBPACK_IMPORTED_MODULE_10__.ImageUploadService, _core_services_success_handler_service__WEBPACK_IMPORTED_MODULE_11__.SuccessHandlerService],
  imports: [_angular_fire_compat__WEBPACK_IMPORTED_MODULE_20__.AngularFireModule.initializeApp(_environments_environment__WEBPACK_IMPORTED_MODULE_4__.environment.firebaseConfig), _angular_fire_compat_firestore__WEBPACK_IMPORTED_MODULE_21__.AngularFirestoreModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_14__.AppRoutingModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__.BrowserModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonicModule.forRoot({}), _angular_common_http__WEBPACK_IMPORTED_MODULE_24__.HttpClientModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__.TranslateModule.forRoot({
    defaultLanguage: "en",
    // Set default language
    loader: {
      provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__.TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_24__.HttpClient]
    }
  }), _ngrx_store__WEBPACK_IMPORTED_MODULE_26__.StoreModule.forRoot(_state_reducers__WEBPACK_IMPORTED_MODULE_5__.reducers, {
    metaReducers
  }), _ngrx_effects__WEBPACK_IMPORTED_MODULE_27__.EffectsModule.forRoot([_state_effects_auth_effects__WEBPACK_IMPORTED_MODULE_7__.AuthEffects, _state_effects_account_effects__WEBPACK_IMPORTED_MODULE_6__.AccountEffects]), _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_28__.StoreDevtoolsModule.instrument({
    maxAge: 25,
    logOnly: !(0,_angular_core__WEBPACK_IMPORTED_MODULE_17__.isDevMode)()
  })]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__.AppComponent, _shared_components_menu_menu_component__WEBPACK_IMPORTED_MODULE_13__.MenuComponent],
    imports: [_angular_fire_compat__WEBPACK_IMPORTED_MODULE_20__.AngularFireModule, _angular_fire_compat_firestore__WEBPACK_IMPORTED_MODULE_21__.AngularFirestoreModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_14__.AppRoutingModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__.BrowserModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_23__.IonicModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_24__.HttpClientModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__.TranslateModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_26__.StoreRootModule, _ngrx_effects__WEBPACK_IMPORTED_MODULE_27__.EffectsRootModule, _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_28__.StoreDevtoolsModule]
  });
})();

/***/ }),

/***/ 1602:
/*!****************************************************!*\
  !*** ./src/app/core/services/auth-sync.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthSyncService: () => (/* binding */ AuthSyncService)
/* harmony export */ });
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/auth */ 6282);
/* harmony import */ var _state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../state/actions/auth.actions */ 2345);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ 5480);
var _AuthSyncService;




class AuthSyncService {
  constructor(store) {
    this.store = store;
    this.auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_0__.getAuth)();
    (0,firebase_auth__WEBPACK_IMPORTED_MODULE_0__.onAuthStateChanged)(this.auth, user => {
      if (user) {
        this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInSuccess({
          uid: user.uid
        }));
      } else {
        this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signOutSuccess());
      }
    });
  }
}
_AuthSyncService = AuthSyncService;
_AuthSyncService.ɵfac = function AuthSyncService_Factory(t) {
  return new (t || _AuthSyncService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_3__.Store));
};
_AuthSyncService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: _AuthSyncService,
  factory: _AuthSyncService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 6119:
/*!********************************************************!*\
  !*** ./src/app/core/services/error-handler.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorHandlerService: () => (/* binding */ ErrorHandlerService)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);

var _ErrorHandlerService;


class ErrorHandlerService {
  constructor(toastController) {
    this.toastController = toastController;
    this.FIREBASE_AUTH_ERROR = {
      "auth/email-already-in-use": {
        title: "Email Already in Use",
        message: "The email address is already in use by another account. Please use a different email."
      },
      "auth/invalid-email": {
        title: "Invalid Email",
        message: "The email address you have entered is not valid. Please enter a valid email address."
      },
      "auth/weak-password": {
        title: "Weak Password",
        message: "The password you have entered is too weak. Please choose a stronger password."
      },
      "auth/claims-too-large": {
        title: "Claims Too Large",
        message: "The payload size exceeds the maximum size of 1000 bytes."
      },
      "auth/email-already-exists": {
        title: "Email Already Exists",
        message: "The provided email is already in use by another user. Please use a different email."
      },
      "auth/id-token-expired": {
        title: "ID Token Expired",
        message: "The Firebase ID token you are using has expired. Please log in again."
      },
      "auth/id-token-revoked": {
        title: "ID Token Revoked",
        message: "The Firebase ID token you are using has been revoked. Please log in again."
      },
      "auth/insufficient-permission": {
        title: "Insufficient Permissions",
        message: "You do not have the necessary permissions to perform this operation."
      },
      "auth/internal-error": {
        title: "Internal Error",
        message: "An internal error occurred while processing your request. Please try again later."
      },
      "auth/invalid-argument": {
        title: "Invalid Argument",
        message: "An invalid argument was provided. Please check the input and try again."
      },
      "auth/invalid-claims": {
        title: "Invalid Claims",
        message: "The custom claim attributes you have entered are not valid. Please check them and try again."
      },
      "auth/missing-oauth-client-secret": {
        title: "Missing OAuth Client Secret",
        message: "The OAuth configuration client secret is required to enable OIDC code flow."
      },
      "auth/operation-not-allowed": {
        title: "Operation Not Allowed",
        message: "Email/password accounts are not enabled. Please contact support at support@ascendynamics.org."
      },
      "auth/phone-number-already-exists": {
        title: "Phone Number Already Exists",
        message: "The provided phone number is already in use by another user. Each user must have a unique phone number."
      },
      "auth/project-not-found": {
        title: "Project Not Found",
        message: "No Firebase project was found for the credential used to initialize the Admin SDKs."
      },
      "auth/session-cookie-expired": {
        title: "Session Cookie Expired",
        message: "The provided Firebase session cookie is expired. Please log in again."
      },
      "auth/weakschema": {
        title: "Weak Security Schema",
        message: "The security rules provided are not strong enough. Please provide stronger security rules and try again."
      },
      "auth/invalid-continue-uri": {
        title: "Invalid Continue URL",
        message: "The continue URL must be a valid URL."
      },
      "auth/invalid-creation-time": {
        title: "Invalid Creation Time",
        message: "The creation time must be a valid UTC date string."
      },
      "auth/invalid-credential": {
        title: "Invalid Credential",
        message: "The credential used for authentication is not valid. Please use a valid credential."
      },
      "auth/invalid-disabled-field": {
        title: "Invalid Disabled Field",
        message: "The value for the disabled user property is invalid. It must be a boolean."
      },
      "auth/invalid-display-name": {
        title: "Invalid Display Name",
        message: "The value for the display name is invalid. It must be a non-empty string."
      },
      "auth/invalid-dynamic-link-domain": {
        title: "Invalid Dynamic Link Domain",
        message: "The dynamic link domain is not authorized or configured for the current project."
      },
      "auth/invalid-email-verified": {
        title: "Invalid Email Verification Status",
        message: "The value for the email verification status is invalid. It must be a boolean."
      },
      "auth/invalid-hash-algorithm": {
        title: "Invalid Hash Algorithm",
        message: "The hash algorithm must match one of the supported algorithms."
      },
      "auth/invalid-hash-block-size": {
        title: "Invalid Hash Block Size",
        message: "The hash block size must be a valid number."
      },
      "auth/invalid-hash-derived-key-length": {
        title: "Invalid Hash Derived Key Length",
        message: "The hash derived key length must be a valid number."
      },
      "auth/invalid-hash-key": {
        title: "Invalid Hash Key",
        message: "The hash key must be a valid byte buffer."
      },
      "auth/invalid-hash-memory-cost": {
        title: "Invalid Hash Memory Cost",
        message: "The hash memory cost must be a valid number."
      },
      "auth/invalid-hash-parallelization": {
        title: "Invalid Hash Parallelization",
        message: "The hash parallelization must be a valid number."
      },
      "auth/invalid-hash-rounds": {
        title: "Invalid Hash Rounds",
        message: "The hash rounds must be a valid number."
      },
      "auth/invalid-hash-salt-separator": {
        title: "Invalid Hash Salt Separator",
        message: "The hashing algorithm salt separator field must be a valid byte buffer."
      },
      "auth/invalid-id-token": {
        title: "Invalid ID Token",
        message: "The provided ID token is not a valid Firebase ID token."
      },
      "auth/invalid-last-sign-in-time": {
        title: "Invalid Last Sign-In Time",
        message: "The last sign-in time must be a valid UTC date string."
      },
      "auth/invalid-page-token": {
        title: "Invalid Page Token",
        message: "The provided next page token in listUsers() is invalid. It must be a valid non-empty string."
      },
      "auth/invalid-password": {
        title: "Invalid Password",
        message: "The provided value for the password user property is invalid. It must be a string with at least six characters."
      },
      "auth/invalid-password-hash": {
        title: "Invalid Password Hash",
        message: "The password hash must be a valid byte buffer."
      },
      "auth/invalid-password-salt": {
        title: "Invalid Password Salt",
        message: "The password salt must be a valid byte buffer."
      },
      "auth/invalid-phone-number": {
        title: "Invalid Phone Number",
        message: "The provided value for the phone number is invalid. It must be a non-empty E.164 standard compliant identifier string."
      },
      "auth/invalid-photo-url": {
        title: "Invalid Photo URL",
        message: "The provided value for the photoURL user property is invalid. It must be a string URL."
      },
      "auth/invalid-provider-data": {
        title: "Invalid Provider Data",
        message: "The providerData must be a valid array of UserInfo objects."
      },
      "auth/invalid-provider-id": {
        title: "Invalid Provider ID",
        message: "The providerId must be a valid supported provider identifier string."
      },
      "auth/invalid-oauth-responsetype": {
        title: "Invalid OAuth Response Type",
        message: "Only exactly one OAuth responseType should be set to true."
      },
      "auth/invalid-session-cookie-duration": {
        title: "Invalid Session Cookie Duration",
        message: "The session cookie duration must be a valid number in milliseconds between 5 minutes and 2 weeks."
      },
      "auth/invalid-uid": {
        title: "Invalid UID",
        message: "The provided UID must be a non-empty string with at most 128 characters."
      },
      "auth/invalid-user-import": {
        title: "Invalid User Import",
        message: "The user record to import is invalid."
      },
      "auth/maximum-user-count-exceeded": {
        title: "Maximum User Count Exceeded",
        message: "The maximum allowed number of users to import has been exceeded."
      },
      "auth/missing-android-pkg-name": {
        title: "Missing Android Package Name",
        message: "An Android Package Name must be provided if the Android App is required to be installed."
      },
      "auth/missing-continue-uri": {
        title: "Missing Continue URL",
        message: "A valid continue URL must be provided in the request."
      },
      "auth/missing-hash-algorithm": {
        title: "Missing Hash Algorithm",
        message: "Importing users with password hashes requires that the hashing algorithm and its parameters be provided."
      },
      "auth/missing-ios-bundle-id": {
        title: "Missing iOS Bundle ID",
        message: "The request is missing a Bundle ID."
      },
      "auth/missing-uid": {
        title: "Missing UID",
        message: "A UID identifier is required for the current operation."
      },
      "auth/reserved-claims": {
        title: "Reserved Claims Used",
        message: "One or more custom user claims provided to setCustomUserClaims() are reserved and should not be used."
      },
      "auth/session-cookie-revoked": {
        title: "Session Cookie Revoked",
        message: "The Firebase session cookie has been revoked."
      },
      "auth/uid-already-exists": {
        title: "UID Already Exists",
        message: "The provided UID is already in use by another user. Each user must have a unique UID."
      },
      "auth/unauthorized-continue-uri": {
        title: "Unauthorized Continue URL",
        message: "The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase Console."
      },
      "auth/user-not-found": {
        title: "User Not Found",
        message: "There is no existing user record corresponding to the provided identifier."
      },
      "auth/wrong-password": {
        title: "Incorrect Password",
        message: "The password you have entered is incorrect. Please try again."
      },
      "auth/invalid-action-code": {
        title: "Invalid Action Code",
        message: "The action code in your link seems to be incorrect or expired. Please request a new one."
      },
      "storage/unauthorized": {
        title: "Unauthorized Upload",
        message: "You don't have permission to upload this file. Ensure the file is a JPEG, PNG, or GIF and is no larger than 5MB."
      }
    };
  }
  handleFirebaseAuthError(error) {
    let title = "Error";
    let message = error.message;
    if (this.FIREBASE_AUTH_ERROR.hasOwnProperty(error.code)) {
      var _this$FIREBASE_AUTH_E, _this$FIREBASE_AUTH_E2;
      title = (_this$FIREBASE_AUTH_E = this.FIREBASE_AUTH_ERROR[error.code]) === null || _this$FIREBASE_AUTH_E === void 0 ? void 0 : _this$FIREBASE_AUTH_E.title;
      message = (_this$FIREBASE_AUTH_E2 = this.FIREBASE_AUTH_ERROR[error.code]) === null || _this$FIREBASE_AUTH_E2 === void 0 ? void 0 : _this$FIREBASE_AUTH_E2.message;
    }
    this.showToast(message, title); // Show the toast with the error message
    return message;
  }
  showToast(message, title) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const toast = yield _this.toastController.create({
        message: `${title}: ${message}`,
        duration: 8000,
        position: "top",
        color: "danger",
        buttons: [{
          text: "Close",
          role: "cancel"
        }]
      });
      yield toast.present();
    })();
  }
}
_ErrorHandlerService = ErrorHandlerService;
_ErrorHandlerService.ɵfac = function ErrorHandlerService_Factory(t) {
  return new (t || _ErrorHandlerService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_2__.ToastController));
};
_ErrorHandlerService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: _ErrorHandlerService,
  factory: _ErrorHandlerService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 3073:
/*!****************************************************!*\
  !*** ./src/app/core/services/firestore.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FirestoreService: () => (/* binding */ FirestoreService)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 5167);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 8713);
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/app */ 7864);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_fire_compat_firestore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/fire/compat/firestore */ 5351);
/* harmony import */ var _angular_fire_compat_storage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/fire/compat/storage */ 159);

var _FirestoreService;






class FirestoreService {
  constructor(afs, storage) {
    this.afs = afs;
    this.storage = storage;
  }
  // Helper to ensure documents have an id property
  populateId(data, id) {
    return {
      ...data,
      id
    };
  }
  // Firebase Query Logic (Start) //
  /**
   * Retrieves a specific document from a given collection in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to retrieve.
   * @returns {Observable<T | null>} - Returns an Observable of the document data if found, otherwise null.
   */
  getDocument(collectionName, documentId) {
    return this.afs.collection(collectionName).doc(documentId).valueChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(data => data ? this.populateId(data, documentId) : null),
    // Populate id
    (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error retrieving document:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)(null);
    }));
  }
  /**
   * Adds a new document to a specified collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {any} documentData - Data of the document to add.
   * @returns {Promise<string>} - Returns the ID of the added document.
   */
  addDocument(collectionName, documentData) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const documentRef = yield _this.afs.collection(collectionName).add(documentData);
        return documentRef.id;
      } catch (error) {
        throw new firebase_app__WEBPACK_IMPORTED_MODULE_1__.FirebaseError("add-document-error", `Error adding document: ${error}`);
      }
    })();
  }
  /**
   * Sets a document in Firestore, creating or updating it as necessary.
   * @param docPath The path to the document.
   * @param documentData The data of the document.
   * @param options Options for setting the document.
   */
  setDocument(docPath, documentData, options) {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this2.afs.doc(docPath).set(documentData, options || {});
      } catch (error) {
        console.error("Error setting document at path:", docPath, error);
        throw error; // Propagate the error
      }
    })();
  }
  /**
   * Updates a specific document in a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to update.
   * @param {any} updatedData - New data to update the document with.
   * @returns {Promise<void>}
   */
  updateDocument(collectionName, documentId, updatedData) {
    var _this3 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this3.afs.collection(collectionName).doc(documentId).update(updatedData);
      } catch (error) {
        throw new firebase_app__WEBPACK_IMPORTED_MODULE_1__.FirebaseError("update-document-error", `Error updating document: ${error}`);
      }
    })();
  }
  /**
   * Updates a document at the given path in Firestore.
   *
   * @param {string} docPath - The full path to the document.
   * @param {any} updatedData - The data to update.
   * @returns {Promise<void>}
   */
  updateDocumentAtPath(docPath, updatedData) {
    var _this4 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this4.afs.doc(docPath).update(updatedData);
      } catch (error) {
        throw new firebase_app__WEBPACK_IMPORTED_MODULE_1__.FirebaseError("update-document-at-path-error", `Error updating document at path ${docPath}: ${error}`);
      }
    })();
  }
  /**
   * Deletes a specific document from a given collection.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} documentId - ID of the document to delete.
   * @returns {Promise<void>}
   */
  deleteDocument(collectionName, documentId) {
    var _this5 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this5.afs.collection(collectionName).doc(documentId).delete();
      } catch (error) {
        throw new firebase_app__WEBPACK_IMPORTED_MODULE_1__.FirebaseError("delete-document-error", `Error deleting document: ${error}`);
      }
    })();
  }
  /**
   * Deletes a document at a specific Firestore path.
   * @param fullPath The full Firestore path to the document (e.g., 'listings/{listingId}/relatedAccounts/{relatedAccountId}').
   * @returns {Promise<void>}
   */
  deleteDocumentAtPath(fullPath) {
    var _this6 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this6.afs.doc(fullPath).delete();
      } catch (error) {
        console.error(`Error deleting document at path: ${fullPath}`, error);
        throw error;
      }
    })();
  }
  /**
   * Retrieves documents from a collection based on a specified condition in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} field - Field name to apply the condition on.
   * @param {any} condition - Condition to apply.
   * @param {any} value - Value to match against.
   * @returns {Observable<T[]>} - Returns an Observable of an array of documents that match the condition.
   */
  getCollectionWithCondition(collectionName, field, condition, value) {
    const collectionRef = this.afs.collection(collectionName, ref => ref.where(field, condition, value));
    return collectionRef.snapshotChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(actions => actions.map(action => {
      const data = action.payload.doc.data();
      const id = action.payload.doc.id;
      return this.populateId(data, id); // Ensure id is populated
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error retrieving collection with condition:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([]);
    }));
  }
  /**
   * Searches for documents in a collection based on a name field in real-time.
   *
   * @param {string} collectionName - Name of the collection.
   * @param {string} searchTerm - Term to search for.
   * @param {string} [userId] - Current user Id (optional).
   * @returns {Observable<Account[]>} - Returns an Observable of an array of accounts that match the search term.
   */
  searchAccountByName(collectionName, searchTerm) {
    const collectionRef = this.afs.collection(collectionName, ref => {
      let queryRef = ref.where("privacy", "==", "public").where("type", "in", ["user", "group"]);
      // Firestore does not support OR queries directly, but we can perform multiple queries and combine the results
      // For simplicity, we'll only handle the search term as-is
      queryRef = queryRef.orderBy("name").startAt(searchTerm).endAt(searchTerm + "\uf8ff");
      return queryRef;
    });
    return collectionRef.valueChanges({
      idField: "id"
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error searching accounts:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([]);
    }));
  }
  /**
   * Retrieves documents from a relatedAccounts sub-collection for a given account in real-time.
   *
   * @param {string} accountId - ID of the account.
   * @returns {Observable<RelatedAccount[]>} - Returns an Observable of an array of related accounts.
   */
  getRelatedAccounts(accountId) {
    const relatedAccountsRef = this.afs.collection(`accounts/${accountId}/relatedAccounts`);
    return relatedAccountsRef.snapshotChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(actions => actions.map(action => {
      const data = action.payload.doc.data();
      const id = action.payload.doc.id;
      return this.populateId(data, id); // Ensure id is populated
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error getting related accounts:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([]);
    }));
  }
  /**
   * Retrieves all public user or group accounts from the 'accounts' collection in real-time.
   * @returns {Observable<Account[]>} - Returns an Observable of an array of account documents.
   */
  getAllAccounts() {
    return this.afs.collection("accounts", ref => ref.where("privacy", "==", "public").where("type", "in", ["user", "group"])).snapshotChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(actions => actions.map(action => {
      const data = action.payload.doc.data();
      const id = action.payload.doc.id;
      return this.populateId(data, id); // Ensure id is populated
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error getting accounts:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([]);
    }));
  }
  /**
   * Retrieves an account with its related accounts and related listings.
   *
   * @param {string} accountId - ID of the account.
   * @returns {Observable<{ account: Account | null; relatedAccounts: RelatedAccount[]; relatedListings: RelatedListing[] }>}
   */
  getAccountWithRelated(accountId) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.combineLatest)([this.getDocument("accounts", accountId), this.getRelatedAccounts(accountId), this.afs.collection(`accounts/${accountId}/relatedListings`).snapshotChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(actions => actions.map(action => {
      const data = action.payload.doc.data();
      const id = action.payload.doc.id;
      return this.populateId(data, id); // Ensure id is populated
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([])))]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(([account, relatedAccounts, relatedListings]) => ({
      account,
      relatedAccounts,
      relatedListings
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error("Error getting account with related data:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)({
        account: null,
        relatedAccounts: [],
        relatedListings: []
      });
    }));
  }
  // Firebase Query Logic (Ends) //
  /**
   * Retrieves documents from any collection or sub-collection.
   * @param fullPath The full Firestore path to the collection (e.g., 'listings/{listingId}/relatedAccounts').
   * @param conditions Optional conditions to filter documents.
   * @returns {Observable<T[]>}
   */
  getDocuments(fullPath, conditions) {
    const collectionRef = this.afs.collection(fullPath, ref => {
      let query = ref; // Use Query type
      if (conditions) {
        conditions.forEach(condition => {
          query = query.where(condition.field, condition.operator, condition.value);
        });
      }
      return query;
    });
    return collectionRef.snapshotChanges().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(actions => actions.map(action => {
      const data = action.payload.doc.data();
      const id = action.payload.doc.id;
      return {
        ...data,
        id
      }; // Ensure id is populated
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error(`Error retrieving documents from path: ${fullPath}`, error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)([]);
    }));
  }
  // Upload a file to Firestore storage
  uploadFile(path, file) {
    var _this7 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const fileRef = _this7.storage.ref(path);
      // Upload the file
      yield _this7.storage.upload(path, file);
      // Get the download URL using firstValueFrom
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(fileRef.getDownloadURL());
    })();
  }
}
_FirestoreService = FirestoreService;
_FirestoreService.ɵfac = function FirestoreService_Factory(t) {
  return new (t || _FirestoreService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_fire_compat_firestore__WEBPACK_IMPORTED_MODULE_8__.AngularFirestore), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_fire_compat_storage__WEBPACK_IMPORTED_MODULE_9__.AngularFireStorage));
};
_FirestoreService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
  token: _FirestoreService,
  factory: _FirestoreService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 7421:
/*!*******************************************************!*\
  !*** ./src/app/core/services/image-upload.service.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageUploadService: () => (/* binding */ ImageUploadService)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/storage */ 2626);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _firestore_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./firestore.service */ 3073);

var _ImageUploadService;




class ImageUploadService {
  constructor(loadingController, firestoreService, toastController) {
    this.loadingController = loadingController;
    this.firestoreService = firestoreService;
    this.toastController = toastController;
    this.storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getStorage)();
  }
  uploadImage(file, firestoreLocation, collectionName, docId, maxWidth, maxHeight, fieldName) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const loading = yield _this.loadingController.create({
        message: "Starting upload..."
      });
      yield loading.present();
      try {
        const resizedImageBlob = yield _this.resizeImage(file, maxWidth, maxHeight);
        const filePath = `${firestoreLocation}/${new Date().toISOString()}_${file.name}`;
        const storageRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(_this.storage, filePath);
        const uploadTask = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.uploadBytesResumable)(storageRef, resizedImageBlob);
        const downloadURL = yield _this.monitorUploadTask(uploadTask, loading);
        yield _this.saveImageToFirestore(collectionName, docId, downloadURL, fieldName);
        return downloadURL;
      } catch (error) {
        yield loading.dismiss();
        yield _this.showErrorToast(`Upload failed: ${error.message || error}`);
        throw error;
      } finally {
        yield loading.dismiss();
      }
    })();
  }
  monitorUploadTask(uploadTask, loading) {
    return new Promise((resolve, reject) => {
      uploadTask.on("state_changed", snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        loading.message = `Uploading file... ${progress.toFixed(0)}%`;
      }, error => {
        reject(error);
      }, /*#__PURE__*/(0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        try {
          const downloadURL = yield (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getDownloadURL)(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }));
    });
  }
  saveImageToFirestore(collectionName, docId, downloadURL, fieldName) {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!docId) {
        throw new Error("Missing document ID");
      }
      if (!downloadURL) {
        throw new Error("Missing download URL");
      }
      if (!fieldName) {
        throw new Error("Missing field name");
      }
      if (!collectionName) {
        throw new Error("Missing collection name");
      }
      const docData = {
        [fieldName]: downloadURL
      };
      yield _this2.firestoreService.updateDocument(collectionName, docId, docData);
    })();
  }
  showErrorToast(message) {
    var _this3 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const toast = yield _this3.toastController.create({
        message: message,
        duration: 2000,
        color: "danger"
      });
      yield toast.present();
    })();
  }
  resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.src = url;
      image.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let {
          width,
          height
        } = image;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx === null || ctx === void 0 || ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, "image/jpeg", 0.95);
      };
      image.onerror = error => {
        URL.revokeObjectURL(url);
        reject(new Error(`Image load error: ${error}`));
      };
    });
  }
}
_ImageUploadService = ImageUploadService;
_ImageUploadService.ɵfac = function ImageUploadService_Factory(t) {
  return new (t || _ImageUploadService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_4__.LoadingController), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_firestore_service__WEBPACK_IMPORTED_MODULE_2__.FirestoreService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_4__.ToastController));
};
_ImageUploadService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
  token: _ImageUploadService,
  factory: _ImageUploadService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 3038:
/*!**********************************************************!*\
  !*** ./src/app/core/services/success-handler.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SuccessHandlerService: () => (/* binding */ SuccessHandlerService)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);

var _SuccessHandlerService;


class SuccessHandlerService {
  constructor(toastController) {
    this.toastController = toastController;
  }
  handleSuccess(message, duration) {
    this.showToast(message, duration);
  }
  showToast(message, duration) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const toast = yield _this.toastController.create({
        message: message,
        duration: duration || 10000,
        position: "top",
        color: "success",
        buttons: [{
          text: "OK",
          role: "cancel"
        }]
      });
      yield toast.present();
    })();
  }
}
_SuccessHandlerService = SuccessHandlerService;
_SuccessHandlerService.ɵfac = function SuccessHandlerService_Factory(t) {
  return new (t || _SuccessHandlerService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_2__.ToastController));
};
_SuccessHandlerService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
  token: _SuccessHandlerService,
  factory: _SuccessHandlerService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 8517:
/*!***********************************************************************************************!*\
  !*** ./src/app/modules/account/components/create-group-modal/create-group-modal.component.ts ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateGroupModalComponent: () => (/* binding */ CreateGroupModalComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/firestore */ 1342);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 5167);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ 5480);

var _CreateGroupModalComponent;









class CreateGroupModalComponent {
  constructor(modalCtrl, fb, store) {
    this.modalCtrl = modalCtrl;
    this.fb = fb;
    this.store = store;
    this.groupForm = this.fb.group({
      name: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      description: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      tagline: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required]
    });
  }
  cancel() {
    return this.modalCtrl.dismiss(null, "cancel");
  }
  confirm() {
    return this.modalCtrl.dismiss(null, "confirm");
  }
  onSubmit() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const groupData = _this.groupForm.value;
      const authUser = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAuthUser));
      if (authUser) {
        const newGroup = {
          ...groupData,
          name: groupData.name || undefined,
          description: groupData.description || undefined,
          tagline: groupData.tagline || undefined,
          type: "group",
          // Specify that this account is a group
          // Include other necessary fields like address, language, etc.
          // Default images or placeholder values
          iconImage: "assets/icon/logo.png",
          heroImage: "assets/image/orghero.png",
          // Initialize other group-specific properties if needed
          groupDetails: {
            admins: [authUser.uid],
            // Set the user ID of the creator as an admin
            dateFounded: firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.Timestamp.now(),
            // Set the founding date
            supportedLanguages: ["en"] // Example value
          }
        };
        // Dispatch action to create group
        _this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.createAccount({
          account: newGroup
        }));
        // Close the modal after dispatching the action
        _this.modalCtrl.dismiss({
          accountId: newGroup.id
        }, "confirm");
      } else {
        // Handle error if user is not authenticated
        _this.modalCtrl.dismiss(null, "cancel");
      }
    })();
  }
}
_CreateGroupModalComponent = CreateGroupModalComponent;
_CreateGroupModalComponent.ɵfac = function CreateGroupModalComponent_Factory(t) {
  return new (t || _CreateGroupModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_8__.Store));
};
_CreateGroupModalComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _CreateGroupModalComponent,
  selectors: [["app-create-group-modal"]],
  decls: 29,
  vars: 2,
  consts: [["slot", "end"], [3, "click"], [3, "ngSubmit", "formGroup"], ["position", "stacked"], ["color", "danger"], ["type", "text", "formControlName", "name"], ["formControlName", "description"], ["type", "text", "formControlName", "tagline"], ["expand", "full", "type", "submit", 3, "disabled"]],
  template: function CreateGroupModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Create New Group");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "ion-buttons", 0)(5, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function CreateGroupModalComponent_Template_ion_button_click_5_listener() {
        return ctx.cancel();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6, "Close");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "ion-content")(8, "form", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function CreateGroupModalComponent_Template_form_ngSubmit_8_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "ion-item")(10, "ion-label", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11, "Group Name ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "ion-text", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](13, "*");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](14, "ion-input", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "ion-item")(16, "ion-label", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Group Description ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "ion-text", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, "*");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](20, "ion-textarea", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "ion-item")(22, "ion-label", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](23, "Group Tagline ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "ion-text", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](25, "*");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](26, "ion-input", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "ion-button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](28, " Create Group ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx.groupForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](19);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.groupForm.invalid);
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hY2NvdW50L2NvbXBvbmVudHMvY3JlYXRlLWdyb3VwLW1vZGFsL2NyZWF0ZS1ncm91cC1tb2RhbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 261:
/*!******************************************************************************!*\
  !*** ./src/app/shared/components/feedback-modal/feedback-modal.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedbackModalComponent: () => (/* binding */ FeedbackModalComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/storage */ 2626);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../core/services/error-handler.service */ 6119);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _core_services_firestore_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/services/firestore.service */ 3073);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);

var _FeedbackModalComponent;








function FeedbackModalComponent_ion_item_9_ion_note_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Name is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function FeedbackModalComponent_ion_item_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item")(1, "ion-label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, FeedbackModalComponent_ion_item_9_ion_note_4_Template, 2, 0, "ion-note", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_1_0 = ctx_r0.feedbackForm.get("name")) == null ? null : tmp_1_0.hasError("required"));
  }
}
function FeedbackModalComponent_ion_item_10_ion_note_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Email is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function FeedbackModalComponent_ion_item_10_ion_note_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Please enter a valid email address. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function FeedbackModalComponent_ion_item_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item")(1, "ion-label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Email");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, FeedbackModalComponent_ion_item_10_ion_note_4_Template, 2, 0, "ion-note", 4)(5, FeedbackModalComponent_ion_item_10_ion_note_5_Template, 2, 0, "ion-note", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_1_0 = ctx_r0.feedbackForm.get("email")) == null ? null : tmp_1_0.hasError("required"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.feedbackForm.get("email")) == null ? null : tmp_2_0.hasError("email"));
  }
}
function FeedbackModalComponent_ion_note_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Feedback is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function FeedbackModalComponent_ion_note_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Please select a valid image file (JPEG, PNG, GIF). ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function FeedbackModalComponent_ion_note_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " The file size should be less than 5MB. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
// Custom validator to check if the file is an image
function imageFileValidator(control) {
  const file = control.value;
  if (file) {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.indexOf(file.type) === -1) {
      return {
        invalidImageType: true
      };
    }
  }
  return null;
}
// Custom validator to check if the file size is <= 5MB
function fileSizeValidator(control) {
  const file = control.value;
  if (file && file.size > 5 * 1024 * 1024) {
    // 5MB in bytes
    return {
      invalidFileSize: true
    };
  }
  return null;
}
class FeedbackModalComponent {
  constructor(errorHandler, loadingController, modalCtrl, firestoreService, fb) {
    this.errorHandler = errorHandler;
    this.loadingController = loadingController;
    this.modalCtrl = modalCtrl;
    this.firestoreService = firestoreService;
    this.fb = fb;
    this.categories = ["Bug Report", "Feature Request", "General Feedback"];
    this.isUploading = false;
    this.uploadedFileURL = null; // Add a new class property to store the download URL of the uploaded file
    this.storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getStorage)(); // This gets the default Firebase app's storage instance
    this.feedbackForm = this.fb.group({
      category: ["Bug Report", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      feedback: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      attachment: [null, [imageFileValidator, fileSizeValidator]],
      rating: [3, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(1), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.max(5)]]
    });
  }
  ngOnInit() {
    if (this.user) {
      this.feedbackForm.addControl("name", this.fb.control(this.user.displayName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required));
      this.feedbackForm.addControl("email", this.fb.control(this.user.email, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.email]));
    } else {
      this.feedbackForm.addControl("name", this.fb.control("", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required));
      this.feedbackForm.addControl("email", this.fb.control("", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.email]));
    }
  }
  onFileChange(event) {
    const fileList = event.target.files;
    if (fileList.length > 0) {
      var _this$feedbackForm$ge;
      const file = fileList[0];
      (_this$feedbackForm$ge = this.feedbackForm.get("attachment")) === null || _this$feedbackForm$ge === void 0 || _this$feedbackForm$ge.setValue(file);
      this.uploadFile(file);
    }
  }
  uploadFile(file) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      var _this$user;
      const storageRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.ref)(_this.storage, `feedback/${(_this$user = _this.user) === null || _this$user === void 0 ? void 0 : _this$user.uid}/${new Date()}-${file.name}`); // This creates a reference to the file's future location
      const uploadTask = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.uploadBytesResumable)(storageRef, file);
      // Present the loader
      const loading = yield _this.loadingController.create({
        message: "Uploading file..."
      });
      yield loading.present();
      _this.isUploading = true;
      uploadTask.on("state_changed", snapshot => {
        // Handle the upload progress, maybe update a progress bar or show a message
        const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        // console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case "paused":
            loading.message = `Upload is paused`; // Update the loader message
            break;
          case "running":
            loading.message = `Uploading file... ${progress.toFixed(0)}%`; // Update the loader message
            break;
        }
      }, /*#__PURE__*/function () {
        var _ref = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (error) {
          // Handle errors, maybe show a message to the user
          _this.errorHandler.handleFirebaseAuthError(error);
          switch (error.code) {
            case "storage/unauthorized":
              console.error("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.error("User canceled the upload");
              break;
            case "storage/unknown":
              console.error("Unknown error occurred, inspect error.serverResponse");
              break;
          }
          _this.isUploading = false;
          yield loading.dismiss(); // Dismiss the loader on error
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }(), /*#__PURE__*/(0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        // Once the upload is complete, get the download URL
        (0,firebase_storage__WEBPACK_IMPORTED_MODULE_1__.getDownloadURL)(uploadTask.snapshot.ref).then(downloadURL => {
          // console.log("File available at", downloadURL);
          _this.uploadedFileURL = downloadURL;
          // console.log("uploadedFileURL set to:", this.uploadedFileURL);
          // this.attachment = this.uploadedFileURL;
        });
        _this.isUploading = false;
        yield loading.dismiss(); // Dismiss the loader on error
      }));
    })();
  }
  submitFeedback() {
    if (this.feedbackForm.valid) {
      var _this$user2, _this$user3, _this$user4;
      const formData = this.feedbackForm.value;
      this.firestoreService.addDocument("feedback", {
        email: (_this$user2 = this.user) === null || _this$user2 === void 0 ? void 0 : _this$user2.email,
        name: (_this$user3 = this.user) === null || _this$user3 === void 0 ? void 0 : _this$user3.displayName,
        emailVerified: (_this$user4 = this.user) === null || _this$user4 === void 0 ? void 0 : _this$user4.emailVerified,
        feedback: formData.feedback,
        rating: formData.rating,
        category: formData.category,
        attachment: this.uploadedFileURL,
        isRead: false,
        isResolved: false
      }).then(() => {
        this.modalCtrl.dismiss();
      }).catch(error => {
        this.errorHandler.handleFirebaseAuthError(error);
      });
    }
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
}
_FeedbackModalComponent = FeedbackModalComponent;
_FeedbackModalComponent.ɵfac = function FeedbackModalComponent_Factory(t) {
  return new (t || _FeedbackModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_2__.ErrorHandlerService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.LoadingController), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_firestore_service__WEBPACK_IMPORTED_MODULE_3__.FirestoreService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder));
};
_FeedbackModalComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _FeedbackModalComponent,
  selectors: [["app-feedback-modal"]],
  inputs: {
    user: "user"
  },
  decls: 40,
  vars: 7,
  consts: [["slot", "end"], [3, "click"], [1, "ion-padding"], [3, "formGroup"], [4, "ngIf"], ["formControlName", "category"], ["value", "Bug Report"], ["value", "Feature Request"], ["value", "General Feedback"], ["formControlName", "feedback"], ["type", "file", 3, "change"], ["formControlName", "rating", "min", "1", "max", "5", "step", "1", "snaps", "true"], ["size", "small", "slot", "start", "name", "star-outline"], ["slot", "end", "name", "star"], ["expand", "full", 3, "click", "disabled"], ["position", "floating"], ["type", "text", "formControlName", "name"], ["type", "email", "formControlName", "email"]],
  template: function FeedbackModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Feedback");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-buttons", 0)(5, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function FeedbackModalComponent_Template_ion_button_click_5_listener() {
        return ctx.closeModal();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Close");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-content", 2)(8, "form", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, FeedbackModalComponent_ion_item_9_Template, 5, 1, "ion-item", 4)(10, FeedbackModalComponent_ion_item_10_Template, 6, 2, "ion-item", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "ion-item")(12, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Category");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "ion-select", 5)(15, "ion-select-option", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Bug Report");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "ion-select-option", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, "Feature Request");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "ion-select-option", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20, "General Feedback");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "ion-item")(22, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "Feedback");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](24, "ion-textarea", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, FeedbackModalComponent_ion_note_25_Template, 2, 0, "ion-note", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "ion-item")(27, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](28, "Attachments");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](29, "input", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("change", function FeedbackModalComponent_Template_input_change_29_listener($event) {
        return ctx.onFileChange($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, FeedbackModalComponent_ion_note_30_Template, 2, 0, "ion-note", 4)(31, FeedbackModalComponent_ion_note_31_Template, 2, 0, "ion-note", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "ion-item")(33, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](34, "Rating");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](35, "ion-range", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](36, "ion-icon", 12)(37, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](38, "ion-button", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function FeedbackModalComponent_Template_ion_button_click_38_listener() {
        return ctx.submitFeedback();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](39, "Submit Feedback");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      let tmp_1_0;
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroup", ctx.feedbackForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.user || ((tmp_1_0 = ctx.feedbackForm.get("name")) == null ? null : tmp_1_0.invalid));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.user || ((tmp_2_0 = ctx.feedbackForm.get("email")) == null ? null : tmp_2_0.invalid));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx.feedbackForm.get("feedback")) == null ? null : tmp_3_0.hasError("required"));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx.feedbackForm.get("attachment")) == null ? null : tmp_4_0.hasError("invalidImageType"));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_5_0 = ctx.feedbackForm.get("attachment")) == null ? null : tmp_5_0.hasError("invalidFileSize"));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.isUploading || !ctx.feedbackForm.valid);
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonRange, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.NumericValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.TextValueAccessor, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZmVlZGJhY2stbW9kYWwvZmVlZGJhY2stbW9kYWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 8397:
/*!**********************************************************!*\
  !*** ./src/app/shared/components/menu/menu.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MenuComponent: () => (/* binding */ MenuComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 6421);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../feedback-modal/feedback-modal.component */ 261);
/* harmony import */ var _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../modules/account/components/create-group-modal/create-group-modal.component */ 8517);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 9191);

var _MenuComponent;










function MenuComponent_ng_container_11_ion_item_1_ion_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MenuComponent_ng_container_11_ion_item_1_ion_button_4_Template_ion_button_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r1);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"]($event.stopPropagation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "ion-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", item_r2.buttonLink);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", item_r2.buttonText, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("name", item_r2.buttonIcon);
  }
}
function MenuComponent_ng_container_11_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "ion-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, MenuComponent_ng_container_11_ion_item_1_ion_button_4_Template, 3, 3, "ion-button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", item_r2.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("name", item_r2.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](item_r2.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r2.hasButton);
  }
}
function MenuComponent_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, MenuComponent_ng_container_11_ion_item_1_Template, 5, 4, "ion-item", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", item_r2.title);
  }
}
function MenuComponent_ion_item_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function MenuComponent_ion_item_12_Template_ion_item_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r3.showFeedbackModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "ion-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Give Feedback");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function MenuComponent_ion_item_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "ion-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const p_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("href", p_r5.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("name", p_r5.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](p_r5.title);
  }
}
class MenuComponent {
  constructor(store, translate, modalCtrl, router) {
    this.store = store;
    this.translate = translate;
    this.modalCtrl = modalCtrl;
    this.router = router;
    this.subscriptions = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subscription();
    this.user = null;
    this.menuPages = [];
    this.project = [];
  }
  ngOnInit() {
    // Initialize project links
    this.project = [{
      title: "ASCENDynamics NFP",
      url: "https://ascendynamics.org",
      icon: "globe-outline"
    }, {
      title: "LinkedIn",
      url: "https://www.linkedin.com/company/ascendynamics-nfp",
      icon: "logo-linkedin"
    }, {
      title: "Facebook",
      url: "https://www.facebook.com/ASCENDynamicsNFP",
      icon: "logo-facebook"
    }, {
      title: "Slack Community",
      url: "https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ",
      icon: "logo-slack"
    }, {
      title: "YouTube Channel",
      url: "https://www.youtube.com/channel/UCkR2Cgrjyi0QPeIKIXzxOvg",
      icon: "logo-youtube"
    }, {
      title: "Donate",
      url: "https://buy.stripe.com/bIY5mC9sY1ob4TufYY",
      icon: "heart-sharp"
    }, {
      title: "Project Repository",
      url: "https://github.com/ASCENDynamics-NFP/AscendCoopPlatform",
      icon: "code-slash"
    }];
    // Combine authUser and language change observables
    const authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser);
    const langChange$ = this.translate.onLangChange;
    const menuPages$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.combineLatest)([authUser$, langChange$]).subscribe(([authUser, langChange]) => {
      this.user = authUser;
      if (authUser) {
        this.setUserMenuItems();
      } else {
        this.setGuestMenuItems();
      }
    });
    this.subscriptions.add(menuPages$);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  setGuestMenuItems() {
    this.menuPages = [{
      title: this.translate.instant("menu.login"),
      url: "/auth/login",
      icon: "log-in"
    }, {
      title: this.translate.instant("menu.signup"),
      url: "/auth/signup",
      icon: "person-add"
    }
    // {
    //   title: this.translate.instant("menu.groups"),
    //   url: "/account/group-list",
    //   icon: "business",
    // },
    ];
  }
  setUserMenuItems() {
    var _this$user;
    this.menuPages = [{
      title: this.translate.instant("menu.profile"),
      url: `/account/${(_this$user = this.user) === null || _this$user === void 0 ? void 0 : _this$user.uid}`,
      icon: "person"
    }, {
      title: this.translate.instant("menu.listings"),
      url: "/listings",
      icon: "list",
      hasButton: true,
      buttonLink: "/listings/create",
      buttonText: this.translate.instant("menu.create"),
      buttonIcon: "add"
    }, {
      title: this.translate.instant("menu.groups"),
      url: "/account/group-list",
      icon: "business"
      // hasButton: true,
      // buttonLink: "create-group",
      // buttonText: this.translate.instant("menu.createGroup"),
      // buttonIcon: "add",
    }, {
      title: this.translate.instant("menu.users"),
      url: "/account/users",
      icon: "people"
    }, {
      title: this.translate.instant("menu.settings"),
      url: "/account/settings",
      icon: "settings"
    }
    // {
    //   title: this.translate.instant("menu.dashboard"),
    //   url: `user-dashboard/${this.user?.uid}`,
    //   icon: "newspaper",
    // },
    ];
  }
  // Handle button clicks in menu items
  handleButtonClick(buttonLink) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!buttonLink) return;
      if (buttonLink === "create-group") {
        const modal = yield _this.modalCtrl.create({
          component: _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_3__.CreateGroupModalComponent
        });
        yield modal.present();
        const {
          data,
          role
        } = yield modal.onWillDismiss();
        if (role === "confirm" && data) {
          _this.router.navigate([`/${data.groupId}`]);
        }
      }
    })();
  }
  // Show feedback modal
  showFeedbackModal() {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const modal = yield _this2.modalCtrl.create({
        component: _feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__.FeedbackModalComponent,
        componentProps: {
          user: _this2.user
        }
      });
      return yield modal.present();
    })();
  }
}
_MenuComponent = MenuComponent;
_MenuComponent.ɵfac = function MenuComponent_Factory(t) {
  return new (t || _MenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_7__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_9__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router));
};
_MenuComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _MenuComponent,
  selectors: [["app-menu"]],
  decls: 19,
  vars: 4,
  consts: [["contentId", "main-content", 3, "disabled"], ["side", "start", "contentId", "main-content", "type", "overlay"], [1, "menu-toolbar"], [1, "toolbar-content"], ["src", "assets/icon/logo.png", "alt", "ASCENDynamics Logo", 1, "toolbar-logo"], ["color", "primary", "translate", ""], ["auto-hide", "false"], [4, "ngFor", "ngForOf"], ["style", "cursor: pointer", "lines", "none", "detail", "false", 3, "click", 4, "ngIf"], ["lines", "none", "target", "_blank", "class", "project-item", 3, "href", 4, "ngFor", "ngForOf"], ["id", "main-content"], ["lines", "none", "detail", "false", "routerLinkActive", "selected", 3, "routerLink", 4, "ngIf"], ["lines", "none", "detail", "false", "routerLinkActive", "selected", 3, "routerLink"], ["aria-hidden", "true", "slot", "start", 3, "name"], ["fill", "outline", "slot", "end", 3, "routerLink", "click", 4, "ngIf"], ["fill", "outline", "slot", "end", 3, "click", "routerLink"], ["lines", "none", "detail", "false", 2, "cursor", "pointer", 3, "click"], ["aria-hidden", "true", "slot", "start", "name", "ear-outline"], ["lines", "none", "target", "_blank", 1, "project-item", 3, "href"]],
  template: function MenuComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-split-pane", 0)(1, "ion-menu", 1)(2, "ion-header")(3, "ion-toolbar", 2)(4, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "img", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-title", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "menu.title");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "ion-content")(9, "ion-list")(10, "ion-menu-toggle", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, MenuComponent_ng_container_11_Template, 2, 1, "ng-container", 7)(12, MenuComponent_ion_item_12_Template, 4, 0, "ion-item", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "ion-list")(14, "ion-list-header")(15, "strong");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "ASCENDynamics NFP Information");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, MenuComponent_ion_item_17_Template, 4, 3, "ion-item", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](18, "ion-router-outlet", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx.user);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.menuPages);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.user);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.project);
    }
  },
  dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLinkActive, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonListHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonMenu, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonMenuToggle, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonSplitPane, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonRouterOutlet, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.RouterLinkDelegate, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateDirective],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.menu-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n\n.toolbar-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0; \n\n}\n\n.toolbar-logo[_ngcontent-%COMP%] {\n  padding-left: 0.75rem;\n  height: 30px; \n\n  width: auto;\n}\n\nion-item[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\nion-item[_ngcontent-%COMP%]:hover {\n  --background: var(--ion-color-light);\n  z-index: 1;\n}\nion-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  z-index: 2;\n  pointer-events: auto;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbWVudS9tZW51LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFvQkE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7QUFBRjs7QUFHQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLE1BQUEsRUFBQSx5Q0FBQTtBQUFGOztBQUdBO0VBQ0UscUJBQUE7RUFDQSxZQUFBLEVBQUEscUJBQUE7RUFDQSxXQUFBO0FBQUY7O0FBR0E7RUFDRSxlQUFBO0FBQUY7QUFDRTtFQUNFLG9DQUFBO0VBQ0EsVUFBQTtBQUNKO0FBRUU7RUFDRSxVQUFBO0VBQ0Esb0JBQUE7QUFBSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4ubWVudS10b29sYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLnRvb2xiYXItY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMDsgLyogQWRqdXN0IHNwYWNpbmcgYmV0d2VlbiBsb2dvIGFuZCB0ZXh0ICovXG59XG5cbi50b29sYmFyLWxvZ28ge1xuICBwYWRkaW5nLWxlZnQ6IDAuNzVyZW07XG4gIGhlaWdodDogMzBweDsgLyogQWRqdXN0IGFzIG5lZWRlZCAqL1xuICB3aWR0aDogYXV0bztcbn1cblxuaW9uLWl0ZW0ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gICY6aG92ZXIge1xuICAgIC0tYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLWxpZ2h0KTtcbiAgICB6LWluZGV4OiAxO1xuICB9XG5cbiAgaW9uLWJ1dHRvbiB7XG4gICAgei1pbmRleDogMjtcbiAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 8314:
/*!**************************************************!*\
  !*** ./src/app/state/actions/account.actions.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearAccountsState: () => (/* binding */ clearAccountsState),
/* harmony export */   createAccount: () => (/* binding */ createAccount),
/* harmony export */   createAccountFailure: () => (/* binding */ createAccountFailure),
/* harmony export */   createAccountSuccess: () => (/* binding */ createAccountSuccess),
/* harmony export */   createRelatedAccount: () => (/* binding */ createRelatedAccount),
/* harmony export */   createRelatedAccountFailure: () => (/* binding */ createRelatedAccountFailure),
/* harmony export */   createRelatedAccountSuccess: () => (/* binding */ createRelatedAccountSuccess),
/* harmony export */   deleteAccount: () => (/* binding */ deleteAccount),
/* harmony export */   deleteAccountFailure: () => (/* binding */ deleteAccountFailure),
/* harmony export */   deleteAccountSuccess: () => (/* binding */ deleteAccountSuccess),
/* harmony export */   deleteRelatedAccount: () => (/* binding */ deleteRelatedAccount),
/* harmony export */   deleteRelatedAccountFailure: () => (/* binding */ deleteRelatedAccountFailure),
/* harmony export */   deleteRelatedAccountSuccess: () => (/* binding */ deleteRelatedAccountSuccess),
/* harmony export */   deleteRelatedListing: () => (/* binding */ deleteRelatedListing),
/* harmony export */   deleteRelatedListingFailure: () => (/* binding */ deleteRelatedListingFailure),
/* harmony export */   deleteRelatedListingSuccess: () => (/* binding */ deleteRelatedListingSuccess),
/* harmony export */   loadAccount: () => (/* binding */ loadAccount),
/* harmony export */   loadAccountFailure: () => (/* binding */ loadAccountFailure),
/* harmony export */   loadAccountSuccess: () => (/* binding */ loadAccountSuccess),
/* harmony export */   loadAccounts: () => (/* binding */ loadAccounts),
/* harmony export */   loadAccountsFailure: () => (/* binding */ loadAccountsFailure),
/* harmony export */   loadAccountsSuccess: () => (/* binding */ loadAccountsSuccess),
/* harmony export */   loadRelatedAccounts: () => (/* binding */ loadRelatedAccounts),
/* harmony export */   loadRelatedAccountsFailure: () => (/* binding */ loadRelatedAccountsFailure),
/* harmony export */   loadRelatedAccountsSuccess: () => (/* binding */ loadRelatedAccountsSuccess),
/* harmony export */   loadRelatedListings: () => (/* binding */ loadRelatedListings),
/* harmony export */   loadRelatedListingsFailure: () => (/* binding */ loadRelatedListingsFailure),
/* harmony export */   loadRelatedListingsSuccess: () => (/* binding */ loadRelatedListingsSuccess),
/* harmony export */   searchAccounts: () => (/* binding */ searchAccounts),
/* harmony export */   searchAccountsFailure: () => (/* binding */ searchAccountsFailure),
/* harmony export */   searchAccountsSuccess: () => (/* binding */ searchAccountsSuccess),
/* harmony export */   setSelectedAccount: () => (/* binding */ setSelectedAccount),
/* harmony export */   updateAccount: () => (/* binding */ updateAccount),
/* harmony export */   updateAccountFailure: () => (/* binding */ updateAccountFailure),
/* harmony export */   updateAccountSuccess: () => (/* binding */ updateAccountSuccess),
/* harmony export */   updateRelatedAccount: () => (/* binding */ updateRelatedAccount),
/* harmony export */   updateRelatedAccountFailure: () => (/* binding */ updateRelatedAccountFailure),
/* harmony export */   updateRelatedAccountSuccess: () => (/* binding */ updateRelatedAccountSuccess)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 5480);
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
// src/app/state/actions/account.actions.ts

const clearAccountsState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Clear Accounts");
// Load Accounts
const loadAccounts = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Accounts");
const loadAccountsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Accounts Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadAccountsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Accounts Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Load Account by ID
const loadAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Set Selected Account
const setSelectedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Set Selected Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Create Account
const createAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Update Account
const updateAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Delete Account
const deleteAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Search Accounts
const searchAccounts = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Search Accounts", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const searchAccountsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Search Accounts Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const searchAccountsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Search Accounts Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Create Related Account
const createRelatedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Related Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createRelatedAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Related Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createRelatedAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Create Related Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Delete Related Account
const deleteRelatedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteRelatedAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteRelatedAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Load Related Accounts
const loadRelatedAccounts = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Accounts", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadRelatedAccountsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Accounts Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadRelatedAccountsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Accounts Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Update Related Account
const updateRelatedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Related Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateRelatedAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Related Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateRelatedAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Update Related Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Load Related Listings
const loadRelatedListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Listings", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadRelatedListingsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Listings Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadRelatedListingsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Load Related Listings Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteRelatedListing = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Listing", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteRelatedListingSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Listing Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteRelatedListingFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Account] Delete Related Listing Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());

/***/ }),

/***/ 2345:
/*!***********************************************!*\
  !*** ./src/app/state/actions/auth.actions.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   confirmSignInWithEmailLink: () => (/* binding */ confirmSignInWithEmailLink),
/* harmony export */   confirmSignInWithEmailLinkFailure: () => (/* binding */ confirmSignInWithEmailLinkFailure),
/* harmony export */   confirmSignInWithEmailLinkSuccess: () => (/* binding */ confirmSignInWithEmailLinkSuccess),
/* harmony export */   initializeAuth: () => (/* binding */ initializeAuth),
/* harmony export */   processSignInLink: () => (/* binding */ processSignInLink),
/* harmony export */   processSignInLinkFailure: () => (/* binding */ processSignInLinkFailure),
/* harmony export */   processSignInLinkSuccess: () => (/* binding */ processSignInLinkSuccess),
/* harmony export */   sendPasswordResetEmail: () => (/* binding */ sendPasswordResetEmail),
/* harmony export */   sendPasswordResetEmailFailure: () => (/* binding */ sendPasswordResetEmailFailure),
/* harmony export */   sendPasswordResetEmailSuccess: () => (/* binding */ sendPasswordResetEmailSuccess),
/* harmony export */   sendSignInLinkToEmail: () => (/* binding */ sendSignInLinkToEmail),
/* harmony export */   sendSignInLinkToEmailFailure: () => (/* binding */ sendSignInLinkToEmailFailure),
/* harmony export */   sendSignInLinkToEmailSuccess: () => (/* binding */ sendSignInLinkToEmailSuccess),
/* harmony export */   sendVerificationMail: () => (/* binding */ sendVerificationMail),
/* harmony export */   sendVerificationMailFailure: () => (/* binding */ sendVerificationMailFailure),
/* harmony export */   sendVerificationMailSuccess: () => (/* binding */ sendVerificationMailSuccess),
/* harmony export */   signIn: () => (/* binding */ signIn),
/* harmony export */   signInFailure: () => (/* binding */ signInFailure),
/* harmony export */   signInSuccess: () => (/* binding */ signInSuccess),
/* harmony export */   signInWithGoogle: () => (/* binding */ signInWithGoogle),
/* harmony export */   signInWithGoogleFailure: () => (/* binding */ signInWithGoogleFailure),
/* harmony export */   signInWithGoogleSuccess: () => (/* binding */ signInWithGoogleSuccess),
/* harmony export */   signOut: () => (/* binding */ signOut),
/* harmony export */   signOutFailure: () => (/* binding */ signOutFailure),
/* harmony export */   signOutSuccess: () => (/* binding */ signOutSuccess),
/* harmony export */   signUp: () => (/* binding */ signUp),
/* harmony export */   signUpFailure: () => (/* binding */ signUpFailure),
/* harmony export */   signUpSuccess: () => (/* binding */ signUpSuccess),
/* harmony export */   updateAuthUser: () => (/* binding */ updateAuthUser),
/* harmony export */   updateAuthUserFailure: () => (/* binding */ updateAuthUserFailure),
/* harmony export */   updateAuthUserSuccess: () => (/* binding */ updateAuthUserSuccess)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 5480);
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
// src/app/core/store/auth/auth.actions.ts

const initializeAuth = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Initialize Auth");
const sendVerificationMail = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Verification Mail", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const sendVerificationMailSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Verification Mail Success");
const sendVerificationMailFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Verification Mail Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signUp = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Up", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signUpSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Up Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signUpFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Up Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signIn = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signInSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signInFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signInWithGoogle = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In With Google");
const signInWithGoogleSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In With Google Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signInWithGoogleFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign In With Google Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const signOut = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Out");
const signOutSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Out Success");
const signOutFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Sign Out Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const sendPasswordResetEmail = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Password Reset Email", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const sendPasswordResetEmailSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Password Reset Email Success");
const sendPasswordResetEmailFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Password Reset Email Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const sendSignInLinkToEmail = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Sign-In Link To Email", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const sendSignInLinkToEmailSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Sign-In Link To Email Success");
const sendSignInLinkToEmailFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Send Sign-In Link To Email Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const confirmSignInWithEmailLink = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Confirm Sign-In With Email Link", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const confirmSignInWithEmailLinkSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Confirm Sign-In With Email Link Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const confirmSignInWithEmailLinkFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Confirm Sign-In With Email Link Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// New Actions for Processing Sign-In Links
const processSignInLink = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Process Sign-In Link", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const processSignInLinkSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Process Sign-In Link Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const processSignInLinkFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Process Sign-In Link Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateAuthUser = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Update Auth User", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateAuthUserSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Update Auth User Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateAuthUserFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Auth] Update Auth User Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());

/***/ }),

/***/ 7118:
/*!***************************************************!*\
  !*** ./src/app/state/actions/listings.actions.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearListingsState: () => (/* binding */ clearListingsState),
/* harmony export */   createListing: () => (/* binding */ createListing),
/* harmony export */   createListingFailure: () => (/* binding */ createListingFailure),
/* harmony export */   createListingSuccess: () => (/* binding */ createListingSuccess),
/* harmony export */   deleteListing: () => (/* binding */ deleteListing),
/* harmony export */   deleteListingFailure: () => (/* binding */ deleteListingFailure),
/* harmony export */   deleteListingSuccess: () => (/* binding */ deleteListingSuccess),
/* harmony export */   filterListings: () => (/* binding */ filterListings),
/* harmony export */   loadListingById: () => (/* binding */ loadListingById),
/* harmony export */   loadListingByIdFailure: () => (/* binding */ loadListingByIdFailure),
/* harmony export */   loadListingByIdSuccess: () => (/* binding */ loadListingByIdSuccess),
/* harmony export */   loadListingRelatedAccounts: () => (/* binding */ loadListingRelatedAccounts),
/* harmony export */   loadListingRelatedAccountsFailure: () => (/* binding */ loadListingRelatedAccountsFailure),
/* harmony export */   loadListingRelatedAccountsSuccess: () => (/* binding */ loadListingRelatedAccountsSuccess),
/* harmony export */   loadListings: () => (/* binding */ loadListings),
/* harmony export */   loadListingsFailure: () => (/* binding */ loadListingsFailure),
/* harmony export */   loadListingsSuccess: () => (/* binding */ loadListingsSuccess),
/* harmony export */   searchListings: () => (/* binding */ searchListings),
/* harmony export */   submitApplication: () => (/* binding */ submitApplication),
/* harmony export */   submitApplicationFailure: () => (/* binding */ submitApplicationFailure),
/* harmony export */   submitApplicationSuccess: () => (/* binding */ submitApplicationSuccess),
/* harmony export */   updateListing: () => (/* binding */ updateListing),
/* harmony export */   updateListingFailure: () => (/* binding */ updateListingFailure),
/* harmony export */   updateListingSuccess: () => (/* binding */ updateListingSuccess),
/* harmony export */   updateRelatedAccount: () => (/* binding */ updateRelatedAccount),
/* harmony export */   updateRelatedAccountFailure: () => (/* binding */ updateRelatedAccountFailure),
/* harmony export */   updateRelatedAccountSuccess: () => (/* binding */ updateRelatedAccountSuccess)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 5480);
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
// src/app/state/listings/listings.actions.ts

const loadListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings Page] Load Listings");
const clearListingsState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Clear Listings");
const loadListingsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Load Listings Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Load Listings Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingById = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listing Detail Page] Load Listing By Id", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingByIdSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Load Listing By Id Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingByIdFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Load Listing By Id Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateListing = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Update Listing", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateListingSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Update Listing Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateListingFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Update Listing Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createListing = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Create Listing", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createListingSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Create Listing Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const createListingFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Create Listing Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteListing = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Delete Listing", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteListingSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Delete Listing Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const deleteListingFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings API] Delete Listing Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const filterListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings Page] Filter Listings", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const searchListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings Page] Search Listings", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
// Application Submission Actions
const submitApplication = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Submit Application", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const submitApplicationSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Submit Application Success");
const submitApplicationFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Submit Application Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingRelatedAccounts = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listing] Load Related Accounts", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingRelatedAccountsSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listing] Load Related Accounts Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const loadListingRelatedAccountsFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listing] Load Related Accounts Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateRelatedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Update Related Account", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateRelatedAccountSuccess = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Update Related Account Success", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());
const updateRelatedAccountFailure = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)("[Listings] Update Related Account Failure", (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)());

/***/ }),

/***/ 4862:
/*!**************************************************!*\
  !*** ./src/app/state/effects/account.effects.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AccountEffects: () => (/* binding */ AccountEffects)
/* harmony export */ });
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/account.actions */ 8314);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 3496);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 523);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 5733);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 1856);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 1082);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 8713);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 4752);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 3396);
/* harmony import */ var _selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../selectors/auth.selectors */ 9559);
/* harmony import */ var _actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/auth.actions */ 2345);
/* harmony import */ var _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/fire/firestore */ 744);
/* harmony import */ var _selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../selectors/account.selectors */ 8686);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_firestore_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/services/firestore.service */ 3073);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _AccountEffects;














class AccountEffects {
  constructor(actions$, firestoreService, store, router, toastController) {
    this.actions$ = actions$;
    this.firestoreService = firestoreService;
    this.store = store;
    this.router = router;
    this.toastController = toastController;
    // Load Accounts only if not fresh
    this.loadAccounts$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccounts), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.withLatestFrom)(this.store.select(_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAreAccountsFresh)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(([_, areFresh]) => !areFresh), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(() => this.firestoreService.getAllAccounts().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(accounts => _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountsSuccess({
      accounts
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountsFailure({
      error: error.message || error
    })))))));
    // Load Account by ID if it doesn't exist locally
    this.loadAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(({
      accountId
    }) => this.store.select((0,_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAccountById)(accountId)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(existingAccount => {
      if (existingAccount) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)({
          type: "[Account] No Action"
        });
      } else {
        return this.firestoreService.getDocument("accounts", accountId).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(account => {
          if (!account) {
            throw new Error("Account not found");
          }
          return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountSuccess({
            account
          });
        }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
          this.showToast(`Error loading account: ${error.message}`, "danger");
          return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountFailure({
            error: error.message
          }));
        }));
      }
    })))));
    // Create Account
    this.createAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      account
    }) => {
      const newAccount = {
        ...account,
        createdAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)(),
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.addDocument("accounts", newAccount)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(accountId => {
        this.router.navigate([`/accounts/${accountId}`]);
        this.showToast("Account created successfully", "success");
        return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createAccountSuccess({
          account: {
            ...newAccount,
            id: accountId
          }
        });
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
        this.showToast(`Error creating account: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createAccountFailure({
          error: error.message
        }));
      }));
    })));
    // Update Account
    this.updateAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      account
    }) => {
      const updatedAccount = {
        ...account,
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.updateDocument("accounts", account.id, updatedAccount)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
        this.showToast("Account updated successfully", "success");
        return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccountSuccess({
          account: updatedAccount
        });
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
        this.showToast(`Error updating account: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccountFailure({
          error: error.message
        }));
      }));
    })));
    // Delete Account
    this.deleteAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      accountId
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.deleteDocument("accounts", accountId)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
      this.router.navigate(["/"]);
      this.showToast("Account deleted successfully", "success");
      return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteAccountSuccess({
        accountId
      });
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Error deleting account: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteAccountFailure({
        error: error.message
      }));
    })))));
    // Search Accounts
    this.searchAccounts$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.searchAccounts), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      query
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.searchAccountByName("accounts", query)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(accountsData => {
      const accounts = (accountsData || []).map(accountData => ({
        ...accountData
      }));
      this.showToast(`Found ${accounts.length} accounts`, "success");
      return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.searchAccountsSuccess({
        accounts
      });
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Search failed: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.searchAccountsFailure({
        error: error.message
      }));
    })))));
    // Create Related Account
    this.createRelatedAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createRelatedAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      accountId,
      relatedAccount
    }) => {
      const newRelatedAccount = {
        ...relatedAccount,
        createdAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)(),
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.setDocument(`accounts/${accountId}/relatedAccounts/${relatedAccount.id}`, newRelatedAccount)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
        this.showToast("Request successful", "success");
        return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createRelatedAccountSuccess({
          accountId,
          relatedAccount: newRelatedAccount
        });
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
        this.showToast(`Failed to create related account: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createRelatedAccountFailure({
          error: error.message
        }));
      }));
    })));
    // Delete Related Account
    this.deleteRelatedAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(({
      accountId,
      relatedAccountId
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.deleteDocumentAtPath(`accounts/${accountId}/relatedAccounts/${relatedAccountId}`)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
      this.showToast("Removed successfully", "success");
      return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedAccountSuccess({
        accountId,
        relatedAccountId
      });
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Failed to remove related account: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedAccountFailure({
        error: error.message
      }));
    })))));
    // Load Related Accounts if not fresh
    this.loadRelatedAccounts$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccounts), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(({
      accountId
    }) => this.store.select((0,_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAreRelatedAccountsFresh)(accountId)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(areFresh => !areFresh), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(() => this.firestoreService.getRelatedAccounts(accountId).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(relatedAccounts => _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccountsSuccess({
      accountId,
      relatedAccounts
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Error loading related accounts: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccountsFailure({
        error: error.message
      }));
    })))))));
    // Update Related Account
    this.updateRelatedAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.debounceTime)(300), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(({
      accountId,
      relatedAccount
    }) => {
      const updatedRelatedAccount = {
        ...relatedAccount,
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_14__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.updateDocument(`accounts/${accountId}/relatedAccounts`, relatedAccount.id, updatedRelatedAccount)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
        this.showToast("Updated successfully", "success");
        return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccountSuccess({
          accountId,
          relatedAccount: updatedRelatedAccount
        });
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
        this.showToast(`Update failed: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccountFailure({
          error: error.message
        }));
      }));
    })));
    // Load Related Listings if not fresh
    this.loadRelatedListings$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListings), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(({
      accountId
    }) => this.store.select((0,_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAreRelatedListingsFresh)(accountId)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.filter)(areFresh => !areFresh), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.switchMap)(() => this.firestoreService.getDocuments(`accounts/${accountId}/relatedListings`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(relatedListings => _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListingsSuccess({
      accountId,
      relatedListings
    })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Error loading related listings: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListingsFailure({
        error: error.message
      }));
    })))))));
    // Sync Auth User with Account after a successful load
    this.syncAuthUserWithAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountSuccess), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.withLatestFrom)(this.store.select(_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(([{
      account
    }, authUser]) => {
      if (authUser !== null && authUser !== void 0 && authUser.uid && account.id && authUser.uid === account.id) {
        return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.updateAuthUser({
          user: {
            displayName: account.name,
            heroImage: account.heroImage,
            iconImage: account.iconImage,
            tagline: account.tagline,
            type: account.type,
            settings: account.settings
          }
        });
      }
      return {
        type: "[Account] No Action"
      };
    })));
    // Set Selected Account
    this.setSelectedAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.setSelectedAccount), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.withLatestFrom)(this.store.select(_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAccountEntities)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(([action, entities]) => {
      const accountExists = !!entities[action.accountId];
      if (!accountExists) {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccount({
          accountId: action.accountId
        }));
      }
      return rxjs__WEBPACK_IMPORTED_MODULE_17__.EMPTY;
    })));
    // Delete Related Listing
    this.deleteRelatedListing$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedListing), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.mergeMap)(({
      accountId,
      relatedListingId
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.from)(this.firestoreService.deleteDocumentAtPath(`accounts/${accountId}/relatedListings/${relatedListingId}`)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(() => {
      this.showToast("Removed successfully", "success");
      return _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedListingSuccess({
        accountId,
        relatedListingId
      });
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.catchError)(error => {
      this.showToast(`Failed to remove related listing: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedListingFailure({
        error: error.message
      }));
    })))));
  }
  showToast(message, color) {
    this.toastController.create({
      message,
      duration: 2000,
      color
    }).then(toast => toast.present());
  }
}
_AccountEffects = AccountEffects;
_AccountEffects.ɵfac = function AccountEffects_Factory(t) {
  return new (t || _AccountEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.Actions), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵinject"](_core_services_firestore_service__WEBPACK_IMPORTED_MODULE_4__.FirestoreService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_19__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_21__.ToastController));
};
_AccountEffects.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdefineInjectable"]({
  token: _AccountEffects,
  factory: _AccountEffects.ɵfac
});

/***/ }),

/***/ 9351:
/*!***********************************************!*\
  !*** ./src/app/state/effects/auth.effects.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthEffects: () => (/* binding */ AuthEffects)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/auth.actions */ 2345);
/* harmony import */ var _actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/account.actions */ 8314);
/* harmony import */ var _actions_listings_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/listings.actions */ 7118);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/auth */ 6282);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 1082);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 3496);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 8713);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 1969);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 646);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 5733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs */ 5117);
/* harmony import */ var _selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../selectors/auth.selectors */ 9559);
/* harmony import */ var _selectors_account_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../selectors/account.selectors */ 8686);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/services/error-handler.service */ 6119);
/* harmony import */ var _core_services_success_handler_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../core/services/success-handler.service */ 3038);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @ngrx/store */ 5480);

var _AuthEffects;















class AuthEffects {
  constructor(actions$, errorHandler, successHandler, router, alertController, loadingController, store) {
    var _this = this;
    this.actions$ = actions$;
    this.errorHandler = errorHandler;
    this.successHandler = successHandler;
    this.router = router;
    this.alertController = alertController;
    this.loadingController = loadingController;
    this.store = store;
    this.auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.getAuth)();
    this.actionCodeSettings = {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: true
    };
    // Initialize Auth and Process Sign-In Link
    this.initializeAuth$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.initializeAuth), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(() => {
      const url = window.location.href;
      if ((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.isSignInWithEmailLink)(this.auth, url)) {
        const email = window.localStorage.getItem("emailForSignIn");
        if (email) {
          return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLink({
            email,
            link: url
          }));
        } else {
          return (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)(this.promptForEmail()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(email => {
            if (email) {
              return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLink({
                email,
                link: url
              }));
            } else {
              return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLinkFailure({
                error: "Email is required to complete sign-in."
              }));
            }
          }), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLinkFailure({
            error
          }))));
        }
      } else {
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)({
          type: "NO_ACTION"
        });
      }
    })));
    // Process Sign-In Link and Load Account
    this.processSignInLink$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLink), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      email,
      link
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.signInWithEmailLink)(this.auth, email, link)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess("Successfully signed in with email link!");
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)( /*#__PURE__*/function () {
      var _ref = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (result) {
        const idTokenResult = yield result.user.getIdTokenResult();
        return {
          user: result.user,
          claims: idTokenResult.claims
        };
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      user,
      claims
    }) => this.createAuthUserFromClaims(user, claims).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(authUser => {
      this.store.dispatch(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUser({
        user: authUser
      }));
      return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInSuccess({
        uid: authUser.uid
      });
    }))), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.processSignInLinkFailure({
        error
      }));
    })))));
    // Sign-Up Effect
    this.signUp$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signUp), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      email,
      password
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.createUserWithEmailAndPassword)(this.auth, email, password)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(result => {
      this.successHandler.handleSuccess("Successfully signed up!");
      this.router.navigateByUrl(`/account/registration/${result.user.uid}`, {
        replaceUrl: true
      });
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)( /*#__PURE__*/function () {
      var _ref2 = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (result) {
        const idTokenResult = yield result.user.getIdTokenResult();
        return {
          user: result.user,
          claims: idTokenResult.claims
        };
      });
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      user,
      claims
    }) => this.createAuthUserFromClaims(user, claims).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(authUser => {
      this.store.dispatch(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUser({
        user: authUser
      }));
      return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signUpSuccess({
        user: authUser
      });
    }))), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signUpFailure({
        error
      }));
    })))));
    // Sign-In Effect
    this.signIn$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signIn), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      email,
      password
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.signInWithEmailAndPassword)(this.auth, email, password)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess("Successfully signed in!");
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)( /*#__PURE__*/function () {
      var _ref3 = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (result) {
        const idTokenResult = yield result.user.getIdTokenResult();
        return {
          user: result.user,
          claims: idTokenResult.claims
        };
      });
      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }()), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      user,
      claims
    }) => this.createAuthUserFromClaims(user, claims).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(authUser => {
      this.store.dispatch(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUser({
        user: authUser
      }));
      return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInSuccess({
        uid: authUser.uid
      });
    }))), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInFailure({
        error
      }));
    })))));
    // Sign-In with Google Effect
    this.signInWithGoogle$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInWithGoogle), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.signInWithPopup)(this.auth, new firebase_auth__WEBPACK_IMPORTED_MODULE_4__.GoogleAuthProvider())).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess("Successfully signed in with Google!");
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)( /*#__PURE__*/function () {
      var _ref4 = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (result) {
        const idTokenResult = yield result.user.getIdTokenResult();
        return {
          user: result.user,
          claims: idTokenResult.claims
        };
      });
      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    }()), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      user,
      claims
    }) => this.createAuthUserFromClaims(user, claims).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(authUser => {
      this.store.dispatch(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUser({
        user: authUser
      }));
      return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInSuccess({
        uid: authUser.uid
      });
    }))), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInWithGoogleFailure({
        error
      }));
    })))));
    // Sign-In Success Effect: Navigate to Account Page
    this.signInSuccess$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signInSuccess), (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(({
      uid
    }) => {
      this.router.navigateByUrl(`/account/${uid}`, {
        replaceUrl: true
      });
    })), {
      dispatch: false
    });
    // Sign-Out Effect
    this.signOut$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signOut), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.signOut)(this.auth)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess("You have been signed out!");
      this.router.navigate(["auth"]);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(() => [_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signOutSuccess(), _actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.clearAccountsState(), _actions_listings_actions__WEBPACK_IMPORTED_MODULE_3__.clearListingsState()]), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signOutFailure({
        error
      }));
    })))));
    // Send Password Reset Email Effect
    this.sendPasswordResetEmail$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendPasswordResetEmail), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      email
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.sendPasswordResetEmail)(this.auth, email)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess("Please check your email for further instructions!");
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(() => _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendPasswordResetEmailSuccess()), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendPasswordResetEmailFailure({
        error
      }));
    })))));
    // Send Verification Mail Effect
    this.sendVerificationMail$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendVerificationMail), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(({
      email
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.sendSignInLinkToEmail)(this.auth, email, this.actionCodeSettings)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      this.successHandler.handleSuccess(`Verification email sent to ${email}! Please check your inbox.`, 30000);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(() => _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendVerificationMailSuccess()), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendVerificationMailFailure({
        error
      }));
    })))));
    // Send Sign-In Link to Email Effect
    this.sendSignInLinkToEmail$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendSignInLinkToEmail), (0,rxjs__WEBPACK_IMPORTED_MODULE_16__.exhaustMap)(({
      email
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)(this.loadingController.create()).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(loading => loading.present()), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.switchMap)(loading => (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.from)((0,firebase_auth__WEBPACK_IMPORTED_MODULE_4__.sendSignInLinkToEmail)(this.auth, email, this.actionCodeSettings)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)(() => {
      window.localStorage.setItem("emailForSignIn", email);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(() => {
      loading.dismiss();
      return _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendSignInLinkToEmailSuccess();
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => {
      loading.dismiss();
      this.errorHandler.handleFirebaseAuthError(error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendSignInLinkToEmailFailure({
        error
      }));
    })))))));
    // Success Alert for Sign-In Link
    this.sendSignInLinkToEmailSuccess$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendSignInLinkToEmailSuccess), (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)( /*#__PURE__*/(0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this.alertController.create({
        header: "Email Sent",
        message: "A sign-in link has been sent to your email address.",
        buttons: ["OK"]
      });
      yield alert.present();
    }))), {
      dispatch: false
    });
    // Failure Alert for Sign-In Link
    this.sendSignInLinkToEmailFailure$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.sendSignInLinkToEmailFailure), (0,rxjs__WEBPACK_IMPORTED_MODULE_14__.tap)( /*#__PURE__*/function () {
      var _ref6 = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* ({
        error
      }) {
        const alert = yield _this.alertController.create({
          header: "Error",
          message: `Failed to send sign-in link: ${error.message || error}`,
          buttons: ["OK"]
        });
        yield alert.present();
      });
      return function (_x5) {
        return _ref6.apply(this, arguments);
      };
    }())), {
      dispatch: false
    });
    // Update Auth User Effect
    this.updateAuthUser$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.ofType)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUser), (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.withLatestFrom)(this.store.select(_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_5__.selectAuthUser)), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(([{
      user
    }, currentUser]) => ({
      user: {
        ...currentUser,
        ...user
      }
    })), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(({
      user
    }) => _actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUserSuccess({
      user
    })), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.of)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.updateAuthUserFailure({
      error
    })))));
  }
  // Helper method to prompt the user for their email
  promptForEmail() {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this2.alertController.create({
        header: "Email Required",
        message: "Please enter your email to complete sign-in.",
        inputs: [{
          name: "email",
          type: "email",
          placeholder: "Enter your email"
        }],
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Submit",
          handler: data => {
            if (data.email) {
              window.localStorage.setItem("emailForSignIn", data.email);
              return data.email;
            } else {
              return null;
            }
          }
        }]
      });
      yield alert.present();
      return new Promise(resolve => {
        alert.onDidDismiss().then(result => {
          if (result.role === "cancel") {
            resolve(null);
          } else {
            var _result$data;
            resolve(((_result$data = result.data) === null || _result$data === void 0 || (_result$data = _result$data.values) === null || _result$data === void 0 ? void 0 : _result$data.email) || null);
          }
        });
      });
    })();
  }
  // Helper method to create AuthUser from claims and account data
  createAuthUserFromClaims(user, claims) {
    return this.store.select((0,_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_6__.selectAccountById)(user.uid)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_18__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.map)(account => {
      var _account$contactInfor;
      // Handle undefined account
      const defaultIconImage = user.photoURL || "src/assets/avatar/male1.png";
      const defaultHeroImage = "src/assets/image/orghero.png";
      const defaultTagline = "Helping others at ASCENDynamics NFP.";
      const defaultSettings = {
        language: "en",
        theme: "system"
      };
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: claims["displayName"] || (account === null || account === void 0 ? void 0 : account.name) || user.displayName,
        iconImage: claims["iconImage"] || (account === null || account === void 0 ? void 0 : account.iconImage) || defaultIconImage,
        heroImage: claims["heroImage"] || (account === null || account === void 0 ? void 0 : account.heroImage) || defaultHeroImage,
        tagline: claims["tagline"] || (account === null || account === void 0 ? void 0 : account.tagline) || defaultTagline,
        type: claims["type"] || (account === null || account === void 0 ? void 0 : account.type) || "",
        createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date(),
        lastLoginAt: user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date(),
        phoneNumber: user.phoneNumber || (account === null || account === void 0 || (_account$contactInfor = account.contactInformation) === null || _account$contactInfor === void 0 || (_account$contactInfor = _account$contactInfor.phoneNumbers) === null || _account$contactInfor === void 0 || (_account$contactInfor = _account$contactInfor[0]) === null || _account$contactInfor === void 0 ? void 0 : _account$contactInfor.number) || null,
        providerData: user.providerData,
        settings: claims["settings"] || (account === null || account === void 0 ? void 0 : account.settings) || defaultSettings
      };
    }));
  }
}
_AuthEffects = AuthEffects;
_AuthEffects.ɵfac = function AuthEffects_Factory(t) {
  return new (t || _AuthEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_9__.Actions), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_core_services_error_handler_service__WEBPACK_IMPORTED_MODULE_7__.ErrorHandlerService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_core_services_success_handler_service__WEBPACK_IMPORTED_MODULE_8__.SuccessHandlerService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_21__.AlertController), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_21__.LoadingController), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_22__.Store));
};
_AuthEffects.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdefineInjectable"]({
  token: _AuthEffects,
  factory: _AuthEffects.ɵfac
});

/***/ }),

/***/ 1497:
/*!***************************************************!*\
  !*** ./src/app/state/reducers/account.reducer.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   accountAdapter: () => (/* binding */ accountAdapter),
/* harmony export */   accountReducer: () => (/* binding */ accountReducer),
/* harmony export */   initialState: () => (/* binding */ initialState)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngrx_entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/entity */ 4156);
/* harmony import */ var _actions_account_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/account.actions */ 8314);
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
// src/app/state/reducers/account.reducer.ts



const accountAdapter = (0,_ngrx_entity__WEBPACK_IMPORTED_MODULE_1__.createEntityAdapter)({
  selectId: account => account.id
});
const initialState = accountAdapter.getInitialState({
  relatedAccounts: {},
  relatedListings: {},
  selectedAccountId: null,
  loading: false,
  error: null,
  // Timestamps for cache invalidation
  accountsLastUpdated: null,
  relatedAccountsLastUpdated: {},
  relatedListingsLastUpdated: {}
});
const accountReducer = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.createReducer)(initialState,
// Clear Account State
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.clearAccountsState, () => ({
  ...initialState
})),
// Load Accounts
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccounts, state => ({
  ...state,
  loading: true,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountsSuccess, (state, {
  accounts
}) => accountAdapter.setAll(accounts, {
  ...state,
  loading: false,
  accountsLastUpdated: Date.now()
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountsFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Load Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccount, state => ({
  ...state,
  loading: true,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountSuccess, (state, {
  account
}) => accountAdapter.upsertOne(account, {
  ...state,
  selectedAccountId: account.id,
  loading: false,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadAccountFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Create Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createAccountSuccess, (state, {
  account
}) => accountAdapter.addOne(account, state)),
// Update Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateAccountSuccess, (state, {
  account
}) => accountAdapter.updateOne({
  id: account.id,
  changes: account
}, state)),
// Delete Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteAccountSuccess, (state, {
  accountId
}) => {
  const newState = accountAdapter.removeOne(accountId, state);
  const {
    [accountId]: _ra,
    ...relatedAccounts
  } = newState.relatedAccounts;
  const {
    [accountId]: _rl,
    ...relatedListings
  } = newState.relatedListings;
  return {
    ...newState,
    relatedAccounts,
    relatedListings
  };
}),
// Set Selected Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.setSelectedAccount, (state, {
  accountId
}) => ({
  ...state,
  selectedAccountId: accountId
})),
// Load Related Accounts
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccounts, state => ({
  ...state,
  loading: true
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccountsSuccess, (state, {
  accountId,
  relatedAccounts
}) => ({
  ...state,
  relatedAccounts: {
    ...state.relatedAccounts,
    [accountId]: relatedAccounts
  },
  relatedAccountsLastUpdated: {
    ...state.relatedAccountsLastUpdated,
    [accountId]: Date.now()
  },
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedAccountsFailure, (state, {
  error
}) => ({
  ...state,
  error,
  loading: false
})),
// Create Related Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.createRelatedAccountSuccess, (state, {
  accountId,
  relatedAccount
}) => ({
  ...state,
  relatedAccounts: {
    ...state.relatedAccounts,
    [accountId]: [...(state.relatedAccounts[accountId] || []), relatedAccount]
  }
})),
// Update Related Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccountSuccess, (state, {
  accountId,
  relatedAccount
}) => ({
  ...state,
  relatedAccounts: {
    ...state.relatedAccounts,
    [accountId]: state.relatedAccounts[accountId].map(ra => ra.id === relatedAccount.id ? relatedAccount : ra)
  }
})),
// Delete Related Account
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.deleteRelatedAccountSuccess, (state, {
  accountId,
  relatedAccountId
}) => ({
  ...state,
  relatedAccounts: {
    ...state.relatedAccounts,
    [accountId]: state.relatedAccounts[accountId].filter(ra => ra.id !== relatedAccountId)
  }
})),
// Load Related Listings
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListings, state => ({
  ...state,
  loading: true
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListingsSuccess, (state, {
  accountId,
  relatedListings
}) => ({
  ...state,
  relatedListings: {
    ...state.relatedListings,
    [accountId]: relatedListings
  },
  relatedListingsLastUpdated: {
    ...state.relatedListingsLastUpdated,
    [accountId]: Date.now()
  },
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_account_actions__WEBPACK_IMPORTED_MODULE_0__.loadRelatedListingsFailure, (state, {
  error
}) => ({
  ...state,
  error,
  loading: false
})));

/***/ }),

/***/ 7782:
/*!************************************************!*\
  !*** ./src/app/state/reducers/auth.reducer.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   authReducer: () => (/* binding */ authReducer),
/* harmony export */   initialState: () => (/* binding */ initialState)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/auth.actions */ 2345);
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
// src/app/state/reducers/auth.reducer.ts


const initialState = {
  user: null,
  error: null,
  loading: false
};
const authReducer = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createReducer)(initialState,
// Start Loading Actions
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signUp, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signIn, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signInWithGoogle, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signOut, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendPasswordResetEmail, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendSignInLinkToEmail, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.confirmSignInWithEmailLink, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.processSignInLink, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.initializeAuth, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.updateAuthUser, state => ({
  ...state,
  loading: true,
  error: null
})),
// Success Actions
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signUpSuccess, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signInWithGoogleSuccess, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.confirmSignInWithEmailLinkSuccess, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.processSignInLinkSuccess, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.updateAuthUserSuccess, (state, {
  user
}) => ({
  ...state,
  user,
  loading: false,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signInSuccess, state => ({
  ...state,
  error: null,
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signOutSuccess, () => ({
  ...initialState
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendPasswordResetEmailSuccess, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendSignInLinkToEmailSuccess, state => ({
  ...state,
  loading: false,
  error: null
})),
// Failure Actions
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signUpFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signInFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signInWithGoogleFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.signOutFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendPasswordResetEmailFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.sendSignInLinkToEmailFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.confirmSignInWithEmailLinkFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.processSignInLinkFailure, _actions_auth_actions__WEBPACK_IMPORTED_MODULE_0__.updateAuthUserFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})));

/***/ }),

/***/ 1036:
/*!*****************************************!*\
  !*** ./src/app/state/reducers/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reducers: () => (/* binding */ reducers)
/* harmony export */ });
/* harmony import */ var _auth_reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth.reducer */ 7782);
/* harmony import */ var _account_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./account.reducer */ 1497);
/* harmony import */ var _listings_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./listings.reducer */ 3133);
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
// src/app/state/reducers/index.ts



const reducers = {
  auth: _auth_reducer__WEBPACK_IMPORTED_MODULE_0__.authReducer,
  accounts: _account_reducer__WEBPACK_IMPORTED_MODULE_1__.accountReducer,
  listings: _listings_reducer__WEBPACK_IMPORTED_MODULE_2__.listingsReducer
  // Other reducers...
};

/***/ }),

/***/ 3133:
/*!****************************************************!*\
  !*** ./src/app/state/reducers/listings.reducer.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listingsAdapter: () => (/* binding */ listingsAdapter),
/* harmony export */   listingsReducer: () => (/* binding */ listingsReducer)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngrx_entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/entity */ 4156);
/* harmony import */ var _actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actions/listings.actions */ 7118);
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
// src/app/state/listings/listings.reducer.ts



const listingsAdapter = (0,_ngrx_entity__WEBPACK_IMPORTED_MODULE_1__.createEntityAdapter)({
  selectId: listing => listing.id
});
const initialState = listingsAdapter.getInitialState({
  relatedAccounts: {},
  selectedListingId: null,
  loading: false,
  error: null,
  filterType: "all",
  searchQuery: "",
  // Timestamps for cache invalidation
  listingsLastUpdated: null,
  relatedAccountsLastUpdated: {}
});
const listingsReducer = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.createReducer)(initialState,
// Clear Account State
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.clearListingsState, () => ({
  ...initialState
})),
// Load Listings
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListings, state => ({
  ...state,
  loading: true,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingsSuccess, (state, {
  listings
}) => listingsAdapter.setAll(listings, {
  ...state,
  listingsLastUpdated: Date.now(),
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingsFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Load Listing by ID
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingByIdSuccess, (state, {
  listing
}) => listing ? listingsAdapter.upsertOne(listing, {
  ...state,
  selectedListingId: listing.id,
  loading: false
}) : {
  ...state,
  selectedListingId: null,
  loading: false
}), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingByIdFailure, (state, {
  error
}) => ({
  ...state,
  error,
  loading: false
})),
// Create Listing
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.createListingSuccess, (state, {
  listing
}) => listingsAdapter.addOne(listing, {
  ...state,
  selectedListingId: listing.id,
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.createListingFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Update Listing
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.updateListingSuccess, (state, {
  listing
}) => listingsAdapter.updateOne({
  id: listing.id,
  changes: listing
}, {
  ...state,
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.updateListingFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Delete Listing
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.deleteListingSuccess, (state, {
  id
}) => {
  const newState = listingsAdapter.removeOne(id, state);
  const selectedListingId = newState.selectedListingId === id ? null : newState.selectedListingId;
  return {
    ...newState,
    selectedListingId
  };
}),
// Delete Listing Failure
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.deleteListingFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})),
// Filtering Listings
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.filterListings, (state, {
  listingType
}) => ({
  ...state,
  filterType: listingType
})),
// Searching Listings
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.searchListings, (state, {
  query
}) => ({
  ...state,
  searchQuery: query
})),
// Submit Application
(0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.submitApplication, state => ({
  ...state,
  loading: true,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.submitApplicationSuccess, state => ({
  ...state,
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.submitApplicationFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingRelatedAccounts, state => ({
  ...state,
  loading: true,
  error: null
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingRelatedAccountsSuccess, (state, {
  listingId,
  relatedAccounts
}) => ({
  ...state,
  relatedAccounts: {
    ...state.relatedAccounts,
    [listingId]: relatedAccounts
  },
  loading: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingRelatedAccountsFailure, (state, {
  error
}) => ({
  ...state,
  loading: false,
  error
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccountSuccess, (state, {
  listingId,
  relatedAccount
}) => {
  var _state$relatedAccount;
  const updatedRelatedAccounts = ((_state$relatedAccount = state.relatedAccounts[listingId]) === null || _state$relatedAccount === void 0 ? void 0 : _state$relatedAccount.map(account => account.id === relatedAccount.id ? relatedAccount : account)) || [];
  return {
    ...state,
    relatedAccounts: {
      ...state.relatedAccounts,
      [listingId]: updatedRelatedAccounts
    }
  };
}), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_2__.on)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.updateRelatedAccountFailure, (state, {
  error
}) => {
  console.error("Failed to update related account:", error);
  return state;
}));

/***/ }),

/***/ 8686:
/*!******************************************************!*\
  !*** ./src/app/state/selectors/account.selectors.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectAccountById: () => (/* binding */ selectAccountById),
/* harmony export */   selectAccountEntities: () => (/* binding */ selectAccountEntities),
/* harmony export */   selectAccountError: () => (/* binding */ selectAccountError),
/* harmony export */   selectAccountLoading: () => (/* binding */ selectAccountLoading),
/* harmony export */   selectAccountState: () => (/* binding */ selectAccountState),
/* harmony export */   selectAccountsLastUpdated: () => (/* binding */ selectAccountsLastUpdated),
/* harmony export */   selectAllAccounts: () => (/* binding */ selectAllAccounts),
/* harmony export */   selectAreAccountsFresh: () => (/* binding */ selectAreAccountsFresh),
/* harmony export */   selectAreRelatedAccountsFresh: () => (/* binding */ selectAreRelatedAccountsFresh),
/* harmony export */   selectAreRelatedListingsFresh: () => (/* binding */ selectAreRelatedListingsFresh),
/* harmony export */   selectFilteredAccounts: () => (/* binding */ selectFilteredAccounts),
/* harmony export */   selectRelatedAccountsByAccountId: () => (/* binding */ selectRelatedAccountsByAccountId),
/* harmony export */   selectRelatedAccountsLastUpdated: () => (/* binding */ selectRelatedAccountsLastUpdated),
/* harmony export */   selectRelatedListingsByAccountId: () => (/* binding */ selectRelatedListingsByAccountId),
/* harmony export */   selectRelatedListingsLastUpdated: () => (/* binding */ selectRelatedListingsLastUpdated),
/* harmony export */   selectSelectedAccount: () => (/* binding */ selectSelectedAccount),
/* harmony export */   selectSelectedAccountId: () => (/* binding */ selectSelectedAccountId)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _reducers_account_reducer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reducers/account.reducer */ 1497);
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
// src/app/state/selectors/account.selectors.ts


// TTL Configuration
const ACCOUNTS_TTL = 5 * 60 * 1000; // 5 minutes
const RELATED_LISTINGS_TTL = 10 * 60 * 1000; // 10 minutes
// Utility: Check if data is stale
function isStale(lastUpdated, ttl) {
  if (!lastUpdated) return true; // If never updated, consider it stale
  const now = Date.now();
  return now - lastUpdated > ttl;
}
// Feature Selector
const selectAccountState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createFeatureSelector)("accounts");
// Entity Selectors
const {
  selectAll: selectAllAccountsArray,
  selectEntities: selectAccountEntityMap
} = _reducers_account_reducer__WEBPACK_IMPORTED_MODULE_0__.accountAdapter.getSelectors();
const selectAccountEntities = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, selectAccountEntityMap);
const selectAllAccounts = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, selectAllAccountsArray);
const selectAccountById = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountEntities, entities => entities[accountId]);
// Selected Account Selectors
const selectSelectedAccountId = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.selectedAccountId);
const selectSelectedAccount = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountEntities, selectSelectedAccountId, (entities, selectedAccountId) => selectedAccountId ? entities[selectedAccountId] : null);
// Related Data Selectors
const selectRelatedAccountsByAccountId = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.relatedAccounts[accountId] || []);
const selectRelatedListingsByAccountId = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.relatedListings[accountId] || []);
// Loading and Error Selectors
const selectAccountLoading = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.loading);
const selectAccountError = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.error);
// Filtered Accounts Selector
const selectFilteredAccounts = (searchTerm, accountType) => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAllAccounts, accounts => {
  const normalizeString = str => str.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/gi, "");
  const normalizedSearchTerm = normalizeString(searchTerm);
  return accounts.filter(acc => {
    if (acc.type !== accountType || !acc.name) {
      return false;
    }
    const normalizedAccountName = normalizeString(acc.name);
    return normalizedAccountName.includes(normalizedSearchTerm);
  }).sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
});
// Cache and Freshness Selectors
const selectAccountsLastUpdated = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.accountsLastUpdated);
const selectRelatedAccountsLastUpdated = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.relatedAccountsLastUpdated[accountId] || null);
const selectRelatedListingsLastUpdated = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountState, state => state.relatedListingsLastUpdated[accountId] || null);
const selectAreAccountsFresh = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectAccountsLastUpdated, accountsLastUpdated => !isStale(accountsLastUpdated, ACCOUNTS_TTL));
const selectAreRelatedAccountsFresh = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectRelatedAccountsLastUpdated(accountId), relatedAccountsLastUpdated => !isStale(relatedAccountsLastUpdated, ACCOUNTS_TTL));
const selectAreRelatedListingsFresh = accountId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectRelatedListingsLastUpdated(accountId), relatedListingsLastUpdated => !isStale(relatedListingsLastUpdated, RELATED_LISTINGS_TTL));

/***/ }),

/***/ 9559:
/*!***************************************************!*\
  !*** ./src/app/state/selectors/auth.selectors.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectAuthError: () => (/* binding */ selectAuthError),
/* harmony export */   selectAuthLoading: () => (/* binding */ selectAuthLoading),
/* harmony export */   selectAuthState: () => (/* binding */ selectAuthState),
/* harmony export */   selectAuthUser: () => (/* binding */ selectAuthUser),
/* harmony export */   selectIsLoggedIn: () => (/* binding */ selectIsLoggedIn)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 5480);
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
// src/app/core/store/auth/auth.selectors.ts

const selectAuthState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createFeatureSelector)("auth");
const selectAuthUser = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectAuthState, state => state.user);
const selectIsLoggedIn = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectAuthUser, user => !!user);
const selectAuthLoading = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectAuthState, state => state.loading);
const selectAuthError = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectAuthState, state => state.error);

/***/ }),

/***/ 5312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
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
const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyATq5A6OaHtXtDSRoC1DZ8T_xegCZiUocU",
    authDomain: "ascendcoopplatform-dev.firebaseapp.com",
    databaseURL: "https://ascendcoopplatform-dev-default-rtdb.firebaseio.com",
    projectId: "ascendcoopplatform-dev",
    storageBucket: "ascendcoopplatform-dev.appspot.com",
    messagingSenderId: "360409127691",
    appId: "1:360409127691:web:b1c488ce58f4e9330ca00e",
    measurementId: "G-9EKFS37KV8",
    apiUrl: "https://us-central1-ascendcoopplatform-dev.cloudfunctions.net"
  }
};

/***/ }),

/***/ 4429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 4199);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 635);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 5312);

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



if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ }),

/***/ 8996:
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/ lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
  \******************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./ion-accordion_2.entry.js": [
		163,
		"common",
		"node_modules_ionic_core_dist_esm_ion-accordion_2_entry_js"
	],
	"./ion-action-sheet.entry.js": [
		7026,
		"common",
		"node_modules_ionic_core_dist_esm_ion-action-sheet_entry_js"
	],
	"./ion-alert.entry.js": [
		7394,
		"common",
		"node_modules_ionic_core_dist_esm_ion-alert_entry_js"
	],
	"./ion-app_8.entry.js": [
		5732,
		"common",
		"node_modules_ionic_core_dist_esm_ion-app_8_entry_js"
	],
	"./ion-avatar_3.entry.js": [
		7594,
		"node_modules_ionic_core_dist_esm_ion-avatar_3_entry_js"
	],
	"./ion-back-button.entry.js": [
		7966,
		"common",
		"node_modules_ionic_core_dist_esm_ion-back-button_entry_js"
	],
	"./ion-backdrop.entry.js": [
		660,
		"node_modules_ionic_core_dist_esm_ion-backdrop_entry_js"
	],
	"./ion-breadcrumb_2.entry.js": [
		3102,
		"common",
		"node_modules_ionic_core_dist_esm_ion-breadcrumb_2_entry_js"
	],
	"./ion-button_2.entry.js": [
		6651,
		"node_modules_ionic_core_dist_esm_ion-button_2_entry_js"
	],
	"./ion-card_5.entry.js": [
		6236,
		"node_modules_ionic_core_dist_esm_ion-card_5_entry_js"
	],
	"./ion-checkbox.entry.js": [
		1347,
		"node_modules_ionic_core_dist_esm_ion-checkbox_entry_js"
	],
	"./ion-chip.entry.js": [
		3988,
		"node_modules_ionic_core_dist_esm_ion-chip_entry_js"
	],
	"./ion-col_3.entry.js": [
		2936,
		"node_modules_ionic_core_dist_esm_ion-col_3_entry_js"
	],
	"./ion-datetime-button.entry.js": [
		584,
		"default-node_modules_ionic_core_dist_esm_data-ae11fd43_js",
		"node_modules_ionic_core_dist_esm_ion-datetime-button_entry_js"
	],
	"./ion-datetime_3.entry.js": [
		1065,
		"default-node_modules_ionic_core_dist_esm_data-ae11fd43_js",
		"common",
		"node_modules_ionic_core_dist_esm_ion-datetime_3_entry_js"
	],
	"./ion-fab_3.entry.js": [
		2000,
		"common",
		"node_modules_ionic_core_dist_esm_ion-fab_3_entry_js"
	],
	"./ion-img.entry.js": [
		2939,
		"node_modules_ionic_core_dist_esm_ion-img_entry_js"
	],
	"./ion-infinite-scroll_2.entry.js": [
		4367,
		"common",
		"node_modules_ionic_core_dist_esm_ion-infinite-scroll_2_entry_js"
	],
	"./ion-input-password-toggle.entry.js": [
		7949,
		"common",
		"node_modules_ionic_core_dist_esm_ion-input-password-toggle_entry_js"
	],
	"./ion-input.entry.js": [
		4924,
		"default-node_modules_ionic_core_dist_esm_input_utils-09c71bc7_js-node_modules_ionic_core_dist-8b8a84",
		"common",
		"node_modules_ionic_core_dist_esm_ion-input_entry_js"
	],
	"./ion-item-option_3.entry.js": [
		7625,
		"common",
		"node_modules_ionic_core_dist_esm_ion-item-option_3_entry_js"
	],
	"./ion-item_8.entry.js": [
		8958,
		"common",
		"node_modules_ionic_core_dist_esm_ion-item_8_entry_js"
	],
	"./ion-loading.entry.js": [
		1320,
		"common",
		"node_modules_ionic_core_dist_esm_ion-loading_entry_js"
	],
	"./ion-menu_3.entry.js": [
		6239,
		"common",
		"node_modules_ionic_core_dist_esm_ion-menu_3_entry_js"
	],
	"./ion-modal.entry.js": [
		3421,
		"common",
		"node_modules_ionic_core_dist_esm_ion-modal_entry_js"
	],
	"./ion-nav_2.entry.js": [
		5372,
		"node_modules_ionic_core_dist_esm_ion-nav_2_entry_js"
	],
	"./ion-picker-column-option.entry.js": [
		5441,
		"node_modules_ionic_core_dist_esm_ion-picker-column-option_entry_js"
	],
	"./ion-picker-column.entry.js": [
		7631,
		"common",
		"node_modules_ionic_core_dist_esm_ion-picker-column_entry_js"
	],
	"./ion-picker.entry.js": [
		8716,
		"node_modules_ionic_core_dist_esm_ion-picker_entry_js"
	],
	"./ion-popover.entry.js": [
		4197,
		"common",
		"node_modules_ionic_core_dist_esm_ion-popover_entry_js"
	],
	"./ion-progress-bar.entry.js": [
		9333,
		"node_modules_ionic_core_dist_esm_ion-progress-bar_entry_js"
	],
	"./ion-radio_2.entry.js": [
		8030,
		"common",
		"node_modules_ionic_core_dist_esm_ion-radio_2_entry_js"
	],
	"./ion-range.entry.js": [
		2665,
		"common",
		"node_modules_ionic_core_dist_esm_ion-range_entry_js"
	],
	"./ion-refresher_2.entry.js": [
		7641,
		"common",
		"node_modules_ionic_core_dist_esm_ion-refresher_2_entry_js"
	],
	"./ion-reorder_2.entry.js": [
		6786,
		"common",
		"node_modules_ionic_core_dist_esm_ion-reorder_2_entry_js"
	],
	"./ion-ripple-effect.entry.js": [
		5256,
		"node_modules_ionic_core_dist_esm_ion-ripple-effect_entry_js"
	],
	"./ion-route_4.entry.js": [
		9886,
		"node_modules_ionic_core_dist_esm_ion-route_4_entry_js"
	],
	"./ion-searchbar.entry.js": [
		8653,
		"common",
		"node_modules_ionic_core_dist_esm_ion-searchbar_entry_js"
	],
	"./ion-segment-content.entry.js": [
		2365,
		"node_modules_ionic_core_dist_esm_ion-segment-content_entry_js"
	],
	"./ion-segment-view.entry.js": [
		879,
		"node_modules_ionic_core_dist_esm_ion-segment-view_entry_js"
	],
	"./ion-segment_2.entry.js": [
		2492,
		"common",
		"node_modules_ionic_core_dist_esm_ion-segment_2_entry_js"
	],
	"./ion-select-modal.entry.js": [
		4838,
		"node_modules_ionic_core_dist_esm_ion-select-modal_entry_js"
	],
	"./ion-select_3.entry.js": [
		2904,
		"common",
		"node_modules_ionic_core_dist_esm_ion-select_3_entry_js"
	],
	"./ion-spinner.entry.js": [
		8369,
		"common",
		"node_modules_ionic_core_dist_esm_ion-spinner_entry_js"
	],
	"./ion-split-pane.entry.js": [
		3283,
		"node_modules_ionic_core_dist_esm_ion-split-pane_entry_js"
	],
	"./ion-tab-bar_2.entry.js": [
		7250,
		"common",
		"node_modules_ionic_core_dist_esm_ion-tab-bar_2_entry_js"
	],
	"./ion-tab_2.entry.js": [
		3541,
		"node_modules_ionic_core_dist_esm_ion-tab_2_entry_js"
	],
	"./ion-text.entry.js": [
		5325,
		"node_modules_ionic_core_dist_esm_ion-text_entry_js"
	],
	"./ion-textarea.entry.js": [
		7448,
		"default-node_modules_ionic_core_dist_esm_input_utils-09c71bc7_js-node_modules_ionic_core_dist-8b8a84",
		"node_modules_ionic_core_dist_esm_ion-textarea_entry_js"
	],
	"./ion-toast.entry.js": [
		7355,
		"common",
		"node_modules_ionic_core_dist_esm_ion-toast_entry_js"
	],
	"./ion-toggle.entry.js": [
		4034,
		"common",
		"node_modules_ionic_core_dist_esm_ion-toggle_entry_js"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 8996;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 5235:
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/@ionic/pwa-elements/dist/esm/ lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
  \**************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./pwa-action-sheet.entry.js": [
		4209,
		"node_modules_ionic_pwa-elements_dist_esm_pwa-action-sheet_entry_js"
	],
	"./pwa-camera-modal-instance.entry.js": [
		6671,
		"node_modules_ionic_pwa-elements_dist_esm_pwa-camera-modal-instance_entry_js"
	],
	"./pwa-camera-modal.entry.js": [
		7290,
		"node_modules_ionic_pwa-elements_dist_esm_pwa-camera-modal_entry_js"
	],
	"./pwa-camera.entry.js": [
		8706,
		"node_modules_ionic_pwa-elements_dist_esm_pwa-camera_entry_js"
	],
	"./pwa-toast.entry.js": [
		8354,
		"node_modules_ionic_pwa-elements_dist_esm_pwa-toast_entry_js"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 5235;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 4140:
/*!************************************************************************************************************************************************************!*\
  !*** ./node_modules/@stencil/core/internal/client/ lazy ^\.\/.*\.entry\.js.*$ include: \.entry\.js$ exclude: \.system\.entry\.js$ strict namespace object ***!
  \************************************************************************************************************************************************************/
/***/ ((module) => {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(() => {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = () => ([]);
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 4140;
module.exports = webpackEmptyAsyncContext;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map