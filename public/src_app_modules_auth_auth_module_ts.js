"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_modules_auth_auth_module_ts"],{

/***/ 389:
/*!*********************************************************!*\
  !*** ./src/app/core/guards/secure-inner-pages.guard.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SecureInnerPagesGuard: () => (/* binding */ SecureInnerPagesGuard)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 5167);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 3478);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 1099);

var _SecureInnerPagesGuard;






class SecureInnerPagesGuard {
  constructor(store, navCtrl, router) {
    this.store = store;
    this.navCtrl = navCtrl;
    this.router = router;
  }
  canActivate() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const isLoggedIn = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectIsLoggedIn));
      if (isLoggedIn) {
        var _this$router$getCurre;
        const authUser = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser));
        if ((_this$router$getCurre = _this.router.getCurrentNavigation()) !== null && _this$router$getCurre !== void 0 && _this$router$getCurre.previousNavigation) {
          _this.navCtrl.back();
        } else {
          _this.navCtrl.navigateForward(`/account/${authUser === null || authUser === void 0 ? void 0 : authUser.uid}`);
        }
        return false;
      }
      return true;
    })();
  }
}
_SecureInnerPagesGuard = SecureInnerPagesGuard;
_SecureInnerPagesGuard.ɵfac = function SecureInnerPagesGuard_Factory(t) {
  return new (t || _SecureInnerPagesGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_4__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.NavController), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router));
};
_SecureInnerPagesGuard.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
  token: _SecureInnerPagesGuard,
  factory: _SecureInnerPagesGuard.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 9902:
/*!*****************************************************!*\
  !*** ./src/app/modules/auth/auth-routing.module.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthRoutingModule: () => (/* binding */ AuthRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _pages_login_login_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/login/login.page */ 3886);
/* harmony import */ var _pages_signup_signup_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/signup/signup.page */ 5816);
/* harmony import */ var _core_guards_secure_inner_pages_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/guards/secure-inner-pages.guard */ 389);
/* harmony import */ var _pages_landing_landing_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/landing/landing.page */ 4730);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
var _AuthRoutingModule;







const routes = [{
  path: "",
  component: _pages_landing_landing_page__WEBPACK_IMPORTED_MODULE_3__.LandingPage
}, {
  path: "login",
  component: _pages_login_login_page__WEBPACK_IMPORTED_MODULE_0__.LoginPage,
  canActivate: [_core_guards_secure_inner_pages_guard__WEBPACK_IMPORTED_MODULE_2__.SecureInnerPagesGuard]
}, {
  path: "signup",
  component: _pages_signup_signup_page__WEBPACK_IMPORTED_MODULE_1__.SignupPage,
  canActivate: [_core_guards_secure_inner_pages_guard__WEBPACK_IMPORTED_MODULE_2__.SecureInnerPagesGuard]
}];
class AuthRoutingModule {}
_AuthRoutingModule = AuthRoutingModule;
_AuthRoutingModule.ɵfac = function AuthRoutingModule_Factory(t) {
  return new (t || _AuthRoutingModule)();
};
_AuthRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({
  type: _AuthRoutingModule
});
_AuthRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AuthRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule]
  });
})();

/***/ }),

/***/ 7751:
/*!*********************************************!*\
  !*** ./src/app/modules/auth/auth.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthModule: () => (/* binding */ AuthModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _auth_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth-routing.module */ 9902);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _pages_signup_signup_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/signup/signup.page */ 5816);
/* harmony import */ var _pages_login_login_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/login/login.page */ 3886);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _state_reducers_auth_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../state/reducers/auth.reducer */ 7782);
/* harmony import */ var _state_effects_auth_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../state/effects/auth.effects */ 9351);
/* harmony import */ var _pages_landing_landing_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/landing/landing.page */ 4730);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../shared/shared.module */ 3887);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 6623);
var _AuthModule;

















class AuthModule {}
_AuthModule = AuthModule;
_AuthModule.ɵfac = function AuthModule_Factory(t) {
  return new (t || _AuthModule)();
};
_AuthModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
  type: _AuthModule
});
_AuthModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
  imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_6__.SharedModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_0__.AuthRoutingModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_13__.StoreModule.forFeature("auth", _state_reducers_auth_reducer__WEBPACK_IMPORTED_MODULE_3__.authReducer), _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__.EffectsModule.forFeature([_state_effects_auth_effects__WEBPACK_IMPORTED_MODULE_4__.AuthEffects])]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](AuthModule, {
    declarations: [_pages_login_login_page__WEBPACK_IMPORTED_MODULE_2__.LoginPage, _pages_signup_signup_page__WEBPACK_IMPORTED_MODULE_1__.SignupPage, _pages_landing_landing_page__WEBPACK_IMPORTED_MODULE_5__.LandingPage],
    imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_6__.SharedModule, _auth_routing_module__WEBPACK_IMPORTED_MODULE_0__.AuthRoutingModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.ReactiveFormsModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_13__.StoreFeatureModule, _ngrx_effects__WEBPACK_IMPORTED_MODULE_14__.EffectsFeatureModule]
  });
})();

/***/ }),

/***/ 4730:
/*!************************************************************!*\
  !*** ./src/app/modules/auth/pages/landing/landing.page.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LandingPage: () => (/* binding */ LandingPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _shared_components_legal_modal_legal_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../shared/components/legal-modal/legal-modal.component */ 4818);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);

var _LandingPage;







