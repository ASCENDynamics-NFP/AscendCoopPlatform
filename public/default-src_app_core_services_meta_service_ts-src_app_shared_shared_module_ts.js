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

/***/ 4815:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/pagination/pagination.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PaginationComponent: () => (/* binding */ PaginationComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 5536);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 9191);
var _PaginationComponent;
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





function PaginationComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ion-text");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const range_r1 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate3"](" ", range_r1.start, "-", range_r1.end, " of ", range_r1.total, " ");
  }
}
function PaginationComponent_ng_container_3_ion_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_ng_container_3_ion_button_4_Template_ion_button_click_0_listener() {
      const page_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.goToPage(page_r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const pageData_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("color", pageData_r6.currentPage === page_r5 ? "primary" : "medium");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", page_r5, " ");
  }
}
function PaginationComponent_ng_container_3_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ion-text");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "...");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ion-button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_ng_container_3_ng_container_5_Template_ion_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7);
      const pageData_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.goToPage(pageData_r6.totalPages));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pageData_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", pageData_r6.currentPage === pageData_r6.totalPages);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", pageData_r6.totalPages, " ");
  }
}
function PaginationComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 4)(2, "ion-button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_ng_container_3_Template_ion_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.previousPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "ion-icon", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, PaginationComponent_ng_container_3_ion_button_4_Template, 2, 2, "ion-button", 7)(5, PaginationComponent_ng_container_3_ng_container_5_Template, 5, 2, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ion-button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_ng_container_3_Template_ion_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r2.nextPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "ion-icon", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pageData_r6 = ctx.ngIf;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", pageData_r6.currentPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", pageData_r6.pageNumbers);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", pageData_r6.totalPages > ctx_r2.maxVisiblePages && pageData_r6.pageNumbers.length && pageData_r6.pageNumbers[pageData_r6.pageNumbers.length - 1] < pageData_r6.totalPages);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", pageData_r6.currentPage === pageData_r6.totalPages);
  }
}
class PaginationComponent {
  constructor() {
    this.pageSize = 20;
    this.maxVisiblePages = 5;
    this.pageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.currentPageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(1);
    this.currentPage$ = this.currentPageSubject.asObservable();
  }
  ngOnInit() {
    this.initializePagination();
  }
  ngOnChanges(changes) {
    if (changes["totalItems"] || changes["pageSize"]) {
      this.initializePagination();
    }
  }
  initializePagination() {
    // Calculate total pages
    this.totalPages$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.totalItems).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(() => Math.ceil(this.totalItems / this.pageSize)));
    // Generate page numbers
    this.pageNumbers$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.combineLatest)([this.currentPage$, this.totalPages$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(([currentPage, totalPages]) => {
      let startPage = Math.max(1, currentPage - Math.floor(this.maxVisiblePages / 2));
      let endPage = startPage + this.maxVisiblePages - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
      }
      return Array.from({
        length: endPage - startPage + 1
      }, (_, i) => startPage + i);
    }));
    // Calculate page range
    this.currentPageRange$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.combineLatest)([this.currentPage$, this.totalPages$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(([currentPage, totalPages]) => {
      const start = (currentPage - 1) * this.pageSize + 1;
      const end = Math.min(currentPage * this.pageSize, this.totalItems);
      return {
        start,
        end,
        total: this.totalItems
      };
    }));
    // Combine pagination data
    this.pagination$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.combineLatest)([this.currentPage$, this.totalPages$, this.pageNumbers$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(([currentPage, totalPages, pageNumbers]) => ({
      currentPage,
      totalPages,
      pageNumbers
    })));
  }
  goToPage(page) {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.currentPageSubject.next(page);
      this.pageChange.emit(page);
    }
  }
  nextPage() {
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage < Math.ceil(this.totalItems / this.pageSize)) {
      this.goToPage(currentPage + 1);
    }
  }
  previousPage() {
    const currentPage = this.currentPageSubject.getValue();
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }
}
_PaginationComponent = PaginationComponent;
_PaginationComponent.ɵfac = function PaginationComponent_Factory(t) {
  return new (t || _PaginationComponent)();
};
_PaginationComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _PaginationComponent,
  selectors: [["app-pagination"]],
  inputs: {
    totalItems: "totalItems",
    pageSize: "pageSize",
    maxVisiblePages: "maxVisiblePages"
  },
  outputs: {
    pageChange: "pageChange"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"]],
  decls: 5,
  vars: 6,
  consts: [[1, "pagination-toolbar"], ["class", "pagination-range", 4, "ngIf"], [4, "ngIf"], [1, "pagination-range"], [1, "pagination-controls"], ["fill", "clear", 3, "click", "disabled"], ["name", "chevron-back-outline"], ["fill", "clear", 3, "color", "click", 4, "ngFor", "ngForOf"], ["name", "chevron-forward-outline"], ["fill", "clear", 3, "click", "color"]],
  template: function PaginationComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-toolbar", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PaginationComponent_ng_container_1_Template, 3, 3, "ng-container", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, PaginationComponent_ng_container_3_Template, 8, 4, "ng-container", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx.currentPageRange$));
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 4, ctx.pagination$));
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonToolbar, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.pagination-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column; \n\n  justify-content: center; \n\n  align-items: center; \n\n  padding: 0.5rem 1rem;\n  gap: 0.5rem; \n\n  width: 100%;\n  box-sizing: border-box;\n  text-align: center;\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-range[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: var(--ion-color-medium);\n  text-align: center;\n  width: 100%;\n  margin-bottom: 0.5rem;\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem; \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --background: transparent;\n  --color: var(--ion-color-primary);\n  font-size: 1rem;\n  padding: 0.2rem 0.5rem;\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button.active[_ngcontent-%COMP%] {\n  --color: var(--ion-color-primary);\n  font-weight: bold;\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]:hover {\n  --color: var(--ion-color-primary-shade);\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n  color: var(--ion-color-primary);\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%] {\n  margin: 0 0.5rem;\n  white-space: nowrap;\n  color: var(--ion-color-medium);\n}\n\n\n\n@media (max-width: 768px) {\n  .pagination-toolbar[_ngcontent-%COMP%] {\n    gap: 0.8rem;\n  }\n  .pagination-controls[_ngcontent-%COMP%] {\n    display: none; \n\n  }\n  .pagination-range[_ngcontent-%COMP%] {\n    margin-bottom: 0; \n\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFtQkE7RUFDRSxhQUFBO0VBQ0Esc0JBQUEsRUFBQSx3Q0FBQTtFQUNBLHVCQUFBLEVBQUEsOEJBQUE7RUFDQSxtQkFBQSxFQUFBLGdDQUFBO0VBQ0Esb0JBQUE7RUFDQSxXQUFBLEVBQUEsOENBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtBQUNGO0FBQ0U7RUFDRSxpQkFBQTtFQUNBLDhCQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0VBQ0EscUJBQUE7QUFDSjtBQUVFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxXQUFBLEVBQUEscUNBQUE7QUFBSjtBQUdFO0VBQ0UseUJBQUE7RUFDQSxpQ0FBQTtFQUNBLGVBQUE7RUFDQSxzQkFBQTtBQURKO0FBR0k7RUFDRSxpQ0FBQTtFQUNBLGlCQUFBO0FBRE47QUFJSTtFQUNFLHVDQUFBO0FBRk47QUFNRTtFQUNFLGlCQUFBO0VBQ0EsK0JBQUE7QUFKSjtBQU9FO0VBQ0UsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0FBTEo7O0FBU0EsOENBQUE7QUFDQTtFQUNFO0lBQ0UsV0FBQTtFQU5GO0VBU0E7SUFDRSxhQUFBLEVBQUEsNkJBQUE7RUFQRjtFQVVBO0lBQ0UsZ0JBQUEsRUFBQSxtQkFBQTtFQVJGO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi5wYWdpbmF0aW9uLXRvb2xiYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyAvKiBTdGFjayByYW5nZSBhbmQgY29udHJvbHMgdmVydGljYWxseSAqL1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgLyogQ2VudGVyIGNvbnRlbnQgdmVydGljYWxseSAqL1xuICBhbGlnbi1pdGVtczogY2VudGVyOyAvKiBDZW50ZXIgY29udGVudCBob3Jpem9udGFsbHkgKi9cbiAgcGFkZGluZzogMC41cmVtIDFyZW07XG4gIGdhcDogMC41cmVtOyAvKiBBZGp1c3Qgc3BhY2luZyBiZXR3ZWVuIHJhbmdlIGFuZCBjb250cm9scyAqL1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gIC5wYWdpbmF0aW9uLXJhbmdlIHtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLW1lZGl1bSk7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbiAgfVxuXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgZ2FwOiAwLjVyZW07IC8qIFNwYWNlIGJldHdlZW4gcGFnaW5hdGlvbiBidXR0b25zICovXG4gIH1cblxuICAucGFnaW5hdGlvbi1jb250cm9scyBpb24tYnV0dG9uIHtcbiAgICAtLWJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIC0tY29sb3I6IHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbiAgICBmb250LXNpemU6IDFyZW07XG4gICAgcGFkZGluZzogMC4ycmVtIDAuNXJlbTtcblxuICAgICYuYWN0aXZlIHtcbiAgICAgIC0tY29sb3I6IHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgLS1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnktc2hhZGUpO1xuICAgIH1cbiAgfVxuXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIGlvbi1pY29uIHtcbiAgICBmb250LXNpemU6IDEuNHJlbTtcbiAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICB9XG5cbiAgLnBhZ2luYXRpb24tY29udHJvbHMgaW9uLXRleHQge1xuICAgIG1hcmdpbjogMCAwLjVyZW07XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLW1lZGl1bSk7XG4gIH1cbn1cblxuLyogSGlkZSBwYWdpbmF0aW9uIGNvbnRyb2xzIG9uIHNtYWxsIHNjcmVlbnMgKi9cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAucGFnaW5hdGlvbi10b29sYmFyIHtcbiAgICBnYXA6IDAuOHJlbTtcbiAgfVxuXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIHtcbiAgICBkaXNwbGF5OiBub25lOyAvKiBIaWRlIHBhZ2luYXRpb24gY29udHJvbHMgKi9cbiAgfVxuXG4gIC5wYWdpbmF0aW9uLXJhbmdlIHtcbiAgICBtYXJnaW4tYm90dG9tOiAwOyAvKiBBZGp1c3Qgc3BhY2luZyAqL1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 7353);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/account/components/create-group-modal/create-group-modal.component */ 8517);
/* harmony import */ var _components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/feedback-modal/feedback-modal.component */ 261);
/* harmony import */ var _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/user-menu/user-menu.component */ 6585);
/* harmony import */ var _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/image-upload-modal/image-upload-modal.component */ 861);
/* harmony import */ var _components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/pagination/pagination.component */ 4815);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
var _SharedModule;












class SharedModule {}
_SharedModule = SharedModule;
_SharedModule.ɵfac = function SharedModule_Factory(t) {
  return new (t || _SharedModule)();
};
_SharedModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
  type: _SharedModule
});
_SharedModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
  imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](SharedModule, {
    declarations: [_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__.AppHeaderComponent, _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__.CreateGroupModalComponent, _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__.FeedbackModalComponent, _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__.ImageUploadModalComponent, _components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__.UserMenuComponent],
    imports: [_ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLinkActive, _angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule],
    exports: [_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_1__.AppHeaderComponent, _modules_account_components_create_group_modal_create_group_modal_component__WEBPACK_IMPORTED_MODULE_0__.CreateGroupModalComponent, _components_feedback_modal_feedback_modal_component__WEBPACK_IMPORTED_MODULE_2__.FeedbackModalComponent, _components_image_upload_modal_image_upload_modal_component__WEBPACK_IMPORTED_MODULE_4__.ImageUploadModalComponent, _components_user_menu_user_menu_component__WEBPACK_IMPORTED_MODULE_3__.UserMenuComponent, _components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=default-src_app_core_services_meta_service_ts-src_app_shared_shared_module_ts.js.map