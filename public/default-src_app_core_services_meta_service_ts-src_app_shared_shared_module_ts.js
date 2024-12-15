"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts"],{

/***/ 6369:
/*!***********************************************!*\
  !*** ./src/app/core/services/meta.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MetaService: () => (/* binding */ MetaService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 4199);
var _MetaService;


class MetaService {
  constructor(titleService, metaService) {
    this.titleService = titleService;
    this.metaService = metaService;
  }
  /**
   * Updates meta tags for a page
   * @param title - Page title
   * @param description - Meta description
   * @param keywords - Meta keywords
   * @param ogData - Open Graph data including title, description, and URL
   * @param twitterData - Twitter Card metadata
   */
  updateMetaTags(title, description, keywords, ogData, twitterData) {
    // Set title
    this.titleService.setTitle(title);
    // Update standard meta tags
    if (description && description.trim()) {
      this.metaService.updateTag({
        name: "description",
        content: description
      });
    }
    this.metaService.updateTag({
      name: "keywords",
      content: keywords
    });
    // Update Open Graph meta tags
    if (ogData.title && ogData.title.length <= 60) {
      this.metaService.updateTag({
        property: "og:title",
        content: ogData.title
      });
    } else {
      console.warn("Open Graph title exceeds recommended length (60 characters).");
    }
    this.metaService.updateTag({
      property: "og:description",
      content: ogData.description
    });
    this.metaService.updateTag({
      property: "og:url",
      content: ogData.url
    });
    if (ogData.image) {
      this.metaService.updateTag({
        property: "og:image",
        content: ogData.image
      });
    }
    // Update Twitter Card meta tags if provided
    if (twitterData) {
      this.metaService.updateTag({
        name: "twitter:card",
        content: twitterData.card
      });
      this.metaService.updateTag({
        name: "twitter:title",
        content: twitterData.title
      });
      this.metaService.updateTag({
        name: "twitter:description",
        content: twitterData.description
      });
      if (twitterData.image) {
        this.metaService.updateTag({
          name: "twitter:image",
          content: twitterData.image
        });
      }
    }
  }
  /**
   * Clears all meta tags (optional, for dynamic pages)
   */
  clearMetaTags() {
    const metaTags = ["description", "keywords", "og:title", "og:description", "og:url", "og:image", "twitter:card", "twitter:title", "twitter:description", "twitter:image"];
    metaTags.forEach(tag => {
      this.metaService.removeTag(`name='${tag}', property='${tag}'`);
    });
  }
}
_MetaService = MetaService;
_MetaService.ɵfac = function MetaService_Factory(t) {
  return new (t || _MetaService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.Title), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.Meta));
};
_MetaService.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
  token: _MetaService,
  factory: _MetaService.ɵfac,
  providedIn: "root"
});

/***/ }),

/***/ 8245:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/app-header/app-header.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppHeaderComponent: () => (/* binding */ AppHeaderComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../user-menu/user-menu.component */ 6585);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 7353);

var _AppHeaderComponent;