function LandingPage_ion_col_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-col", 31)(1, "ion-card")(2, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-icon", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-card-content");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const feature_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("name", feature_r1.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](feature_r1.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", feature_r1.description, " ");
  }
}
function LandingPage_ion_accordion_31_li_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-badge", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", item_r2.name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("color", item_r2.statusColor);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](item_r2.status);
  }
}
function LandingPage_ion_accordion_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-accordion", 33)(1, "ion-item", 34)(2, "ion-label")(3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-badge", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "div", 36)(10, "ul");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, LandingPage_ion_accordion_31_li_11_Template, 4, 3, "li", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const phase_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpropertyInterpolate"]("value", phase_r3.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](phase_r3.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](phase_r3.subtitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("color", phase_r3.statusColor);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](phase_r3.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", phase_r3.items);
  }
}
class LandingPage {
  constructor(metaService, modalController) {
    this.metaService = metaService;
    this.modalController = modalController;
    this.currentYear = new Date().getFullYear();
    this.features = [{
      icon: "people-outline",
      title: "User Profiles",
      description: "Create personalized profiles to showcase your skills and volunteer history."
    }, {
      icon: "briefcase-outline",
      title: "Volunteer Opportunities",
      description: "Discover and apply for volunteer positions that match your interests and skills."
    }, {
      icon: "analytics-outline",
      title: "Analytics & Tracking",
      description: "Track your volunteer hours and impact with our analytics tools."
    }
    // Add more features as needed
    ];
    this.roadmap = [{
      id: "phase1",
      title: "Phase 1: Platform Development",
      subtitle: "User Sign-Up, Profiles, Volunteer Listings",
      status: "Active",
      statusColor: "success",
      items: [{
        name: "User Sign-Up and Authentication",
        status: "Finished",
        statusColor: "success"
      }, {
        name: "User Profile Pages",
        status: "Finished",
        statusColor: "success"
      }, {
        name: "Nonprofit Profile Pages",
        status: "Finished",
        statusColor: "success"
      }, {
        name: "Volunteer Position Listings",
        status: "New",
        statusColor: "primary"
      }
      // Add more items as needed
      ]
    }
    // Add more phases as needed
    ];
    this.testimonials = [{
      message: "This platform has connected me with amazing opportunities!",
      author: "Jane Doe"
    }
    // Add more testimonials as needed
    ];
    this.testimonialOptions = {
      autoplay: {
        delay: 5000
      },
      loop: true
    };
  }
  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags("ASCENDynamics NFP | Volunteer Opportunities", "Join ASCENDynamics NFP to connect with nonprofits, find volunteer opportunities, and make an impact in your community.", "volunteer, nonprofits, community, opportunities", {
      title: "ASCENDynamics NFP | Volunteer Opportunities",
      description: "Find local nonprofits and volunteer opportunities with ASCENDynamics NFP.",
      url: "https://app.ASCENDynamics.org/",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary_large_image",
      title: "ASCENDynamics NFP | Volunteer Opportunities",
      description: "Explore meaningful ways to contribute to your community with ASCENDynamics NFP.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  // Open the legal modal (Privacy Policy or Terms of Use)
  openLegalModal(contentType) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const modal = yield _this.modalController.create({
        component: _shared_components_legal_modal_legal_modal_component__WEBPACK_IMPORTED_MODULE_1__.LegalModalComponent,
        componentProps: {
          content: contentType
        }
      });
      yield modal.present();
    })();
  }
}
_LandingPage = LandingPage;
_LandingPage.ɵfac = function LandingPage_Factory(t) {
  return new (t || _LandingPage)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_2__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.ModalController));
};
_LandingPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _LandingPage,
  selectors: [["app-landing"]],
  decls: 78,
  vars: 6,
  consts: [[3, "showLogo"], ["fullscreen", ""], [1, "hero"], [1, "ion-align-items-center"], ["size", "12", "size-md", "6", 1, "hero-text"], [2, "color", "#808080"], ["routerLink", "/auth/signup", "color", "primary"], ["size", "12", "size-md", "6", 1, "hero-image"], ["autoplay", "true", 3, "slidesPerView", "loop"], ["src", "assets/image/logo/ASCENDynamics NFP-logos_transparent.png", "alt", "ASCENDynamics Logo"], ["src", "assets/image/Humans_and_Technology.png", "alt", "Humans and Technology"], [1, "features"], ["size", "12", "size-md", "4", 4, "ngFor", "ngForOf"], [1, "roadmap"], [3, "value", 4, "ngFor", "ngForOf"], [1, "cta"], [1, "footer"], ["size", "12", "size-md", "4", 1, "footer-logo"], ["size", "12", "size-md", "4", 1, "footer-nav"], ["href", "https://ascendynamics.org/page/about-us", "target", "_blank"], ["href", "https://ascendynamics.org/page/contact-us", "target", "_blank"], [3, "click"], ["size", "12", "size-md", "4", 1, "footer-social"], [1, "social-buttons"], ["href", "https://github.com/ASCENDynamics-NFP", "target", "_blank"], ["slot", "icon-only", "name", "logo-github"], ["href", "https://www.facebook.com/ASCENDynamicsNFP", "target", "_blank"], ["slot", "icon-only", "name", "logo-facebook"], ["href", "https://www.linkedin.com/company/ascendynamics-nfp", "target", "_blank"], ["slot", "icon-only", "name", "logo-linkedin"], [1, "footer-bottom"], ["size", "12", "size-md", "4"], ["size", "large", 3, "name"], [3, "value"], ["slot", "header"], ["slot", "end", 3, "color"], ["slot", "content", 1, "ion-padding"], [4, "ngFor", "ngForOf"], [3, "color"]],
  template: function LandingPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-content", 1)(3, "section", 2)(4, "ion-grid")(5, "ion-row", 3)(6, "ion-col", 4)(7, "h1")(8, "span", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Empowering");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, " Worker-Owned Cooperatives to Succeed ");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, " Join us in transforming the future of work. Connect with nonprofits, volunteer, and make an impact. ");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "ion-button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Try Now");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "ion-col", 7)(16, "swiper-container", 8)(17, "swiper-slide");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](18, "img", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "swiper-slide");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](20, "img", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "section", 11)(22, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23, "ASCENDynamics NFP Cooperative Platform Features");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "ion-grid")(25, "ion-row");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, LandingPage_ion_col_26_Template, 8, 3, "ion-col", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "section", 13)(28, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](29, "Platform Development Roadmap");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](30, "ion-accordion-group");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](31, LandingPage_ion_accordion_31_Template, 12, 6, "ion-accordion", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "section", 15)(33, "ion-card")(34, "ion-card-content")(35, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36, "Ready to Make a Difference?");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](37, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](38, "Join our community of volunteers and nonprofits today.");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](39, "ion-button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](40, "Sign Up Now");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](41, "ion-footer")(42, "div", 16)(43, "ion-grid")(44, "ion-row")(45, "ion-col", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](46, "img", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](47, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](48, " Connecting volunteers with nonprofits to create meaningful change. ");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](49, "ion-col", 18)(50, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](51, "Quick Links");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](52, "ul")(53, "li")(54, "a", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](55, "About Us");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](56, "li")(57, "a", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](58, "Contact");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](59, "li")(60, "a", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LandingPage_Template_a_click_60_listener() {
        return ctx.openLegalModal("privacyPolicy");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](61, "Privacy Policy");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](62, "li")(63, "a", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function LandingPage_Template_a_click_63_listener() {
        return ctx.openLegalModal("termsOfUse");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](64, "Terms of Service");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](65, "ion-col", 22)(66, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](67, "Follow Us");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](68, "ion-buttons", 23)(69, "ion-button", 24);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](70, "ion-icon", 25);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](71, "ion-button", 26);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](72, "ion-icon", 27);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](73, "ion-button", 28);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](74, "ion-icon", 29);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](75, "div", 30)(76, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](77);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("showLogo", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("slidesPerView", 1)("loop", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.features);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.roadmap);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](46);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("\u00A9 ", ctx.currentYear, " ASCENDynamics NFP. All rights reserved.");
    }
  },
  dependencies: [_shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__.AppHeaderComponent, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonAccordion, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonAccordionGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonBadge, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonFooter, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.RouterLinkDelegate],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.hero[_ngcontent-%COMP%] {\n  background: var(--ion-background-color);\n  color: var(--ion-text-color);\n  padding: 60px 0;\n}\n.hero[_ngcontent-%COMP%]   .hero-text[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.hero[_ngcontent-%COMP%]   .hero-text[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 600;\n  margin-bottom: 1rem;\n}\n.hero[_ngcontent-%COMP%]   .hero-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 20px;\n}\n.hero[_ngcontent-%COMP%]   .hero-text[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --background: var(--ion-color-primary);\n  --border-radius: 20px;\n  margin-right: 10px;\n}\n.hero[_ngcontent-%COMP%]   .hero-image[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.hero[_ngcontent-%COMP%]   .hero-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 100%;\n  border-radius: 10px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n\n\n\n.features[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  background-color: var(--ion-background-color);\n  text-align: center;\n}\n.features[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-bottom: 50px;\n  padding: 0 2rem;\n  font-size: 2.5rem;\n  color: var(--ion-text-color);\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%] {\n  --ion-card-background: var(--ion-item-background);\n  border: none;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);\n  transition: transform 0.3s;\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-10px);\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n  margin-bottom: 15px;\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: var(--ion-text-color);\n}\n.features[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: var(--ion-text-color);\n  line-height: 1.6;\n}\n\n\n\n.roadmap[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  background-color: var(--ion-background-color);\n}\n.roadmap[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 50px;\n  font-size: 2.5rem;\n  color: var(--ion-text-color);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion-group[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 0 auto;\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  border: 1px solid var(--ion-border-color);\n  border-radius: 10px;\n  overflow: hidden;\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%] {\n  --background: var(--ion-item-background);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.3rem;\n  color: var(--ion-text-color);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: var(--ion-text-color);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ion-badge[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   .ion-padding[_ngcontent-%COMP%] {\n  background-color: var(--ion-content-background);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  padding-left: 20px;\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  font-size: 1rem;\n  color: var(--ion-text-color);\n}\n.roadmap[_ngcontent-%COMP%]   ion-accordion[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   ion-badge[_ngcontent-%COMP%] {\n  margin-left: 10px;\n}\n\n\n\n.testimonials[_ngcontent-%COMP%] {\n  background-color: var(--ion-background-color);\n  color: var(--ion-text-color);\n  padding: 80px 0;\n  text-align: center;\n}\n.testimonials[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-bottom: 50px;\n  font-size: 2.5rem;\n}\n.testimonials[_ngcontent-%COMP%]   ion-slides[_ngcontent-%COMP%] {\n  height: auto;\n}\n.testimonials[_ngcontent-%COMP%]   ion-slides[_ngcontent-%COMP%]   ion-slide[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n}\n.testimonials[_ngcontent-%COMP%]   ion-slides[_ngcontent-%COMP%]   ion-slide[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%] {\n  max-width: 600px;\n  background-color: var(--ion-item-background);\n  box-shadow: none;\n}\n.testimonials[_ngcontent-%COMP%]   ion-slides[_ngcontent-%COMP%]   ion-slide[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  font-style: italic;\n  line-height: 1.6;\n}\n.testimonials[_ngcontent-%COMP%]   ion-slides[_ngcontent-%COMP%]   ion-slide[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  font-weight: normal;\n  font-size: 1rem;\n}\n\n\n\n.cta[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  text-align: center;\n  background-color: var(--ion-background-color);\n  color: var(--ion-text-color);\n}\n.cta[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%] {\n  --ion-card-background: var(--ion-item-background);\n  box-shadow: none;\n}\n.cta[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  font-size: 2.5rem;\n}\n.cta[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 30px;\n}\n.cta[_ngcontent-%COMP%]   ion-card[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --background: var(--ion-color-primary);\n  --color: var(--ion-color-contrast);\n  --border-radius: 20px;\n  margin-top: 10px;\n}\n\n\n\n.footer[_ngcontent-%COMP%] {\n  background-color: var(--ion-background-color);\n  color: var(--ion-text-color);\n  padding: 40px 0;\n  border-top: 1px solid var(--ion-border-color);\n}\n.footer[_ngcontent-%COMP%]   ion-grid[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.footer[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.footer[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: 150px;\n  margin-bottom: 20px;\n}\n.footer[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  line-height: 1.5;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  font-size: 1.2rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n  text-decoration: none;\n  font-size: 1rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n.footer[_ngcontent-%COMP%]   .footer-social[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.footer[_ngcontent-%COMP%]   .footer-social[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  font-size: 1.2rem;\n}\n.footer[_ngcontent-%COMP%]   .footer-social[_ngcontent-%COMP%]   ion-buttons[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --background: transparent;\n  --color: var(--ion-color-primary);\n  font-size: 1.5rem;\n  margin: 0 5px;\n}\n.footer[_ngcontent-%COMP%]   .footer-social[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n.footer[_ngcontent-%COMP%]   .footer-bottom[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 20px;\n}\n.footer[_ngcontent-%COMP%]   .footer-bottom[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--ion-text-color);\n}\n\n\n\n@media (min-width: 768px) {\n  .footer-logo[_ngcontent-%COMP%], .footer-nav[_ngcontent-%COMP%], .footer-social[_ngcontent-%COMP%] {\n    text-align: left;\n  }\n  .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n    align-items: flex-start;\n  }\n}\n@media (max-width: 767px) {\n  .features[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .footer-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n    align-items: center;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hdXRoL3BhZ2VzL2xhbmRpbmcvbGFuZGluZy5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQSxzQkFBQTtBQUVBLG1CQUFBO0FBUUEsaUJBQUE7QUFDQTtFQUNFLHVDQUFBO0VBQ0EsNEJBQUE7RUFDQSxlQUFBO0FBUEY7QUFTRTtFQUNFLGtCQUFBO0FBUEo7QUFTSTtFQUNFLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQVBOO0FBVUk7RUFDRSxpQkFBQTtFQUNBLG1CQUFBO0FBUk47QUFXSTtFQUNFLHNDQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtBQVROO0FBYUU7RUFDRSxrQkFBQTtBQVhKO0FBYUk7RUFDRSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSx5Q0FBQTtBQVhOOztBQWdCQSxxQkFBQTtBQUNBO0VBQ0UsZUFBQTtFQUNBLDZDQUFBO0VBQ0Esa0JBQUE7QUFiRjtBQWVFO0VBQ0UsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSw0QkFBQTtBQWJKO0FBZ0JFO0VBQ0UsaURBQUE7RUFDQSxZQUFBO0VBQ0EseUNBQUE7RUFDQSwwQkFBQTtBQWRKO0FBZ0JJO0VBQ0UsNEJBQUE7QUFkTjtBQWlCSTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0FBZk47QUFpQk07RUFDRSwrQkFBQTtFQUNBLG1CQUFBO0FBZlI7QUFrQk07RUFDRSxpQkFBQTtFQUNBLDRCQUFBO0FBaEJSO0FBb0JJO0VBQ0UsZUFBQTtFQUNBLDRCQUFBO0VBQ0EsZ0JBQUE7QUFsQk47O0FBdUJBLG9CQUFBO0FBQ0E7RUFDRSxlQUFBO0VBQ0EsNkNBQUE7QUFwQkY7QUFzQkU7RUFDRSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSw0QkFBQTtBQXBCSjtBQXVCRTtFQUNFLGdCQUFBO0VBQ0EsY0FBQTtBQXJCSjtBQXdCRTtFQUNFLG1CQUFBO0VBQ0EseUNBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0FBdEJKO0FBd0JJO0VBQ0Usd0NBQUE7QUF0Qk47QUF5Qkk7RUFDRSxpQkFBQTtFQUNBLDRCQUFBO0FBdkJOO0FBMEJJO0VBQ0UsZUFBQTtFQUNBLDRCQUFBO0FBeEJOO0FBMkJJO0VBQ0UseUJBQUE7QUF6Qk47QUE0Qkk7RUFDRSwrQ0FBQTtBQTFCTjtBQTZCSTtFQUNFLGtCQUFBO0FBM0JOO0FBNkJNO0VBQ0UsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsNEJBQUE7QUEzQlI7QUE2QlE7RUFDRSxpQkFBQTtBQTNCVjs7QUFrQ0EseUJBQUE7QUFDQTtFQUNFLDZDQUFBO0VBQ0EsNEJBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7QUEvQkY7QUFpQ0U7RUFDRSxtQkFBQTtFQUNBLGlCQUFBO0FBL0JKO0FBa0NFO0VBQ0UsWUFBQTtBQWhDSjtBQWtDSTtFQUNFLGFBQUE7RUFDQSx1QkFBQTtBQWhDTjtBQWtDTTtFQUNFLGdCQUFBO0VBQ0EsNENBQUE7RUFDQSxnQkFBQTtBQWhDUjtBQW1DVTtFQUNFLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQWpDWjtBQW9DVTtFQUNFLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBbENaOztBQTBDQSxtQkFBQTtBQUNBO0VBQ0UsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsNkNBQUE7RUFDQSw0QkFBQTtBQXZDRjtBQXlDRTtFQUNFLGlEQUFBO0VBQ0EsZ0JBQUE7QUF2Q0o7QUF5Q0k7RUFDRSxtQkFBQTtFQUNBLGlCQUFBO0FBdkNOO0FBMENJO0VBQ0UsaUJBQUE7RUFDQSxtQkFBQTtBQXhDTjtBQTJDSTtFQUNFLHNDQUFBO0VBQ0Esa0NBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0FBekNOOztBQThDQSxrQkFBQTtBQUNBO0VBQ0UsNkNBQUE7RUFDQSw0QkFBQTtFQUNBLGVBQUE7RUFDQSw2Q0FBQTtBQTNDRjtBQTZDRTtFQUNFLGlCQUFBO0VBQ0EsY0FBQTtBQTNDSjtBQThDRTtFQUNFLGtCQUFBO0FBNUNKO0FBOENJO0VBQ0UsZ0JBQUE7RUFDQSxtQkFBQTtBQTVDTjtBQStDSTtFQUNFLGlCQUFBO0VBQ0EsZ0JBQUE7QUE3Q047QUFpREU7RUFDRSxrQkFBQTtBQS9DSjtBQWlESTtFQUNFLG1CQUFBO0VBQ0EsaUJBQUE7QUEvQ047QUFrREk7RUFDRSxnQkFBQTtFQUNBLFVBQUE7QUFoRE47QUFrRE07RUFDRSxtQkFBQTtBQWhEUjtBQWtEUTtFQUNFLCtCQUFBO0VBQ0EscUJBQUE7RUFDQSxlQUFBO0FBaERWO0FBa0RVO0VBQ0UsMEJBQUE7RUFDQSxlQUFBO0FBaERaO0FBdURFO0VBQ0Usa0JBQUE7QUFyREo7QUF1REk7RUFDRSxtQkFBQTtFQUNBLGlCQUFBO0FBckROO0FBeURNO0VBQ0UseUJBQUE7RUFDQSxpQ0FBQTtFQUNBLGlCQUFBO0VBQ0EsYUFBQTtBQXZEUjtBQTBESTtFQUNFLGFBQUE7RUFDQSx1QkFBQTtFQUNBLFdBQUE7QUF4RE47QUE0REU7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0FBMURKO0FBNERJO0VBQ0UsaUJBQUE7RUFDQSw0QkFBQTtBQTFETjs7QUErREEsc0JBQUE7QUFDQTtFQUNFOzs7SUFHRSxnQkFBQTtFQTVERjtFQStEQTtJQUNFLHVCQUFBO0VBN0RGO0FBQ0Y7QUFnRUE7RUFDRTtJQUNFLFVBQUE7RUE5REY7RUFnRUE7SUFDRSxtQkFBQTtFQTlERjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKiBsYW5kaW5nLnBhZ2Uuc2NzcyAqL1xuXG4vKiBHZW5lcmFsIFN0eWxlcyAqL1xuLy8gOmhvc3Qge1xuLy8gICAtLWJhY2tncm91bmQtY29sb3ItbGlnaHQ6ICNmOGY4Zjg7XG4vLyAgIC0tYmFja2dyb3VuZC1jb2xvci1kYXJrOiAjMjIyO1xuLy8gICAtLXRleHQtY29sb3ItbGlnaHQ6ICMzMzM7XG4vLyAgIC0tdGV4dC1jb2xvci1kYXJrOiAjZjhmOGY4O1xuLy8gfVxuXG4vKiBIZXJvIFNlY3Rpb24gKi9cbi5oZXJvIHtcbiAgYmFja2dyb3VuZDogdmFyKC0taW9uLWJhY2tncm91bmQtY29sb3IpO1xuICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICBwYWRkaW5nOiA2MHB4IDA7XG5cbiAgLmhlcm8tdGV4dCB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gICAgaDEge1xuICAgICAgZm9udC1zaXplOiAyLjVyZW07XG4gICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICB9XG5cbiAgICBwIHtcbiAgICAgIGZvbnQtc2l6ZTogMS4xcmVtO1xuICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICB9XG5cbiAgICBpb24tYnV0dG9uIHtcbiAgICAgIC0tYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICAgICAgLS1ib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgIH1cbiAgfVxuXG4gIC5oZXJvLWltYWdlIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgICBpbWcge1xuICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgIH1cbiAgfVxufVxuXG4vKiBGZWF0dXJlcyBTZWN0aW9uICovXG4uZmVhdHVyZXMge1xuICBwYWRkaW5nOiA4MHB4IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yKTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gIGgyIHtcbiAgICBtYXJnaW4tYm90dG9tOiA1MHB4O1xuICAgIHBhZGRpbmc6IDAgMnJlbTtcbiAgICBmb250LXNpemU6IDIuNXJlbTtcbiAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICB9XG5cbiAgaW9uLWNhcmQge1xuICAgIC0taW9uLWNhcmQtYmFja2dyb3VuZDogdmFyKC0taW9uLWl0ZW0tYmFja2dyb3VuZCk7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGJveC1zaGFkb3c6IDAgNHB4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjEpO1xuICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzO1xuXG4gICAgJjpob3ZlciB7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwcHgpO1xuICAgIH1cblxuICAgIGlvbi1jYXJkLWhlYWRlciB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgIGlvbi1pY29uIHtcbiAgICAgICAgY29sb3I6IHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTVweDtcbiAgICAgIH1cblxuICAgICAgaW9uLWNhcmQtdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICAgICAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpb24tY2FyZC1jb250ZW50IHtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICAgIGNvbG9yOiB2YXIoLS1pb24tdGV4dC1jb2xvcik7XG4gICAgICBsaW5lLWhlaWdodDogMS42O1xuICAgIH1cbiAgfVxufVxuXG4vKiBSb2FkbWFwIFNlY3Rpb24gKi9cbi5yb2FkbWFwIHtcbiAgcGFkZGluZzogODBweCAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1pb24tYmFja2dyb3VuZC1jb2xvcik7XG5cbiAgaDIge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBtYXJnaW4tYm90dG9tOiA1MHB4O1xuICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1pb24tdGV4dC1jb2xvcik7XG4gIH1cblxuICBpb24tYWNjb3JkaW9uLWdyb3VwIHtcbiAgICBtYXgtd2lkdGg6IDgwMHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICB9XG5cbiAgaW9uLWFjY29yZGlvbiB7XG4gICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1pb24tYm9yZGVyLWNvbG9yKTtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICBpb24taXRlbSB7XG4gICAgICAtLWJhY2tncm91bmQ6IHZhcigtLWlvbi1pdGVtLWJhY2tncm91bmQpO1xuICAgIH1cblxuICAgIGlvbi1sYWJlbCBoMyB7XG4gICAgICBmb250LXNpemU6IDEuM3JlbTtcbiAgICAgIGNvbG9yOiB2YXIoLS1pb24tdGV4dC1jb2xvcik7XG4gICAgfVxuXG4gICAgaW9uLWxhYmVsIHAge1xuICAgICAgZm9udC1zaXplOiAxcmVtO1xuICAgICAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcbiAgICB9XG5cbiAgICBpb24tYmFkZ2Uge1xuICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICB9XG5cbiAgICAuaW9uLXBhZGRpbmcge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWNvbnRlbnQtYmFja2dyb3VuZCk7XG4gICAgfVxuXG4gICAgdWwge1xuICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4O1xuXG4gICAgICBsaSB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICAgICAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcblxuICAgICAgICBpb24tYmFkZ2Uge1xuICAgICAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qIFRlc3RpbW9uaWFscyBTZWN0aW9uICovXG4udGVzdGltb25pYWxzIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWJhY2tncm91bmQtY29sb3IpO1xuICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICBwYWRkaW5nOiA4MHB4IDA7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcblxuICBoMiB7XG4gICAgbWFyZ2luLWJvdHRvbTogNTBweDtcbiAgICBmb250LXNpemU6IDIuNXJlbTtcbiAgfVxuXG4gIGlvbi1zbGlkZXMge1xuICAgIGhlaWdodDogYXV0bztcblxuICAgIGlvbi1zbGlkZSB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAgIGlvbi1jYXJkIHtcbiAgICAgICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW9uLWl0ZW0tYmFja2dyb3VuZCk7XG4gICAgICAgIGJveC1zaGFkb3c6IG5vbmU7XG5cbiAgICAgICAgaW9uLWNhcmQtY29udGVudCB7XG4gICAgICAgICAgcCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjY7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaDQge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gICAgICAgICAgICBmb250LXNpemU6IDFyZW07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qIENhbGwgdG8gQWN0aW9uICovXG4uY3RhIHtcbiAgcGFkZGluZzogODBweCAwO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcblxuICBpb24tY2FyZCB7XG4gICAgLS1pb24tY2FyZC1iYWNrZ3JvdW5kOiB2YXIoLS1pb24taXRlbS1iYWNrZ3JvdW5kKTtcbiAgICBib3gtc2hhZG93OiBub25lO1xuXG4gICAgaDIge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgICAgIGZvbnQtc2l6ZTogMi41cmVtO1xuICAgIH1cblxuICAgIHAge1xuICAgICAgZm9udC1zaXplOiAxLjJyZW07XG4gICAgICBtYXJnaW4tYm90dG9tOiAzMHB4O1xuICAgIH1cblxuICAgIGlvbi1idXR0b24ge1xuICAgICAgLS1iYWNrZ3JvdW5kOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gICAgICAtLWNvbG9yOiB2YXIoLS1pb24tY29sb3ItY29udHJhc3QpO1xuICAgICAgLS1ib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgICAgbWFyZ2luLXRvcDogMTBweDtcbiAgICB9XG4gIH1cbn1cblxuLyogRm9vdGVyIFN0eWxlcyAqL1xuLmZvb3RlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWlvbi1iYWNrZ3JvdW5kLWNvbG9yKTtcbiAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcbiAgcGFkZGluZzogNDBweCAwO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0taW9uLWJvcmRlci1jb2xvcik7XG5cbiAgaW9uLWdyaWQge1xuICAgIG1heC13aWR0aDogMTIwMHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICB9XG5cbiAgLmZvb3Rlci1sb2dvIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgICBpbWcge1xuICAgICAgbWF4LXdpZHRoOiAxNTBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgfVxuXG4gICAgcCB7XG4gICAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgfVxuICB9XG5cbiAgLmZvb3Rlci1uYXYge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcblxuICAgIGgzIHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICB9XG5cbiAgICB1bCB7XG4gICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgcGFkZGluZzogMDtcblxuICAgICAgbGkge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuXG4gICAgICAgIGEge1xuICAgICAgICAgIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICAgIGZvbnQtc2l6ZTogMXJlbTtcblxuICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLmZvb3Rlci1zb2NpYWwge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcblxuICAgIGgzIHtcbiAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICBmb250LXNpemU6IDEuMnJlbTtcbiAgICB9XG5cbiAgICBpb24tYnV0dG9ucyB7XG4gICAgICBpb24tYnV0dG9uIHtcbiAgICAgICAgLS1iYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgICAgLS1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICAgICAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICAgICAgbWFyZ2luOiAwIDVweDtcbiAgICAgIH1cbiAgICB9XG4gICAgLnNvY2lhbC1idXR0b25zIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbiAgfVxuXG4gIC5mb290ZXItYm90dG9tIHtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgbWFyZ2luLXRvcDogMjBweDtcblxuICAgIHAge1xuICAgICAgZm9udC1zaXplOiAwLjhyZW07XG4gICAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICAgIH1cbiAgfVxufVxuXG4vKiBSZXNwb25zaXZlIFN0eWxlcyAqL1xuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSB7XG4gIC5mb290ZXItbG9nbyxcbiAgLmZvb3Rlci1uYXYsXG4gIC5mb290ZXItc29jaWFsIHtcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICB9XG5cbiAgLmZvb3Rlci1uYXYgdWwge1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjdweCkge1xuICAuZmVhdHVyZXMgaDIge1xuICAgIHBhZGRpbmc6IDA7XG4gIH1cbiAgLmZvb3Rlci1uYXYgdWwge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 3886:
/*!********************************************************!*\
  !*** ./src/app/modules/auth/pages/login/login.page.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoginPage: () => (/* binding */ LoginPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/auth.actions */ 2345);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-translate/core */ 7353);

var _LoginPage;












function LoginPage_ion_note_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " user.login.email_error");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function LoginPage_ion_note_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "user.login.password_error");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
class LoginPage {
  constructor(alertController, fb, metaService, router, store) {
    this.alertController = alertController;
    this.fb = fb;
    this.metaService = metaService;
    this.router = router;
    this.store = store;
  }
  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags("Login | ASCENDynamics NFP", "Log in to your ASCENDynamics NFP account to track volunteer hours, find opportunities, and connect with nonprofits.", "login, volunteer, nonprofits, community", {
      title: "Login to ASCENDynamics NFP",
      description: "Access your ASCENDynamics NFP account to stay connected with the community.",
      url: "https://app.ASCENDynamics.org/login",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Login | ASCENDynamics NFP",
      description: "Stay connected with your volunteering community.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  // Runs when the component is initialized
  ngOnInit() {
    // Initialize the form after fb is available
    this.loginForm = this.fb.nonNullable.group({
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.email]],
      password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(6)]]
    });
    // Initialize observables after store is defined
    this.loading$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthLoading);
    this.error$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthError);
    this.loadFormData();
  }
  login() {
    const {
      email,
      password
    } = this.loginForm.value;
    if (email && password) {
      this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.signIn({
        email,
        password
      }));
    }
  }
  forgotPassword() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this.alertController.create({
        header: "Receive a new password",
        message: "Please insert your email",
        inputs: [{
          type: "email",
          name: "email"
        }],
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Reset password",
          handler: result => {
            _this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.sendPasswordResetEmail({
              email: result.email
            }));
          }
        }]
      });
      yield alert.present();
    })();
  }
  getEmailSignInLink() {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this2.alertController.create({
        header: "Get an Email Sign-In Link",
        message: "We will send you a link to log in!",
        inputs: [{
          type: "email",
          name: "email",
          value: "",
          placeholder: "Enter your email address"
        }],
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Get an Email Sign-In Link",
          handler: data => {
            const email = data.email;
            if (email) {
              _this2.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.sendSignInLinkToEmail({
                email
              }));
            } else {
              console.error("Email is required to send sign-in link");
            }
          }
        }]
      });
      yield alert.present();
    })();
  }
  signInWithGoogle() {
    this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.signInWithGoogle());
  }
  goToSignUp() {
    this.router.navigateByUrl("/auth/signup", {
      replaceUrl: false
    });
  }
  loadFormData() {
    this.loginForm.reset({
      email: "",
      password: ""
    });
  }
}
_LoginPage = LoginPage;
_LoginPage.ɵfac = function LoginPage_Factory(t) {
  return new (t || _LoginPage)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.AlertController), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_3__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_9__.Store));
};
_LoginPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
  type: _LoginPage,
  selectors: [["app-login"]],
  decls: 46,
  vars: 8,
  consts: [[3, "translucent"], [3, "title"], [3, "fullscreen"], ["collapse", "condense"], [1, "content-center"], ["size", "12", "size-md", "6", 1, "ion-text-center"], [1, "col-container", "ion-padding-bottom"], ["width", "100%", "src", "assets/image/logo/ASCENDynamics NFP-logos_transparent.png", "alt", "ASCENDynamics NFP", 1, "logo"], ["size", "12", "size-md", "6"], [1, "col-container"], [3, "ngSubmit", "formGroup"], [1, "ion-text-center"], [1, "ion-padding-bottom"], ["label", "Email", "label-placement", "floating", "fill", "outline", "type", "email", "inputmode", "email", "formControlName", "email"], ["slot", "error", "translate", "", 4, "ngIf"], ["label", "Password", "label-placement", "floating", "fill", "outline", "type", "password", "inputmode", "text", "formControlName", "password"], ["type", "submit", "expend", "block", "strong", "true", "translate", "", 1, "ion-margin-top", 2, "width", "100%", 3, "disabled"], [1, "ion-margin-top"], ["type", "button", "expand", "block", "color", "primary", "fill", "outline", "translate", "", 3, "click"], ["name", "mail-outline", "slot", "start"], ["type", "button", "expand", "block", "color", "danger", "translate", "", 3, "click"], ["name", "logo-google", "slot", "start"], [1, "ion-text-left"], ["translate", "", 3, "click"], [1, "ion-text-right"], ["slot", "error", "translate", ""]],
  template: function LoginPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "ion-content", 2)(3, "ion-header", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "ion-card-content", 4)(6, "ion-row")(7, "ion-col", 5)(8, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](9, "img", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "ion-col", 8)(11, "div", 9)(12, "form", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ngSubmit", function LoginPage_Template_form_ngSubmit_12_listener() {
        return ctx.login();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "ion-row")(14, "ion-col", 11)(15, "h1", 12)(16, "b");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](17, "Log In");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](18, "h3", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](19, " ASCENDynamics NFP is committed to creating a utopian society. ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](20, "ion-row")(21, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](22, "ion-input", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](23, LoginPage_ion_note_23_Template, 2, 0, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](24, "ion-row")(25, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](26, "ion-input", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](27, LoginPage_ion_note_27_Template, 2, 0, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "ion-button", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](29, " user.login.submit ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](30, "div", 17)(31, "ion-button", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function LoginPage_Template_ion_button_click_31_listener() {
        return ctx.getEmailSignInLink();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](32, "ion-icon", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](33, " user.login.email_signin_link ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](34, "ion-button", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function LoginPage_Template_ion_button_click_34_listener() {
        return ctx.signInWithGoogle();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](35, "ion-icon", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](36, " user.login.google_login ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](37, "ion-row")(38, "ion-col", 22)(39, "ion-text")(40, "a", 23);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function LoginPage_Template_a_click_40_listener() {
        return ctx.goToSignUp();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](41, " user.login.create_account ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](42, "ion-col", 24)(43, "ion-text")(44, "a", 23);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function LoginPage_Template_a_click_44_listener() {
        return ctx.forgotPassword();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](45, " user.login.forgot_password ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()()()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("translucent", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("title", "user.login.title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("title", "user.login.title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("formGroup", ctx.loginForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", (ctx.loginForm.controls.email.dirty || ctx.loginForm.controls.email.touched) && ctx.loginForm.controls.email.errors);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", (ctx.loginForm.controls.password.dirty || ctx.loginForm.controls.password.touched) && ctx.loginForm.controls.password.errors);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.loginForm.invalid);
    }
  },
  dependencies: [_shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormControlName, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateDirective],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\na[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n\n.logo[_ngcontent-%COMP%] {\n  width: 500px;\n  max-width: 100%;\n}\n\nh2[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  margin-bottom: 10px;\n  font-size: 24px;\n  font-weight: bold;\n  text-align: center;\n}\n\n.content-center[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100%; \n\n}\n\nion-card[_ngcontent-%COMP%] {\n  height: 100%; \n\n}\n\nion-content[_ngcontent-%COMP%] {\n  --padding-start: 0;\n  --padding-end: 0;\n  --padding-top: 0;\n  --padding-bottom: 0;\n}\nion-content[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%] {\n  font-size: small;\n}\n\n.col-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%; \n\n}\n\nion-item[_ngcontent-%COMP%] {\n  background: #000;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hdXRoL3BhZ2VzL2xvZ2luL2xvZ2luLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsZUFBQTtBQUNGOztBQUVBO0VBQ0UsWUFBQTtFQUNBLGVBQUE7QUFDRjs7QUFFQTtFQUNFLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtBQUNGOztBQUVBO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUEsRUFBQSx1RUFBQTtBQUNGOztBQUVBO0VBQ0UsWUFBQSxFQUFBLGdFQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQUNGO0FBQ0U7RUFDRSxnQkFBQTtBQUNKOztBQUdBO0VBQ0UsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBLEVBQUEsaUVBQUE7QUFBRjs7QUFHQTtFQUNFLGdCQUFBO0FBQUYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbmEge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5sb2dvIHtcbiAgd2lkdGg6IDUwMHB4O1xuICBtYXgtd2lkdGg6IDEwMCU7XG59XG5cbmgyIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbiAgZm9udC1zaXplOiAyNHB4O1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uY29udGVudC1jZW50ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDAlOyAvKiBUaGlzIGVuc3VyZXMgdGhhdCB0aGUgaW9uLWNhcmQtY29udGVudCB0YWtlcyBmdWxsIGF2YWlsYWJsZSBoZWlnaHQgKi9cbn1cblxuaW9uLWNhcmQge1xuICBoZWlnaHQ6IDEwMCU7IC8qIE1ha2UgdGhlIGlvbi1jYXJkIHRha2UgZnVsbCBhdmFpbGFibGUgaGVpZ2h0IG9mIGlvbi1jb250ZW50ICovXG59XG5cbmlvbi1jb250ZW50IHtcbiAgLS1wYWRkaW5nLXN0YXJ0OiAwO1xuICAtLXBhZGRpbmctZW5kOiAwO1xuICAtLXBhZGRpbmctdG9wOiAwO1xuICAtLXBhZGRpbmctYm90dG9tOiAwO1xuXG4gIGlvbi10ZXh0IHtcbiAgICBmb250LXNpemU6IHNtYWxsO1xuICB9XG59XG5cbi5jb2wtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTAwJTsgLyogRW5zdXJlIHRoZSBjb250YWluZXIgdGFrZXMgZnVsbCBoZWlnaHQgdG8gY2VudGVyIGl0cyBjb250ZW50ICovXG59XG5cbmlvbi1pdGVtIHtcbiAgYmFja2dyb3VuZDogIzAwMDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 5816:
/*!**********************************************************!*\
  !*** ./src/app/modules/auth/pages/signup/signup.page.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SignupPage: () => (/* binding */ SignupPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _shared_components_legal_modal_legal_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../shared/components/legal-modal/legal-modal.component */ 4818);
/* harmony import */ var _state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/auth.actions */ 2345);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _core_services_meta_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../core/services/meta.service */ 6369);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngx-translate/core */ 7353);

var _SignupPage;













function SignupPage_ion_note_23_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Email is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SignupPage_ion_note_23_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Please enter a valid email address. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SignupPage_ion_note_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-note", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, SignupPage_ion_note_23_span_1_Template, 2, 0, "span", 24)(2, SignupPage_ion_note_23_span_2_Template, 2, 0, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (tmp_1_0 = ctx_r0.signupForm.get("email")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.signupForm.get("email")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["email"]);
  }
}
function SignupPage_ion_note_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-note", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Password must include at least one uppercase letter, one lowercase letter, one numeric digit, and one special character. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SignupPage_ion_note_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-note", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " Passwords do not match. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SignupPage_ion_note_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-note", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, " You must agree to the terms and conditions. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function SignupPage_div_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 25)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const error_r2 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](error_r2 == null ? null : error_r2.message);
  }
}
class SignupPage {
  constructor(fb, router, metaService, modalController, store) {
    this.fb = fb;
    this.router = router;
    this.metaService = metaService;
    this.modalController = modalController;
    this.store = store;
    this.error$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAuthError);
    this.loading$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAuthLoading);
  }
  // Runs when the page is about to enter the view
  ionViewWillEnter() {
    this.metaService.updateMetaTags("Sign Up | ASCENDynamics NFP", "Create an account on ASCENDynamics NFP to find volunteer opportunities and connect with nonprofits.", "sign up, volunteer, nonprofits, community", {
      title: "Sign Up for ASCENDynamics NFP",
      description: "Join ASCENDynamics NFP to start making an impact in your community today.",
      url: "https://app.ASCENDynamics.org/signup",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    }, {
      card: "summary",
      title: "Sign Up | ASCENDynamics NFP",
      description: "Become part of ASCENDynamics NFP and start your volunteering journey.",
      image: "https://app.ASCENDynamics.org/assets/icon/logo.png"
    });
  }
  // Initialize form and state selectors in ngOnInit
  ngOnInit() {
    this.signupForm = this.fb.nonNullable.group({
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.email]],
      password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.minLength(8)]],
      agreedToTerms: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.requiredTrue]
    }, {
      validators: this.matchingPasswordsValidator
    });
  }
  signup() {
    const {
      email,
      password
    } = this.signupForm.value;
    if (email && password) {
      this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_2__.signUp({
        email,
        password
      }));
    }
  }
  // Navigate to the login page
  goToLogin() {
    this.router.navigateByUrl("/auth/login");
  }
  // Open the legal modal (Privacy Policy or Terms of Use)
  openLegalModal(contentType) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const modal = yield _this.modalController.create({
        component: _shared_components_legal_modal_legal_modal_component__WEBPACK_IMPORTED_MODULE_1__.LegalModalComponent,
        componentProps: {
          content: contentType
        }
      });
      yield modal.present();
    })();
  }
  // Custom validator to check password strength
  passwordStrengthValidator(control) {
    const value = control.value;
    if (!value) {
      return null; // Don't validate empty value
    }
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /\d/.test(value);
    const hasSpecialChar = /\W|_/.test(value); // Matches any non-word character or underscore
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    return !valid ? {
      passwordStrength: true
    } : null;
  }
  // Custom validator to ensure password and confirmPassword match
  matchingPasswordsValidator(group) {
    var _group$get, _group$get2;
    const password = (_group$get = group.get("password")) === null || _group$get === void 0 ? void 0 : _group$get.value;
    const confirmPassword = (_group$get2 = group.get("confirmPassword")) === null || _group$get2 === void 0 ? void 0 : _group$get2.value;
    // Check if the password and confirm password fields match
    return password === confirmPassword ? null : {
      passwordMismatch: true
    };
  }
}
_SignupPage = SignupPage;
_SignupPage.ɵfac = function SignupPage_Factory(t) {
  return new (t || _SignupPage)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_core_services_meta_service__WEBPACK_IMPORTED_MODULE_4__.MetaService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_9__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_10__.Store));
};
_SignupPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
  type: _SignupPage,
  selectors: [["app-signup"]],
  decls: 54,
  vars: 13,
  consts: [[3, "translucent"], [3, "title"], [3, "fullscreen"], ["collapse", "condense"], [1, "content-center"], ["size", "12", "size-md", "6", 1, "ion-text-center"], [1, "col-container", "ion-padding-bottom"], ["width", "100%", "src", "assets/image/logo/ASCENDynamics NFP-logos_transparent.png", "alt", "ASCENDynamics NFP", 1, "logo"], ["size", "12", "size-md", "6"], [1, "col-container"], [3, "ngSubmit", "formGroup"], [1, "ion-text-center"], [1, "ion-padding-bottom"], ["label", "Email", "label-placement", "floating", "fill", "outline", "type", "email", "inputmode", "email", "formControlName", "email", "placeholder", "email@domain.com"], ["color", "danger", 4, "ngIf"], ["label", "Password", "label-placement", "floating", "fill", "outline", "formControlName", "password", "type", "password", "placeholder", "Password", "minlength", "8"], ["label", "Confirm Password", "label-placement", "floating", "fill", "outline", "formControlName", "confirmPassword", "type", "password", "placeholder", "Confirm Password", "minlength", "8"], ["labelPlacement", "end", "formControlName", "agreedToTerms"], [1, "ion-padding"], [3, "click"], ["type", "submit", "expand", "block", "strong", "true", "translate", "", 1, "ion-margin-top", 2, "width", "100%", 3, "disabled"], ["translate", "", 3, "click"], ["class", "error-message", 4, "ngIf"], ["color", "danger"], [4, "ngIf"], [1, "error-message"]],
  template: function SignupPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "ion-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "ion-content", 2)(3, "ion-header", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](4, "app-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "ion-card-content", 4)(6, "ion-row")(7, "ion-col", 5)(8, "div", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](9, "img", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "ion-col", 8)(11, "div", 9)(12, "form", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function SignupPage_Template_form_ngSubmit_12_listener() {
        return ctx.signup();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "ion-row")(14, "ion-col", 11)(15, "h1", 12)(16, "b");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17, "Sign up");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "h3", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19, " ASCENDynamics NFP is committed to creating a utopian society. ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "ion-row")(21, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](22, "ion-input", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](23, SignupPage_ion_note_23_Template, 3, 2, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "ion-row")(25, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](26, "ion-input", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](27, SignupPage_ion_note_27_Template, 2, 0, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](28, "ion-row")(29, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](30, "ion-input", 16);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](31, SignupPage_ion_note_31_Template, 2, 0, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](32, "ion-row")(33, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](34, "ion-checkbox", 17);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](35, "ion-text", 18);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](36, " I have read and agree to the ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](37, "a", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupPage_Template_a_click_37_listener() {
        return ctx.openLegalModal("privacyPolicy");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](38, "Privacy Policy");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](39, " and ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](40, "a", 19);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupPage_Template_a_click_40_listener() {
        return ctx.openLegalModal("termsOfUse");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](41, "Terms of Use");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](42, ". ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](43, SignupPage_ion_note_43_Template, 2, 0, "ion-note", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](44, "ion-row")(45, "ion-col")(46, "ion-button", 20);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](47, " user.signup.submit ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](48, "ion-text");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](49, " Already have an account? ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](50, "a", 21);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function SignupPage_Template_a_click_50_listener() {
        return ctx.goToLogin();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](51, " user.signup.login ");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](52, SignupPage_div_52_Template, 3, 1, "div", 22);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](53, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("translucent", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", "user.signup.title");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("fullscreen", true);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", "user.signup.title");
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx.signupForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](11);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (((tmp_5_0 = ctx.signupForm.get("email")) == null ? null : tmp_5_0.dirty) || ((tmp_5_0 = ctx.signupForm.get("email")) == null ? null : tmp_5_0.touched)) && ((tmp_5_0 = ctx.signupForm.get("email")) == null ? null : tmp_5_0.errors));
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (((tmp_6_0 = ctx.signupForm.get("password")) == null ? null : tmp_6_0.hasError("passwordStrength")) || ((tmp_6_0 = ctx.signupForm.get("password")) == null ? null : tmp_6_0.errors)) && (((tmp_6_0 = ctx.signupForm.get("password")) == null ? null : tmp_6_0.dirty) || ((tmp_6_0 = ctx.signupForm.get("password")) == null ? null : tmp_6_0.touched)));
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (ctx.signupForm.errors == null ? null : ctx.signupForm.errors["passwordMismatch"]) && ((tmp_7_0 = ctx.signupForm.get("confirmPassword")) == null ? null : tmp_7_0.touched));
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ((tmp_8_0 = ctx.signupForm.get("agreedToTerms")) == null ? null : tmp_8_0.invalid) && (((tmp_8_0 = ctx.signupForm.get("agreedToTerms")) == null ? null : tmp_8_0.dirty) || ((tmp_8_0 = ctx.signupForm.get("agreedToTerms")) == null ? null : tmp_8_0.touched)));
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx.signupForm.invalid);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](53, 11, ctx.error$));
    }
  },
  dependencies: [_shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__.AppHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_9__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateDirective, _angular_common__WEBPACK_IMPORTED_MODULE_11__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\na[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n\n.logo[_ngcontent-%COMP%] {\n  width: 500px;\n  max-width: 100%;\n}\n\nh2[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  margin-bottom: 10px;\n  font-size: 24px;\n  font-weight: bold;\n  text-align: center;\n}\n\n.content-center[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  height: 100%; \n\n}\n\nion-card[_ngcontent-%COMP%] {\n  height: 100%; \n\n}\n\nion-content[_ngcontent-%COMP%] {\n  --padding-start: 0;\n  --padding-end: 0;\n  --padding-top: 0;\n  --padding-bottom: 0;\n}\nion-content[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%] {\n  font-size: small;\n}\n\n.col-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100%; \n\n}\n\nion-note[_ngcontent-%COMP%] {\n  display: block;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9hdXRoL3BhZ2VzL3NpZ251cC9zaWdudXAucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFtQkE7RUFDRSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0EsZUFBQTtBQUNGOztBQUVBO0VBQ0UsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQSxFQUFBLHVFQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBLEVBQUEsZ0VBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7QUFDRTtFQUNFLGdCQUFBO0FBQ0o7O0FBR0E7RUFDRSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUEsRUFBQSxpRUFBQTtBQUFGOztBQUdBO0VBQ0UsY0FBQTtBQUFGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5hIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ubG9nbyB7XG4gIHdpZHRoOiA1MDBweDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xufVxuXG5oMiB7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLmNvbnRlbnQtY2VudGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGhlaWdodDogMTAwJTsgLyogVGhpcyBlbnN1cmVzIHRoYXQgdGhlIGlvbi1jYXJkLWNvbnRlbnQgdGFrZXMgZnVsbCBhdmFpbGFibGUgaGVpZ2h0ICovXG59XG5cbmlvbi1jYXJkIHtcbiAgaGVpZ2h0OiAxMDAlOyAvKiBNYWtlIHRoZSBpb24tY2FyZCB0YWtlIGZ1bGwgYXZhaWxhYmxlIGhlaWdodCBvZiBpb24tY29udGVudCAqL1xufVxuXG5pb24tY29udGVudCB7XG4gIC0tcGFkZGluZy1zdGFydDogMDtcbiAgLS1wYWRkaW5nLWVuZDogMDtcbiAgLS1wYWRkaW5nLXRvcDogMDtcbiAgLS1wYWRkaW5nLWJvdHRvbTogMDtcblxuICBpb24tdGV4dCB7XG4gICAgZm9udC1zaXplOiBzbWFsbDtcbiAgfVxufVxuXG4uY29sLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDEwMCU7IC8qIEVuc3VyZSB0aGUgY29udGFpbmVyIHRha2VzIGZ1bGwgaGVpZ2h0IHRvIGNlbnRlciBpdHMgY29udGVudCAqL1xufVxuXG5pb24tbm90ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4818:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/legal-modal/legal-modal.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LegalModalComponent: () => (/* binding */ LegalModalComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
var _LegalModalComponent;
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




class LegalModalComponent {
  constructor(modalController) {
    this.modalController = modalController;
    this.privacyPolicy = `
  <h2>Privacy Policy</h2>

  <h3>1. Introduction</h3>

  <h4>Purpose of the Policy</h4>
  <p>This Privacy Policy outlines the practices of ASCENDynamics NFP Collaborative Nonprofit Network ("ASCENDynamics," "we," "us," or "our") regarding the collection, use, and disclosure of personal information we receive from users of our platform. This policy is designed to inform you about how we handle your personal data and to ensure transparency in our operations. Understanding this policy will help you make informed decisions about sharing your personal information with us.</p>

  <h4>Commitment to Privacy</h4>
  <p>At ASCENDynamics, we are deeply committed to respecting and protecting your privacy. We understand the importance of personal information entrusted to us and are dedicated to handling it responsibly and safeguarding it with appropriate measures. Our commitment extends to ensuring that we comply with privacy laws and regulations applicable to our operations and services.</p>

  <h3>2. Information Collection</h3>

  <h4>Types of Information Collected</h4>
  <p>We collect various types of personal information to provide and improve our services. This may include, but is not limited to:</p>
  <ul>
    <li>Personal Identification Information: Such as your name, email address, postal address, phone number, and other similar contact data.</li>
    <li>Account Information: Information required to create and maintain your user account, including username, password, and other identifiers.</li>
    <li>Demographic Information: Information such as age, gender, interests, and preferences.</li>
    <li>Usage Data: Information on how you interact with our platform, including access times, pages viewed, and the routes by which you access our services.</li>
    <li>Communication Data: Information contained in or relating to any communication that you send to us or through our platform.</li>
  </ul>

  <h4>Methods of Collection</h4>
  <p>The collection of personal information occurs through various means, including:</p>
  <ul>
    <li>Account Registration: When you create an account on our platform, we collect the information you provide in the registration form.</li>
    <li>Cookies and Tracking Technologies: We use cookies and similar tracking technologies to track activity on our platform and hold certain information, enhancing your experience with our services.</li>
    <li>User-Generated Content: Information that you voluntarily provide when you use certain features of our platform, such as posting in forums, participating in surveys, or making donations.</li>
    <li>Direct Communications: Information that you provide when you communicate directly with us via emails, phone calls, or other messaging services.</li>
  </ul>

  <h3>3. Use of Information</h3>

  <h4>Purpose of Collection</h4>
  <p>The information collected from our users is essential for the effective operation and enhancement of the ASCENDynamics platform. We use this information for various purposes, including:</p>
  <ul>
    <li><strong>Service Provision:</strong> To create and manage user accounts, provide and personalize our services, and process transactions.</li>
    <li><strong>Communication:</strong> To communicate with users regarding service updates, support, and administrative messages.</li>
    <li><strong>Improvement of Services:</strong> To understand and analyze the usage trends and preferences of our users, which helps us improve our platform's functionality and develop new features and services.</li>
    <li><strong>Security:</strong> To enhance the security of our platform, prevent fraud, and ensure the integrity of our services.</li>
    <li><strong>Legal Obligations:</strong> To comply with legal requirements and assist law enforcement agencies as required by law.</li>
  </ul>

  <h4>Data Analysis</h4>
  <p><strong>Statistical Evaluation:</strong> We may perform statistical, demographic, and marketing analyses of users of the platform, and their purchasing patterns, for product development purposes and to generally inform advertisers about the nature of our user base.</p>
  <p><strong>Anonymized Data:</strong> We use anonymized and aggregated data for these analyses, which do not identify individual users, to improve our services and for business and marketing purposes.</p>

  <h3>4. Cookies and Tracking Technologies</h3>

  <h4>Use of Cookies</h4>
  <p><strong>Functionality:</strong> Cookies are small data files stored on your device that help us improve our platform and your experience, see which areas and features of our platform are popular, and count visits.</p>
  <p><strong>Personalization:</strong> Cookies are also used to store your preferences and settings, provide personalized content and ads, and analyze how our platform is performing.</p>

  <h4>Control of Cookies</h4>
  <p><strong>Browser Settings:</strong> You can control and/or delete cookies as you wish – for details, see <a href="https://www.aboutcookies.org" target="_blank">aboutcookies.org</a>. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
  <p><strong>Opt-Out Options:</strong> If you opt out of cookies, you may not be able to use certain features of the platform, and your user experience may be adversely impacted.</p>

  <h3>5. Disclosure of Information</h3>

  <h4>Circumstances of Disclosure</h4>
  <p>We may disclose the personal information we collect or you provide as described in this policy:</p>
  <ul>
    <li><strong>Legal Compliance and Protection:</strong> To comply with any court order, law, or legal process, including responding to any government or regulatory request, or if we believe disclosure is necessary or appropriate to protect the rights, property, or safety of ASCENDynamics, our users, or others.</li>
    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, bankruptcy, or other similar event, your information may be transferred to the successor entity.</li>
  </ul>

  <h4>Third-Party Sharing</h4>
  <p><strong>Service Providers:</strong> We may share your information with third parties who perform services on our behalf (e.g., payment processing, data analysis, email delivery, hosting services).</p>
  <p><strong>Partnerships:</strong> We may disclose information to our partners in accordance with our agreements with them, including advertisers and sponsors of our services.</p>
  <p><strong>Consent:</strong> We may also disclose your personal information to any other third party with your prior consent.</p>

  <h3>6. User Rights</h3>

  <h4>Access and Control</h4>
  <p><strong>Viewing and Updating Information:</strong> Users have the right to access and update their personal information at any time. This can typically be done through the user profile settings on the ASCENDynamics platform.</p>
  <p><strong>Data Portability:</strong> Upon request, we will provide you with a copy of your personal data in a structured, commonly used, and machine-readable format.</p>
  <p><strong>Account Deletion:</strong> Users can request the deletion of their account and associated data. Some information may be retained for a certain period as required by law or for legitimate business purposes.</p>

  <h4>Opt-Out Options</h4>
  <p><strong>Marketing Communications:</strong> Users can opt out of receiving marketing emails from us by following the unsubscribe link included in such emails.</p>
  <p><strong>Cookie Preferences:</strong> Users can manage their cookie preferences through their browser settings, allowing them to refuse certain types of cookies.</p>

  <h3>7. Data Security</h3>

  <h4>Security Measures</h4>
  <p><strong>Protection Strategies:</strong> We implement a variety of security measures, including encryption, firewalls, and secure server facilities, to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our platform.</p>
  <p><strong>Regular Reviews:</strong> Our security policies are regularly reviewed and enhanced as necessary, and only authorized personnel have access to personal information. We are committed to ensuring that your information is secure.</p>

  <h4>Data Breach Procedures</h4>
  <p><strong>Incident Response:</strong> In the event of a data breach, we have implemented procedures to respond promptly to secure the data, assess the risk to individuals, and take appropriate steps to rectify the breach.</p>
  <p><strong>Notification:</strong> Should any breach result in a high risk to the rights and freedoms of individuals, we will notify affected users without undue delay.</p>
  <p><strong>Regulatory Compliance:</strong> We will also communicate any data breaches to the appropriate regulatory authorities as required by law, detailing the extent of the breach and any measures taken to address it.</p>

  <h3>8. International Users</h3>

  <h4>International Data Transfer</h4>
  <p><strong>Cross-Border Data Transfers:</strong> Personal information collected on the ASCENDynamics platform may be stored and processed in any country where we operate or where our service providers are located. By using our platform, you consent to the transfer of information to countries outside of your country of residence, which may have different data protection rules than those of your country.</p>
  <p><strong>Safeguards:</strong> We take appropriate measures to ensure that your personal information remains protected and secure in accordance with this Privacy Policy, regardless of where it is processed.</p>

  <h4>Regional Privacy Laws</h4>
  <p><strong>Compliance with Local Laws:</strong> ASCENDynamics is committed to complying with regional privacy laws and regulations, including the General Data Protection Regulation (GDPR) for our European users. This includes provisions for data subject rights such as access, rectification, erasure, and data portability.</p>
  <p><strong>Specific Rights for EU Residents:</strong> If you are a resident of the European Union, you have certain rights under the GDPR, including the right to object to processing and the right to lodge a complaint with a supervisory authority.</p>

  <h3>9. Policy Updates</h3>

  <h4>Changes to the Policy</h4>
  <p><strong>Notification of Changes:</strong> We reserve the right to update or modify this Privacy Policy at any time and without prior notice. Changes to our Privacy Policy will be posted on our platform and, where appropriate, notified to you by email or other means.</p>
  <p><strong>Review Responsibility:</strong> We encourage users to frequently review the Privacy Policy for any changes to stay informed about how we are protecting the personal information we collect.</p>

  <h4>User Acknowledgement</h4>
  <p><strong>Acceptance of Revised Terms:</strong> Your continued use of the ASCENDynamics platform after any changes or revisions to this Privacy Policy signifies your agreement with the terms of the revised policy. If you do not agree to the new terms, you should discontinue using the ASCENDynamics platform.</p>

  <h3>10. Contact Information</h3>

  <h4>Queries and Complaints</h4>
  <p><strong>Direct Contact:</strong> If you have any questions, concerns, or complaints about this Privacy Policy or our handling of your personal data, you can contact us through the following means:</p>
  <ul>
    <li><strong>Email:</strong> support@ascendynamics.org - for direct communication with our privacy team.</li>
    <li><strong>Mailing Address:</strong> 7649 W Irving Park Rd #N1, Chicago, IL, United States 60634 - for formal written inquiries or complaints.</li>
    <li><strong>Phone:</strong> ###-###-#### - for immediate concerns or queries.</li>
  </ul>
  <p><strong>Response Commitment:</strong> Our team is dedicated to addressing your concerns as promptly and thoroughly as possible. We aim to respond to all inquiries within one week of receipt.</p>
  <p><strong>Feedback Process:</strong> We value your feedback and are committed to improving our policies and practices based on your input.</p>

  <h3>11. Effective Date</h3>

  <h4>Policy Effective Date</h4>
  <p><strong>Date of Effectiveness:</strong> This Privacy Policy is effective as of January 1, 2024.</p>
  <p><strong>Previous Versions:</strong> If applicable, note that previous versions of the Privacy Policy can be obtained by contacting us.</p>
  <p><strong>Acknowledgement of Updates:</strong> By continuing to use the ASCENDynamics platform on or after this date, you agree to the terms of this Privacy Policy.</p>`;
    this.termsOfUse = `
  <h2>Terms of Use</h2>

  <h3>1. Introduction</h3>

  <h4>Purpose of the Document</h4>
  <p>This Terms of Use document ("Terms") serves as a binding agreement between ASCENDynamics NFP Collaborative Nonprofit Network ("ASCENDynamics," "we," "us," or "our") and you, the user ("User," "you," or "your"). This document outlines the rules, guidelines, and conditions under which you may access and use our platform and its associated services. The purpose of these Terms is to ensure a clear understanding of the mutual responsibilities and to maintain a safe, respectful, and legally compliant environment for all users. By accessing and using our platform, you agree to comply with these Terms, which are designed to promote positive and productive interactions within our community.</p>

  <h4>Acceptance of Terms</h4>
  <p>By registering for an account, accessing, or using our platform in any capacity, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use or access our platform. Your continued use of the platform will be deemed as acceptance of any amended or updated Terms.</p>

  <h3>2. User Eligibility</h3>

  <h4>Age Requirement</h4>
  <p>To create an account and engage with the ASCENDynamics platform, you must be at least 18 years of age. By agreeing to these Terms, you represent and warrant that you are of legal age to form a binding contract with ASCENDynamics. If you are not of legal age, you must not access or use the platform.</p>

  <h4>User Representation</h4>
  <p>When creating an account and using our platform, you agree to: (1) provide accurate, truthful, current, and complete information about yourself as prompted by our registration forms ("Registration Data"); and (2) maintain and promptly update the Registration Data to keep it accurate, current, and complete. You acknowledge that if any information provided by you is untrue, inaccurate, not current, or incomplete, we reserve the right to suspend or terminate your account and refuse any and all current or future use of our platform.</p>

  <h3>3. User Account and Responsibilities</h3>

  <h4>Account Creation</h4>
  <p>To access the full features of the ASCENDynamics platform, you must create an account. Account creation involves the following steps:</p>
  <ul>
    <li><strong>Registration:</strong> Complete the registration form by providing required information, including but not limited to your name, email address, and password.</li>
    <li><strong>Verification:</strong> Depending on the platform's requirements, you may need to verify your email address or phone number to confirm your identity.</li>
    <li><strong>Profile Setup:</strong> You may be prompted to set up a user profile, which could include additional personal details, preferences, and areas of interest.</li>
  </ul>

  <h4>Account Responsibilities</h4>
  <p>As a user of the ASCENDynamics platform, you are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account. You agree to:</p>
  <ul>
    <li><strong>Secure Your Account:</strong> Take reasonable steps to protect your account information from unauthorized access.</li>
    <li><strong>Notify of Unauthorized Use:</strong> Immediately notify ASCENDynamics of any unauthorized use of your account or any other breach of security.</li>
    <li><strong>Account Conduct:</strong> Ensure that your use of the account complies with these Terms and all applicable laws and regulations.</li>
  </ul>

  <h3>4. Prohibited Activities</h3>

  <h4>List of Prohibited Activities</h4>
  <p>While using the ASCENDynamics platform, the following activities are strictly prohibited:</p>
  <ul>
    <li><strong>Illegal Activities:</strong> Engaging in illegal activities or promoting criminal actions.</li>
    <li><strong>Harassment and Abuse:</strong> Harassing, bullying, or threatening other users, or promoting violence or harm.</li>
    <li><strong>False Information:</strong> Knowingly disseminating false or misleading information.</li>
    <li><strong>Infringement of Rights:</strong> Violating the intellectual property rights of others.</li>
    <li><strong>Spamming:</strong> Sending unsolicited messages or spam.</li>
    <li><strong>Hacking and Unauthorized Access:</strong> Attempting to gain unauthorized access to other user accounts or the platform's systems.</li>
    <li><strong>Other Disruptive Behaviors:</strong> Engaging in any other activity that disrupts the platform's operation or harms other users.</li>
  </ul>

  <h4>Consequences of Violating Rules</h4>
  <p>Violation of these rules may result in a range of actions taken by ASCENDynamics, depending on the severity and nature of the violation. These actions include, but are not limited to:</p>
  <ul>
    <li><strong>Warning:</strong> Issuing a warning to the offending user.</li>
    <li><strong>Temporary Suspension:</strong> Temporarily suspending the user's access to the platform.</li>
    <li><strong>Permanent Ban:</strong> Permanently banning the user from the platform.</li>
    <li><strong>Legal Action:</strong> Initiating legal proceedings if the violation constitutes a criminal offense or causes significant harm to ASCENDynamics or its users.</li>
  </ul>

  <h3>5. Content Ownership and Use</h3>

  <h4>User-Generated Content</h4>
  <p><strong>Posting Guidelines:</strong> Users are encouraged to share, post, and create content that is beneficial to the community. However, all user-generated content must comply with our platform's standards, which prohibit offensive, harmful, or illegal content.</p>
  <p><strong>Responsibility for Content:</strong> You are solely responsible for the content you post, including its legality, reliability, and appropriateness. ASCENDynamics NFP does not claim ownership of the content you provide and post on the platform.</p>
  <p><strong>License to Use:</strong> By posting content on the ASCENDynamics platform, you grant us a non-exclusive, worldwide, royalty-free, perpetual, and transferable license to use, reproduce, modify, display, and distribute your content in connection with the platform's services. This license is solely for the purpose of operating, promoting, and improving our services.</p>

  <h4>Intellectual Property Rights</h4>
  <p><strong>Respect for Intellectual Property:</strong> Users must respect the intellectual property rights of others. Content that infringes upon the copyrights, trademarks, patents, or other intellectual property rights of any person or entity is strictly prohibited.</p>
  <p><strong>Copyright Complaints:</strong> ASCENDynamics adheres to appropriate legal procedures for addressing allegations of copyright infringement in accordance with applicable copyright laws.</p>
  <p><strong>Content Removal:</strong> We reserve the right to remove or disable access to any content that is found to be in violation of these Terms or infringing on intellectual property rights.</p>

  <h3>6. Privacy and Data Protection</h3>

  <h4>Data Collection and Use</h4>
  <ul>
    <li><strong>Collection of Information:</strong> The ASCENDynamics platform collects various types of information from its users, including personal identification information, usage data, and other relevant data necessary for the effective operation of the service.</li>
    <li><strong>Use of Data:</strong> The collected data is used for purposes such as providing and maintaining the service, identifying and communicating with users, responding to user requests/inquiries, improving our services, and enforcing our Terms of Use.</li>
    <li><strong>Data Sharing:</strong> We do not sell or rent user data to third parties. Data may be shared with third parties only when necessary for the provision of our services, compliance with the law, or protection of our rights.</li>
  </ul>

  <h4>User Privacy</h4>
  <ul>
    <li><strong>Commitment to Privacy:</strong> Protecting user privacy is a top priority for ASCENDynamics. We implement a variety of security measures to maintain the safety of your personal information.</li>
    <li><strong>Access to Information:</strong> Users have the right to access, update, or delete the personal information we hold about them.</li>
    <li><strong>Changes to Privacy Practices:</strong> If any changes are made to our privacy practices, users will be notified through the platform or via email, as appropriate.</li>
  </ul>

  <h3>7. Disclaimers</h3>

  <h4>No Warranties</h4>
  <ul>
    <li><strong>"As Is" Basis:</strong> The ASCENDynamics platform and all content, materials, information, services, and products available through the platform, including, but not limited to, software, are provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied.</li>
    <li><strong>Disclaimer of Warranties:</strong> ASCENDynamics expressly disclaims all warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the platform will be uninterrupted, timely, secure, or error-free, or that defects, if any, will be corrected.</li>
  </ul>

  <h4>Accuracy of Information</h4>
  <ul>
    <li><strong>No Guarantee of Accuracy:</strong> While ASCENDynamics strives to provide accurate and up-to-date information, we make no representations or warranties as to the accuracy, reliability, completeness, or timeliness of any information on the platform. The use of the platform and its content is at your own risk.</li>
    <li><strong>User Responsibility:</strong> Users are responsible for verifying the accuracy of information before relying on it. We are not responsible for any decisions made based on the information provided on the platform.</li>
  </ul>

  <h3>8. Limitation of Liability</h3>

  <h4>Limitations</h4>
  <ul>
    <li><strong>Scope of Liability:</strong> To the fullest extent permitted by law, ASCENDynamics shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses (even if ASCENDynamics has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the platform; (ii) unauthorized access to or alteration of your transmissions or data; (iii) statements or conduct of any third party on the platform; or (iv) any other matter relating to the platform.</li>
    <li><strong>Cap on Liability:</strong> In jurisdictions that do not allow the exclusion or limitation of liability for consequential or incidental damages, ASCENDynamics' liability is limited to the greatest extent permitted by law.</li>
    <li><strong>User Acknowledgement:</strong> By using the platform, you acknowledge and agree that the limitations of liability set forth in this section are fundamental elements of the basis of the bargain between ASCENDynamics and you, and the platform would not be provided without such limitations.</li>
  </ul>

  <h3>9. Modification of Terms</h3>

  <h4>Right to Modify Terms</h4>
  <ul>
    <li><strong>Reserve of Rights:</strong> ASCENDynamics reserves the right, at our sole discretion, to change, modify, add, or remove portions of these Terms of Use at any time. It is your responsibility to check these Terms periodically for changes.</li>
    <li><strong>Notification of Changes:</strong> Changes to the Terms will be effective immediately upon posting on the platform unless we specify otherwise. We will make reasonable efforts to notify users of significant changes through the platform interface, email notification, or other reasonable means.</li>
    <li><strong>Acceptance of Revised Terms:</strong> Your continued use of the platform following the posting of changes will mean that you accept and agree to the changes. If you do not agree to the amended terms, you must stop using the platform.</li>
  </ul>

  <h3>10. Termination of Service</h3>

  <h4>Termination by Platform</h4>
  <ul>
    <li><strong>Circumstances for Termination:</strong> ASCENDynamics may terminate or suspend your access to the platform and your account at any time, without notice, in our sole discretion, for any reason, including but not limited to a breach of these Terms.</li>
    <li><strong>Effect of Termination:</strong> Upon termination, your right to use the platform will immediately cease. If your account is terminated, you may no longer have access to data, messages, files, and other material you keep on the platform.</li>
    <li><strong>Survival of Terms:</strong> Termination of your account does not affect the applicability of those sections of these Terms that are intended to survive termination.</li>
  </ul>

  <h4>Termination by User</h4>
  <ul>
    <li><strong>User-Initiated Termination:</strong> You may terminate your account at any time through the account settings feature on the platform or by contacting our support team.</li>
    <li><strong>Responsibility for Activities Pre-Termination:</strong> Termination of your account is your sole right and remedy with respect to any dispute with us regarding the platform or these Terms. Upon termination of your account, you remain liable for all activities conducted through your account prior to termination.</li>
  </ul>

  <h3>11. Governing Law and Dispute Resolution</h3>

  <h4>Jurisdiction</h4>
  <ul>
    <li><strong>Applicable Law:</strong> These Terms of Use and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the State of Illinois, United States.</li>
    <li><strong>Jurisdiction for Disputes:</strong> Any disputes arising out of or in connection with these Terms or the use of the ASCENDynamics platform shall be subject to the exclusive jurisdiction of the state and federal courts located in the State of Illinois, United States.</li>
  </ul>

  <h4>Dispute Resolution</h4>
  <ul>
    <li><strong>Informal Resolution:</strong> Before filing a claim against ASCENDynamics, you agree to try to resolve the dispute informally by contacting us. We'll try to resolve the dispute informally by contacting you via email.</li>
    <li><strong>Formal Legal Action:</strong> If the dispute is not resolved within a specified period after submission (e.g., 60 days), either party may initiate formal proceedings.</li>
    <li><strong>Alternative Dispute Resolution:</strong> ASCENDynamics may offer the option of resolving disputes through binding arbitration or small claims court, instead of in courts of general jurisdiction.</li>
  </ul>

  <h3>12. International Use</h3>

  <h4>International Laws</h4>
  <ul>
    <li><strong>Compliance with Local Laws:</strong> The ASCENDynamics platform is controlled and operated from our facilities in the United States. We make no representations that the platform is appropriate or available for use in other locations. Those who access or use the platform from other jurisdictions do so at their own volition and are entirely responsible for compliance with all applicable local laws and regulations, including but not limited to export and import regulations. You should not use the platform in a manner prohibited by law.</li>
  </ul>

  <h3>13. Miscellaneous</h3>

  <h4>Severability</h4>
  <ul>
    <li><strong>Validity of Remaining Provisions:</strong> If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason by any court of competent jurisdiction, such provision shall be modified to the extent necessary to make it enforceable while maintaining its intent as closely as possible. If such modification is not possible, the provision shall be severed from these Terms. The invalidity or unenforceability of any provision of these Terms shall not affect the validity or enforceability of any other provision of these Terms, which shall remain in full force and effect.</li>
  </ul>

  <h4>Entire Agreement</h4>
  <ul>
    <li><strong>Complete Understanding:</strong> These Terms, together with any amendments and any additional agreements you may enter into with ASCENDynamics in connection with the platform, shall constitute the entire agreement between you and ASCENDynamics concerning the platform. These Terms supersede and replace any prior agreements or understandings between you and ASCENDynamics regarding the platform.</li>
    <li><strong>No Oral Modifications:</strong> No modification, amendment, or waiver of any provision of these Terms shall be effective unless in writing and signed by the authorized representative of ASCENDynamics. Any oral agreement or arrangement made between you and any employee or representative of ASCENDynamics shall not be considered a modification or a waiver of these Terms.</li>
  </ul>

  <h3>14. Contact Information</h3>

  <h4>Contact Details</h4>
  <ul>
    <li><strong>General Inquiries:</strong> For any questions or concerns regarding these Terms of Use or any other aspects of your experience with the ASCENDynamics platform, please contact us at:</li>
    <ul>
      <li><strong>Email:</strong> support@ascendynamics.org</li>
      <li><strong>Mailing Address:</strong> ASCENDynamics NFP, 7649 W Irving Park Rd #N1, Illinois, USA 60706</li>
      <li><strong>Phone:</strong></li>
    </ul>
    <li><strong>Support Hours:</strong> Our support team is available Monday, Wednesday, Friday, 9 AM to 5 PM CST.</li>
    <li><strong>Response Time:</strong> We aim to respond to all inquiries within one week during our regular business hours.</li>
    <li><strong>Additional Support:</strong> For more immediate assistance, please visit our <a href="https://join.slack.com/t/ascendynamicsnfp/shared_invite/zt-1yqcw1hqa-slT2gWkBEkLOTRnN8zEqdQ">Slack</a> community.</li>
  </ul>

  <h3>15. Acknowledgement and Acceptance of Terms</h3>

  <h4>User Acknowledgement</h4>
  <ul>
    <li><strong>Agreement to Terms:</strong> By creating an account, accessing, or using the ASCENDynamics platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and any future amendments and additions to these Terms as published from time to time on the platform.</li>
    <li><strong>Informed Consent:</strong> You acknowledge that you have been given the opportunity to discuss any questions or concerns about these Terms with ASCENDynamics representatives prior to acceptance.</li>
    <li><strong>Continued Acceptance:</strong> Your continued use of the platform after any modifications or updates to these Terms are made will constitute your acceptance of such changes and agreement to be bound by the updated Terms.</li>
    <li><strong>Legal Capacity:</strong> You affirm that you are of legal age and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms, and to abide by and comply with these Terms.</li>
  </ul>`;
  }
  get contentAsHtml() {
    if (this.content === "privacyPolicy") {
      return this.privacyPolicy;
    } else if (this.content === "termsOfUse") {
      return this.termsOfUse;
    }
    return "";
  }
  dismiss() {
    this.modalController.dismiss();
  }
}
_LegalModalComponent = LegalModalComponent;
_LegalModalComponent.ɵfac = function LegalModalComponent_Factory(t) {
  return new (t || _LegalModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_1__.ModalController));
};
_LegalModalComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _LegalModalComponent,
  selectors: [["app-legal-modal"]],
  inputs: {
    content: "content"
  },
  standalone: true,
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
  decls: 9,
  vars: 1,
  consts: [["slot", "end"], [3, "click"], [3, "innerHTML"]],
  template: function LegalModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "Legal Document");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "ion-buttons", 0)(5, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function LegalModalComponent_Template_ion_button_click_5_listener() {
        return ctx.dismiss();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "Close");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "ion-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("innerHTML", ctx.contentAsHtml, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeHtml"]);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonicModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_1__.IonToolbar],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbGVnYWwtbW9kYWwvbGVnYWwtbW9kYWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ })

}]);
//# sourceMappingURL=src_app_modules_auth_auth_module_ts.js.map