function AppHeaderComponent_ion_back_button_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "ion-back-button", 9);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("defaultHref", ctx_r0.defaultHref);
  }
}
function AppHeaderComponent_img_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 10);
  }
}
function AppHeaderComponent_ion_avatar_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-avatar", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AppHeaderComponent_ion_avatar_9_Template_ion_avatar_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r2);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r0.presentPopover($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, ctx_r0.image), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
  }
}
function AppHeaderComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, " Login ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "ion-button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, " Sign Up ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
class AppHeaderComponent {
  constructor(popoverController, store) {
    this.popoverController = popoverController;
    this.store = store;
    this.title = "ASCENDynamics NFP";
    this.showLogo = false;
    // Initialize authUser$ after store is available
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAuthUser);
  }
  get image() {
    var _this$authUser$;
    return (_this$authUser$ = this.authUser$) === null || _this$authUser$ === void 0 ? void 0 : _this$authUser$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(user => user === null || user === void 0 ? void 0 : user.iconImage));
  }
  presentPopover(ev) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.popoverEvent = ev;
      const popover = yield _this.popoverController.create({
        component: _user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_1__.UserMenuComponent,
        componentProps: {
          authUser$: _this.authUser$ // Pass authUser$ as before
        },
        event: ev,
        translucent: true
      });
      return popover.present();
    })();
  }
  onPopoverDismiss(_event) {
    // Handle popover dismiss if needed
  }
}
_AppHeaderComponent = AppHeaderComponent;
_AppHeaderComponent.ɵfac = function AppHeaderComponent_Factory(t) {
  return new (t || _AppHeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.PopoverController), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_6__.Store));
};
_AppHeaderComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _AppHeaderComponent,
  selectors: [["app-header"]],
  inputs: {
    title: "title",
    defaultHref: "defaultHref",
    showLogo: "showLogo"
  },
  decls: 13,
  vars: 7,
  consts: [["notLoggedIn", ""], ["slot", "start", 1, "toolbar-buttons"], ["color", "primary"], ["color", "primary", 3, "defaultHref", 4, "ngIf"], [1, "toolbar-content"], ["src", "assets/icon/logo.png", "alt", "ASCENDynamics Logo", "class", "toolbar-logo", 4, "ngIf"], ["translate", "", 1, "header-title"], ["slot", "end", 1, "toolbar-buttons"], ["class", "padded-avatar", 3, "click", 4, "ngIf", "ngIfElse"], ["color", "primary", 3, "defaultHref"], ["src", "assets/icon/logo.png", "alt", "ASCENDynamics Logo", 1, "toolbar-logo"], [1, "padded-avatar", 3, "click"], ["alt", "User Avatar", 3, "src"], ["routerLink", "/auth/login", "color", "primary", "fill", "outline"], ["routerLink", "/auth/signup", "color", "primary", "fill", "solid"]],
  template: function AppHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-toolbar")(1, "ion-buttons", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "ion-menu-button", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, AppHeaderComponent_ion_back_button_3_Template, 1, 1, "ion-back-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, AppHeaderComponent_img_5_Template, 1, 0, "img", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-title", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "ion-buttons", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, AppHeaderComponent_ion_avatar_9_Template, 3, 3, "ion-avatar", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](10, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](11, AppHeaderComponent_ng_template_11_Template, 4, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      const notLoggedIn_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](12);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.defaultHref);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showLogo);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx.title);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](10, 5, ctx.image && ctx.authUser$))("ngIfElse", notLoggedIn_r3);
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonAvatar, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonMenuButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonBackButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.RouterLinkDelegate, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateDirective, _angular_common__WEBPACK_IMPORTED_MODULE_8__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 8px; \n\n}\n\n.toolbar-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px; \n\n  flex-grow: 1; \n\n  color: var(--ion-color-primary);\n}\n\n.toolbar-logo[_ngcontent-%COMP%] {\n  height: 30px;\n  margin-right: -20px;\n}\n\n.header-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 500;\n  letter-spacing: 0.0125em;\n  white-space: nowrap; \n\n}\n\n.toolbar-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px; \n\n}\n\n.padded-avatar[_ngcontent-%COMP%] {\n  max-height: 40px;\n  max-width: 40px;\n  margin: 3px 15px 3px 3px;\n  border: 2px solid #e87121;\n}\n\nion-title[_ngcontent-%COMP%] {\n  margin: 0; \n\n}\n\nion-buttons[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --padding-start: 8px;\n  --padding-end: 8px;\n  --border-radius: 20px;\n}\n\n@media (max-width: 500px) {\n  .toolbar-logo[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvYXBwLWhlYWRlci9hcHAtaGVhZGVyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFvQkE7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUEsRUFBQSw0QkFBQTtBQUFGOztBQUdBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQSxFQUFBLG1DQUFBO0VBQ0EsWUFBQSxFQUFBLDBEQUFBO0VBQ0EsK0JBQUE7QUFBRjs7QUFHQTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtBQUFGOztBQUdBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLHdCQUFBO0VBQ0EsbUJBQUEsRUFBQSwwQkFBQTtBQUFGOztBQUdBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQSxFQUFBLG9DQUFBO0FBQUY7O0FBR0E7RUFDRSxnQkFBQTtFQUNBLGVBQUE7RUFDQSx3QkFBQTtFQUNBLHlCQUFBO0FBQUY7O0FBR0E7RUFDRSxTQUFBLEVBQUEsOEJBQUE7QUFBRjs7QUFHQTtFQUNFLG9CQUFBO0VBQ0Esa0JBQUE7RUFDQSxxQkFBQTtBQUFGOztBQUdBO0VBQ0U7SUFDRSxhQUFBO0VBQUY7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pb24tdG9vbGJhciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMCA4cHg7IC8qIEFkZCBwYWRkaW5nIGZvciBzcGFjaW5nICovXG59XG5cbi50b29sYmFyLWNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDsgLyogU3BhY2luZyBiZXR3ZWVuIGxvZ28gYW5kIHRpdGxlICovXG4gIGZsZXgtZ3JvdzogMTsgLyogVGFrZSB1cCBhdmFpbGFibGUgc3BhY2UgYmV0d2VlbiBzdGFydCBhbmQgZW5kIGJ1dHRvbnMgKi9cbiAgY29sb3I6IHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbn1cblxuLnRvb2xiYXItbG9nbyB7XG4gIGhlaWdodDogMzBweDtcbiAgbWFyZ2luLXJpZ2h0OiAtMjBweDtcbn1cblxuLmhlYWRlci10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDEyNWVtO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwOyAvKiBQcmV2ZW50IHRleHQgd3JhcHBpbmcgKi9cbn1cblxuLnRvb2xiYXItYnV0dG9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogOHB4OyAvKiBTcGFjaW5nIGJldHdlZW4gYnV0dG9ucy9hdmF0YXJzICovXG59XG5cbi5wYWRkZWQtYXZhdGFyIHtcbiAgbWF4LWhlaWdodDogNDBweDtcbiAgbWF4LXdpZHRoOiA0MHB4O1xuICBtYXJnaW46IDNweCAxNXB4IDNweCAzcHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNlODcxMjE7XG59XG5cbmlvbi10aXRsZSB7XG4gIG1hcmdpbjogMDsgLyogUmVzZXQgYW55IGRlZmF1bHQgbWFyZ2lucyAqL1xufVxuXG5pb24tYnV0dG9ucyBpb24tYnV0dG9uIHtcbiAgLS1wYWRkaW5nLXN0YXJ0OiA4cHg7XG4gIC0tcGFkZGluZy1lbmQ6IDhweDtcbiAgLS1ib3JkZXItcmFkaXVzOiAyMHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTAwcHgpIHtcbiAgLnRvb2xiYXItbG9nbyB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 861:
/*!**************************************************************************************!*\
  !*** ./src/app/shared/components/image-upload-modal/image-upload-modal.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ImageUploadModalComponent: () => (/* binding */ ImageUploadModalComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_image_upload_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/image-upload.service */ 7421);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ 4199);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);

var _ImageUploadModalComponent;





function ImageUploadModalComponent_img_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 9);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx_r0.imagePreviewString, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
  }
}
class ImageUploadModalComponent {
  constructor(imageUploadService, modalCtrl, sanitizer) {
    this.imageUploadService = imageUploadService;
    this.modalCtrl = modalCtrl;
    this.sanitizer = sanitizer;
    this.selectedFile = null;
  }
  get imagePreviewString() {
    return this.imagePreview;
  }
  onImageSelected(event) {
    const file = event.target.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      const unsafeImageUrl = reader.result;
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    };
    reader.readAsDataURL(file);
  }
  uploadImage() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (_this.selectedFile) {
          const downloadURL = yield _this.imageUploadService.uploadImage(_this.selectedFile, _this.firestoreLocation, _this.collectionName, _this.docId, _this.imageWidth, _this.imageHeight, _this.fieldName);
          _this.modalCtrl.dismiss(downloadURL);
        } else {
          console.error("No file selected for upload.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    })();
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }
}
_ImageUploadModalComponent = ImageUploadModalComponent;
_ImageUploadModalComponent.ɵfac = function ImageUploadModalComponent_Factory(t) {
  return new (t || _ImageUploadModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_core_services_image_upload_service__WEBPACK_IMPORTED_MODULE_1__.ImageUploadService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__.DomSanitizer));
};
_ImageUploadModalComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _ImageUploadModalComponent,
  selectors: [["app-image-upload-modal"]],
  inputs: {
    collectionName: "collectionName",
    docId: "docId",
    firestoreLocation: "firestoreLocation",
    imageHeight: "imageHeight",
    imageWidth: "imageWidth",
    fieldName: "fieldName"
  },
  decls: 19,
  vars: 1,
  consts: [["slot", "end"], [3, "click"], [1, "ion-padding"], [2, "height", "100%"], [1, "ion-align-items-center", 2, "flex", "1"], ["size", "12", 1, "ion-text-center"], ["type", "file", 3, "change"], ["alt", "Image Preview", "style", "max-width: 100%; max-height: 70vh", 3, "src", 4, "ngIf"], ["expand", "full", 3, "click"], ["alt", "Image Preview", 2, "max-width", "100%", "max-height", "70vh", 3, "src"]],
  template: function ImageUploadModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "Upload Image");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-buttons", 0)(5, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ImageUploadModalComponent_Template_ion_button_click_5_listener() {
        return ctx.closeModal();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "Close");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "ion-content", 2)(8, "ion-grid", 3)(9, "ion-row", 4)(10, "ion-col", 5)(11, "ion-item")(12, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, "Select Image");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "ion-input", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function ImageUploadModalComponent_Template_ion_input_change_14_listener($event) {
        return ctx.onImageSelected($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, ImageUploadModalComponent_img_15_Template, 1, 1, "img", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "ion-footer")(17, "ion-button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ImageUploadModalComponent_Template_ion_button_click_17_listener() {
        return ctx.uploadImage();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18, "Upload");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.imagePreview);
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonFooter, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.TextValueAccessor, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvaW1hZ2UtdXBsb2FkLW1vZGFsL2ltYWdlLXVwbG9hZC1tb2RhbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 6585:
/*!********************************************************************!*\
  !*** ./src/app/shared/components/user-menu/user-menu.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserMenuComponent: () => (/* binding */ UserMenuComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../state/actions/auth.actions */ 2345);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 5167);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ 5480);

var _UserMenuComponent;






class UserMenuComponent {
  constructor(router, popoverCtrl, store) {
    this.router = router;
    this.popoverCtrl = popoverCtrl;
    this.store = store;
  }
  logout() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this.popoverCtrl.dismiss(); // Await the popover dismissal
      _this.store.dispatch(_state_actions_auth_actions__WEBPACK_IMPORTED_MODULE_1__.signOut());
    })();
  }
  goToProfile() {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield _this2.popoverCtrl.dismiss();
        const user = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this2.authUser$);
        if (user !== null && user !== void 0 && user.uid) {
          _this2.router.navigate([`/account/${user.uid}`]);
        }
      } catch (error) {
        console.error("Error navigating to profile:", error);
      }
    })();
  }
  goToSettings() {
    var _this3 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3.popoverCtrl.dismiss(); // Await the popover dismissal
      _this3.router.navigate(["/account/settings"]);
    })();
  }
}
_UserMenuComponent = UserMenuComponent;
_UserMenuComponent.ɵfac = function UserMenuComponent_Factory(t) {
  return new (t || _UserMenuComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.PopoverController), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_6__.Store));
};
_UserMenuComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
  type: _UserMenuComponent,
  selectors: [["app-user-menu"]],
  inputs: {
    authUser$: "authUser$"
  },
  decls: 13,
  vars: 0,
  consts: [[3, "click"], ["aria-hidden", "true", "slot", "start", "ios", "person-outline", "md", "person-outline"], ["aria-hidden", "true", "slot", "start", "ios", "settings-outline", "md", "settings-outline"], ["aria-hidden", "true", "slot", "start", "ios", "log-out-outline", "md", "log-out-outline"]],
  template: function UserMenuComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "ion-list")(1, "ion-item", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserMenuComponent_Template_ion_item_click_1_listener() {
        return ctx.goToProfile();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3, "Profile");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "ion-icon", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "ion-item", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserMenuComponent_Template_ion_item_click_5_listener() {
        return ctx.goToSettings();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7, "Settings");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "ion-icon", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "ion-item", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function UserMenuComponent_Template_ion_item_click_9_listener() {
        return ctx.logout();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Logout");
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "ion-icon", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.IonList],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-list[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvdXNlci1tZW51L3VzZXItbWVudS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsZUFBQTtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pb24tbGlzdCB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 3887:
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedModule: () => (/* binding */ SharedModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/account/components/create-group-modal/create-group-modal.component */ 8517);
/* harmony import */ var _components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/feedback-modal/feedback-modal.component */ 261);
/* harmony import */ var _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/user-menu/user-menu.component */ 6585);
/* harmony import */ var _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/image-upload-modal/image-upload-modal.component */ 861);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6623);
var _SharedModule;











class SharedModule {}
_SharedModule = SharedModule;
_SharedModule.ɵfac = function SharedModule_Factory(t) {
  return new (t || _SharedModule)();
};
_SharedModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
  type: _SharedModule
});
_SharedModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
  imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](SharedModule, {
    declarations: [_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__.AppHeaderComponent, _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__.CreateGroupModalComponent, _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__.FeedbackModalComponent, _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__.ImageUploadModalComponent, _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__.UserMenuComponent],
    imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterLinkActive, _angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule],
    exports: [_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__.AppHeaderComponent, _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__.CreateGroupModalComponent, _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__.FeedbackModalComponent, _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__.ImageUploadModalComponent, _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__.UserMenuComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts.js.map