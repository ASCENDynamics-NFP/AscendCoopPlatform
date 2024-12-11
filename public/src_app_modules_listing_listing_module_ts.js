"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_modules_listing_listing_module_ts"],{

/***/ 3302:
/*!***********************************************************************************!*\
  !*** ./src/app/modules/listing/components/listing-form/listing-form.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingFormComponent: () => (/* binding */ ListingFormComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/firestore */ 1342);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 3782);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 1969);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 1082);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 1856);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 5117);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/actions/account.actions */ 8314);
/* harmony import */ var _state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../state/selectors/account.selectors */ 8686);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ionic/angular */ 1116);
var _ListingFormComponent;
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












function ListingFormComponent_ng_container_1_ion_note_10_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Title is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_10_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Title must be at least 3 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_10_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Title cannot exceed 100 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ListingFormComponent_ng_container_1_ion_note_10_span_1_Template, 2, 0, "span", 1)(2, ListingFormComponent_ng_container_1_ion_note_10_span_2_Template, 2, 0, "span", 1)(3, ListingFormComponent_ng_container_1_ion_note_10_span_3_Template, 2, 0, "span", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["minlength"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["maxlength"]);
  }
}
function ListingFormComponent_ng_container_1_ion_note_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Organization is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_13_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Organization must be at least 2 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_13_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Organization cannot exceed 100 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ListingFormComponent_ng_container_1_ion_note_13_span_1_Template, 2, 0, "span", 1)(2, ListingFormComponent_ng_container_1_ion_note_13_span_2_Template, 2, 0, "span", 1)(3, ListingFormComponent_ng_container_1_ion_note_13_span_3_Template, 2, 0, "span", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["minlength"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["maxlength"]);
  }
}
function ListingFormComponent_ng_container_1_ion_select_option_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-select-option", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const type_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", type_r2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 2, type_r2), " ");
  }
}
function ListingFormComponent_ng_container_1_ion_note_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Listing type is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_27_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Description is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_27_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Description must be at least 10 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_27_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Description cannot exceed 1000 characters. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ListingFormComponent_ng_container_1_ion_note_27_span_1_Template, 2, 0, "span", 1)(2, ListingFormComponent_ng_container_1_ion_note_27_span_2_Template, 2, 0, "span", 1)(3, ListingFormComponent_ng_container_1_ion_note_27_span_3_Template, 2, 0, "span", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["minlength"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["maxlength"]);
  }
}
function ListingFormComponent_ng_container_1_ion_note_37_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Hours per week is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_37_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Minimum is 1 hour. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_37_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Maximum is 168 hours. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ListingFormComponent_ng_container_1_ion_note_37_span_1_Template, 2, 0, "span", 1)(2, ListingFormComponent_ng_container_1_ion_note_37_span_2_Template, 2, 0, "span", 1)(3, ListingFormComponent_ng_container_1_ion_note_37_span_3_Template, 2, 0, "span", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_2_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_3_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["min"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_4_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["max"]);
  }
}
function ListingFormComponent_ng_container_1_ion_note_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Duration is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Schedule is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Start date is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_ion_note_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-note", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " End date must be after start date. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "ion-card")(2, "ion-card-header")(3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Basic Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "ion-card-content")(6, "ion-grid")(7, "ion-row")(8, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "ion-input", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, ListingFormComponent_ng_container_1_ion_note_10_Template, 4, 3, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](12, "ion-input", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](13, ListingFormComponent_ng_container_1_ion_note_13_Template, 4, 3, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "ion-row")(15, "ion-col", 4)(16, "ion-select", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, ListingFormComponent_ng_container_1_ion_select_option_17_Template, 3, 4, "ion-select-option", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, ListingFormComponent_ng_container_1_ion_note_18_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "ion-col", 4)(20, "ion-item", 10)(21, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "Remote Position Available");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](23, "ion-toggle", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "ion-row")(25, "ion-col", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](26, "ion-textarea", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](27, ListingFormComponent_ng_container_1_ion_note_27_Template, 4, 3, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "ion-card")(29, "ion-card-header")(30, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, "Time Commitment");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "ion-card-content", 14)(33, "ion-grid")(34, "ion-row")(35, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](36, "ion-input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](37, ListingFormComponent_ng_container_1_ion_note_37_Template, 4, 3, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](38, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](39, "ion-input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, ListingFormComponent_ng_container_1_ion_note_40_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](41, "ion-row")(42, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](43, "ion-input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](44, ListingFormComponent_ng_container_1_ion_note_44_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](45, "ion-row")(46, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](47, "ion-datetime", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](48, ListingFormComponent_ng_container_1_ion_note_48_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](49, "ion-col", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](50, "ion-datetime", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](51, ListingFormComponent_ng_container_1_ion_note_51_Template, 2, 0, "ion-note", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](52, "ion-row")(53, "ion-col")(54, "ion-item", 10)(55, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](56, "Flexible Schedule");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](57, "ion-toggle", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_20_0;
    let tmp_21_0;
    let tmp_23_0;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_1_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_1_0.touched))("ion-valid", (tmp_2_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_2_0.valid);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r0.listingForm.get("title")) == null ? null : tmp_3_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_4_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_4_0.touched))("ion-valid", (tmp_5_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_5_0.valid);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_6_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r0.listingForm.get("organization")) == null ? null : tmp_6_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_7_0 = ctx_r0.listingForm.get("type")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r0.listingForm.get("type")) == null ? null : tmp_7_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.listingTypes);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_9_0 = ctx_r0.listingForm.get("type")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx_r0.listingForm.get("type")) == null ? null : tmp_9_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_10_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_10_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_11_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_11_0.invalid) && ((tmp_11_0 = ctx_r0.listingForm.get("description")) == null ? null : tmp_11_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_12_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_12_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_13_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_13_0.invalid) && ((tmp_13_0 = ctx_r0.listingForm.get("timeCommitment.hoursPerWeek")) == null ? null : tmp_13_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_14_0 = ctx_r0.listingForm.get("timeCommitment.duration")) == null ? null : tmp_14_0.invalid) && ((tmp_14_0 = ctx_r0.listingForm.get("timeCommitment.duration")) == null ? null : tmp_14_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_15_0 = ctx_r0.listingForm.get("timeCommitment.duration")) == null ? null : tmp_15_0.invalid) && ((tmp_15_0 = ctx_r0.listingForm.get("timeCommitment.duration")) == null ? null : tmp_15_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_16_0 = ctx_r0.listingForm.get("timeCommitment.schedule")) == null ? null : tmp_16_0.invalid) && ((tmp_16_0 = ctx_r0.listingForm.get("timeCommitment.schedule")) == null ? null : tmp_16_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_17_0 = ctx_r0.listingForm.get("timeCommitment.schedule")) == null ? null : tmp_17_0.invalid) && ((tmp_17_0 = ctx_r0.listingForm.get("timeCommitment.schedule")) == null ? null : tmp_17_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", ((tmp_18_0 = ctx_r0.listingForm.get("timeCommitment.startDate")) == null ? null : tmp_18_0.invalid) && ((tmp_18_0 = ctx_r0.listingForm.get("timeCommitment.startDate")) == null ? null : tmp_18_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("preferWheel", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ((tmp_20_0 = ctx_r0.listingForm.get("timeCommitment.startDate")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx_r0.listingForm.get("timeCommitment.startDate")) == null ? null : tmp_20_0.touched));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵclassProp"]("ion-invalid", (tmp_21_0 = ctx_r0.listingForm.get("timeCommitment")) == null ? null : tmp_21_0.errors == null ? null : tmp_21_0.errors["dateRange"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("preferWheel", false);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", (tmp_23_0 = ctx_r0.listingForm.get("timeCommitment")) == null ? null : tmp_23_0.errors == null ? null : tmp_23_0.errors["dateRange"]);
  }
}
function ListingFormComponent_ng_container_2_div_6_ion_select_option_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-select-option", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const level_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", level_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 2, level_r5), " ");
  }
}
function ListingFormComponent_ng_container_2_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 36)(1, "ion-row")(2, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-col", 39)(5, "ion-select", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, ListingFormComponent_ng_container_2_div_6_ion_select_option_6_Template, 3, 4, "ion-select-option", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-col", 41)(8, "ion-item", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "ion-checkbox", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "ion-col", 43)(13, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_6_Template_ion_button_click_13_listener() {
      const i_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("skills", i_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](14, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r6 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.skillLevels);
  }
}
function ListingFormComponent_ng_container_2_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "ion-row")(2, "ion-col", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-col", 41)(5, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_15_Template_ion_button_click_5_listener() {
      const i_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r7).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("requirements", i_r8));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r8 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formControlName", i_r8);
  }
}
function ListingFormComponent_ng_container_2_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "ion-row")(2, "ion-col", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-col", 41)(5, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_24_Template_ion_button_click_5_listener() {
      const i_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r9).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("responsibilities", i_r10));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r10 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formControlName", i_r10);
  }
}
function ListingFormComponent_ng_container_2_div_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "ion-row")(2, "ion-col", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-col", 41)(5, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_33_Template_ion_button_click_5_listener() {
      const i_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r11).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("benefits", i_r12));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r12 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formControlName", i_r12);
  }
}
function ListingFormComponent_ng_container_2_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 36)(1, "ion-row")(2, "ion-col", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-col", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](5, "ion-input", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-col", 41)(7, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_47_Template_ion_button_click_7_listener() {
      const i_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r13).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("contactInformation.emails", i_r14));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r14 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r14);
  }
}
function ListingFormComponent_ng_container_2_div_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 36)(1, "ion-row")(2, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-input", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-row")(5, "ion-col");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "ion-input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-row")(8, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](9, "ion-input", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "ion-input", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "ion-row")(13, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](14, "ion-input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](16, "ion-input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "ion-row")(18, "ion-col")(19, "ion-item", 10)(20, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](21, "Primary Address");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](22, "ion-checkbox", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "ion-col", 59)(24, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_56_Template_ion_button_click_24_listener() {
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r15).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("contactInformation.addresses", i_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](25, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r16 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r16);
  }
}
function ListingFormComponent_ng_container_2_div_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 36)(1, "ion-row")(2, "ion-col", 41)(3, "ion-select", 60)(4, "ion-select-option", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "Mobile");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-select-option", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Work");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "ion-select-option", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Home");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "ion-col", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](11, "ion-input", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "ion-col", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](13, "ion-input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "ion-col", 41)(15, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_div_65_Template_ion_button_click_15_listener() {
      const i_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r17).index;
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.removeArrayItem("contactInformation.phoneNumbers", i_r18));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](16, "ion-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const i_r18 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r18);
  }
}
function ListingFormComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "ion-card")(2, "ion-card-header")(3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4, "Skills");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "ion-card-content", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, ListingFormComponent_ng_container_2_div_6_Template, 15, 2, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addSkill());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, " Add Skill ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "ion-card")(11, "ion-card-header")(12, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Requirements");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "ion-card-content", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](15, ListingFormComponent_ng_container_2_div_15_Template, 7, 1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addArrayItem("requirements"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18, " Add Requirement ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "ion-card")(20, "ion-card-header")(21, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "Responsibilities");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "ion-card-content", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, ListingFormComponent_ng_container_2_div_24_Template, 7, 1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_25_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addArrayItem("responsibilities"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](26, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](27, " Add Responsibility ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "ion-card")(29, "ion-card-header")(30, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](31, "Benefits");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](32, "ion-card-content", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](33, ListingFormComponent_ng_container_2_div_33_Template, 7, 1, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](34, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_34_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addArrayItem("benefits"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](35, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](36, " Add Benefit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](37, "ion-card")(38, "ion-card-header")(39, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](40, "Contact Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](41, "ion-card-content", 31)(42, "ion-row", 32)(43, "ion-col")(44, "ion-item-divider")(45, "ion-label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](46, "Emails");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](47, ListingFormComponent_ng_container_2_div_47_Template, 9, 1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](48, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_48_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addEmail());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](49, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](50, " Add Email ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](51, "ion-row", 34)(52, "ion-col")(53, "ion-item-divider")(54, "ion-label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](55, "Addresses");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](56, ListingFormComponent_ng_container_2_div_56_Template, 26, 1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](57, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_57_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addAddress());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](58, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](59, " Add Address ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](60, "ion-row", 35)(61, "ion-col")(62, "ion-item-divider")(63, "ion-label", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](64, "Phone Numbers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](65, ListingFormComponent_ng_container_2_div_65_Template, 17, 1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](66, "ion-button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ng_container_2_Template_ion_button_click_66_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r3);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.addPhoneNumber());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](67, "ion-icon", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](68, " Add Phone Number ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("skills").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("requirements").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("responsibilities").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("benefits").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("contactInformation.emails").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("contactInformation.addresses").controls);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r0.getFormArray("contactInformation.phoneNumbers").controls);
  }
}
function ListingFormComponent_ion_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ion_button_5_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r19);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.goToPreviousStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Back ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ion_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ListingFormComponent_ion_button_7_Template_ion_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20);
      const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r0.goToNextStep());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " Next ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingFormComponent_ion_button_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-button", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", (ctx_r0.listing == null ? null : ctx_r0.listing.id) ? "Save Changes" : "Save as Draft", " ");
  }
}
class ListingFormComponent {
  constructor(fb, store) {
    this.fb = fb;
    this.store = store;
    this.listing = null;
    this.formSubmit = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.currentStep = 1; // Start at the first step
    this.authUser = null;
    this.listingTypes = ["volunteer", "job", "internship", "gig"];
    this.skillLevels = ["beginner", "intermediate", "advanced"];
    this.initForm();
  }
  initForm() {
    this.listingForm = this.fb.group({
      title: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.maxLength(100)]],
      description: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.maxLength(1000)]],
      type: ["volunteer", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      organization: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(2)]],
      remote: [false],
      timeCommitment: this.fb.group({
        hoursPerWeek: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(1), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.max(168)]],
        duration: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
        schedule: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
        startDate: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
        endDate: [null],
        isFlexible: [false]
      }, {
        validator: this.dateRangeValidator
      }),
      skills: this.fb.array([]),
      requirements: this.fb.array([]),
      responsibilities: this.fb.array([]),
      benefits: this.fb.array([]),
      contactInformation: this.fb.group({
        emails: this.fb.array([]),
        phoneNumbers: this.fb.array([]),
        addresses: this.fb.array([])
      })
    });
  }
  dateRangeValidator(group) {
    var _group$get, _group$get2;
    const start = (_group$get = group.get("startDate")) === null || _group$get === void 0 ? void 0 : _group$get.value;
    const end = (_group$get2 = group.get("endDate")) === null || _group$get2 === void 0 ? void 0 : _group$get2.value;
    if (start && end && new Date(start) > new Date(end)) {
      return {
        dateRange: true
      };
    }
    return null;
  }
  ngOnInit() {
    if (this.listing) {
      var _this$listing$timeCom, _this$listing$timeCom2;
      const formValue = {
        ...this.listing,
        timeCommitment: {
          ...this.listing.timeCommitment,
          startDate: (_this$listing$timeCom = this.listing.timeCommitment.startDate) === null || _this$listing$timeCom === void 0 ? void 0 : _this$listing$timeCom.toDate().toISOString(),
          endDate: (_this$listing$timeCom2 = this.listing.timeCommitment.endDate) === null || _this$listing$timeCom2 === void 0 ? void 0 : _this$listing$timeCom2.toDate().toISOString()
        }
      };
      this.listingForm.patchValue(formValue);
      this.initializeFormArrays(this.listing);
    } else {
      // New listing - populate from account
      this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.first)(), (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.tap)(user => {
        if (user !== null && user !== void 0 && user.uid) {
          this.store.dispatch(_state_actions_account_actions__WEBPACK_IMPORTED_MODULE_2__.loadAccount({
            accountId: user.uid
          }));
          this.authUser = user;
        }
      }), (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.switchMap)(user => this.store.select((0,_state_selectors_account_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAccountById)(user.uid))), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.filter)(account => account !== null), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(account => {
        // Only call one initialization method
        this.initializeFormFromAccount(account);
      });
    }
  }
  initializeFormFromAccount(account) {
    var _account$contactInfor, _account$contactInfor2, _account$contactInfor3;
    this.listingForm.patchValue({
      organization: account.name
    });
    // Initialize contact information arrays
    (_account$contactInfor = account.contactInformation) === null || _account$contactInfor === void 0 || (_account$contactInfor = _account$contactInfor.emails) === null || _account$contactInfor === void 0 || _account$contactInfor.forEach(email => {
      const emailForm = this.fb.group({
        name: [email.name],
        email: [email.email]
      });
      this.listingForm.get("contactInformation.emails").push(emailForm);
    });
    (_account$contactInfor2 = account.contactInformation) === null || _account$contactInfor2 === void 0 || (_account$contactInfor2 = _account$contactInfor2.phoneNumbers) === null || _account$contactInfor2 === void 0 || _account$contactInfor2.forEach(phone => {
      const phoneForm = this.fb.group({
        type: [phone.type],
        countryCode: [phone.countryCode],
        number: [phone.number]
      });
      this.listingForm.get("contactInformation.phoneNumbers").push(phoneForm);
    });
    (_account$contactInfor3 = account.contactInformation) === null || _account$contactInfor3 === void 0 || (_account$contactInfor3 = _account$contactInfor3.addresses) === null || _account$contactInfor3 === void 0 || _account$contactInfor3.forEach(address => {
      const addressForm = this.fb.group({
        name: [address === null || address === void 0 ? void 0 : address.name],
        street: [address === null || address === void 0 ? void 0 : address.street],
        city: [address === null || address === void 0 ? void 0 : address.city],
        state: [address === null || address === void 0 ? void 0 : address.state],
        country: [address === null || address === void 0 ? void 0 : address.country],
        zipcode: [address === null || address === void 0 ? void 0 : address.zipcode],
        isPrimaryAddress: [address === null || address === void 0 ? void 0 : address.isPrimaryAddress]
      });
      this.listingForm.get("contactInformation.addresses").push(addressForm);
    });
  }
  markFormGroupTouched(formGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  initializeFormArrays(listing) {
    var _listing$skills, _listing$requirements, _listing$responsibili, _listing$benefits, _listing$contactInfor, _listing$contactInfor2, _listing$contactInfor3;
    // Clear existing arrays
    this.listingForm.get("skills").clear();
    this.listingForm.get("requirements").clear();
    this.listingForm.get("responsibilities").clear();
    this.listingForm.get("benefits").clear();
    this.listingForm.get("contactInformation.emails").clear();
    this.listingForm.get("contactInformation.phoneNumbers").clear();
    this.listingForm.get("contactInformation.addresses").clear();
    // Initialize skills
    (_listing$skills = listing.skills) === null || _listing$skills === void 0 || _listing$skills.forEach(skill => {
      const skillForm = this.fb.group({
        name: [skill.name, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
        level: [skill.level],
        required: [skill.required]
      });
      this.listingForm.get("skills").push(skillForm);
    });
    // Initialize requirements
    (_listing$requirements = listing.requirements) === null || _listing$requirements === void 0 || _listing$requirements.forEach(req => {
      const control = this.fb.control(req, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required);
      this.listingForm.get("requirements").push(control);
    });
    // Initialize responsibilities
    (_listing$responsibili = listing.responsibilities) === null || _listing$responsibili === void 0 || _listing$responsibili.forEach(resp => {
      const control = this.fb.control(resp, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required);
      this.listingForm.get("responsibilities").push(control);
    });
    // Initialize benefits
    (_listing$benefits = listing.benefits) === null || _listing$benefits === void 0 || _listing$benefits.forEach(benefit => {
      const control = this.fb.control(benefit, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required);
      this.listingForm.get("benefits").push(control);
    });
    // Initialize contact information
    (_listing$contactInfor = listing.contactInformation) === null || _listing$contactInfor === void 0 || (_listing$contactInfor = _listing$contactInfor.emails) === null || _listing$contactInfor === void 0 || _listing$contactInfor.forEach(email => {
      const emailForm = this.fb.group({
        name: [email.name],
        email: [email.email, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.email]]
      });
      this.listingForm.get("contactInformation.emails").push(emailForm);
    });
    (_listing$contactInfor2 = listing.contactInformation) === null || _listing$contactInfor2 === void 0 || (_listing$contactInfor2 = _listing$contactInfor2.phoneNumbers) === null || _listing$contactInfor2 === void 0 || _listing$contactInfor2.forEach(phone => {
      const phoneForm = this.fb.group({
        type: [phone.type],
        countryCode: [phone.countryCode],
        number: [phone.number, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
        isEmergencyNumber: [phone.isEmergencyNumber]
      });
      this.listingForm.get("contactInformation.phoneNumbers").push(phoneForm);
    });
    (_listing$contactInfor3 = listing.contactInformation) === null || _listing$contactInfor3 === void 0 || (_listing$contactInfor3 = _listing$contactInfor3.addresses) === null || _listing$contactInfor3 === void 0 || _listing$contactInfor3.forEach(address => {
      const addressForm = this.fb.group({
        name: [address === null || address === void 0 ? void 0 : address.name],
        street: [address === null || address === void 0 ? void 0 : address.street],
        city: [address === null || address === void 0 ? void 0 : address.city],
        state: [address === null || address === void 0 ? void 0 : address.state],
        country: [address === null || address === void 0 ? void 0 : address.country],
        zipcode: [address === null || address === void 0 ? void 0 : address.zipcode],
        isPrimaryAddress: [address === null || address === void 0 ? void 0 : address.isPrimaryAddress]
      });
      this.listingForm.get("contactInformation.addresses").push(addressForm);
    });
  }
  addSkill(skill) {
    const skillForm = this.fb.group({
      name: [(skill === null || skill === void 0 ? void 0 : skill.name) || "", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      level: [(skill === null || skill === void 0 ? void 0 : skill.level) || "beginner"],
      required: [(skill === null || skill === void 0 ? void 0 : skill.required) || true]
    });
    this.listingForm.get("skills").push(skillForm);
  }
  addArrayItem(arrayName, value = "") {
    const control = this.fb.control(value, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required);
    this.listingForm.get(arrayName).push(control);
  }
  addEmail() {
    const emailForm = this.fb.group({
      name: [""],
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.email]]
    });
    this.listingForm.get("contactInformation.emails").push(emailForm);
  }
  addPhoneNumber() {
    const phoneForm = this.fb.group({
      type: ["Mobile"],
      countryCode: ["+1"],
      number: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required]
    });
    this.listingForm.get("contactInformation.phoneNumbers").push(phoneForm);
  }
  removeArrayItem(arrayName, index) {
    this.listingForm.get(arrayName).removeAt(index);
  }
  getFormArray(arrayName) {
    return this.listingForm.get(arrayName);
  }
  submitForm(status) {
    if (this.listingForm.valid) {
      this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.take)(1)).subscribe(user => {
        var _this$listing;
        const formValue = this.listingForm.value;
        const listing = {
          ...formValue,
          id: ((_this$listing = this.listing) === null || _this$listing === void 0 ? void 0 : _this$listing.id) || null,
          timeCommitment: {
            ...formValue.timeCommitment,
            startDate: formValue.timeCommitment.startDate ? firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.Timestamp.fromDate(new Date(formValue.timeCommitment.startDate)) : null,
            endDate: formValue.timeCommitment.endDate ? firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.Timestamp.fromDate(new Date(formValue.timeCommitment.endDate)) : null
          },
          status,
          accountId: user === null || user === void 0 ? void 0 : user.uid,
          iconImage: (user === null || user === void 0 ? void 0 : user.iconImage) || "",
          heroImage: (user === null || user === void 0 ? void 0 : user.heroImage) || "",
          lastModifiedBy: user === null || user === void 0 ? void 0 : user.uid
        };
        this.formSubmit.emit(listing);
      });
    } else {
      this.markFormGroupTouched(this.listingForm);
    }
  }
  onSubmit() {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      return;
    }
    if (this.listingForm.valid) {
      var _this$listing2;
      // If listing exists, keep current status, otherwise set as draft
      const status = (_this$listing2 = this.listing) !== null && _this$listing2 !== void 0 && _this$listing2.id ? this.listing.status : "draft";
      this.submitForm(status);
    } else {
      this.markFormGroupTouched(this.listingForm);
    }
  }
  addAddress() {
    const addressForm = this.fb.group({
      name: [""],
      street: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      city: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      state: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      country: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      zipcode: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")]],
      isPrimaryAddress: [false]
    });
    this.listingForm.get("contactInformation.addresses").push(addressForm);
  }
  goToNextStep() {
    if (this.listingForm.invalid) {
      this.listingForm.markAllAsTouched();
      return;
    }
    this.currentStep++;
  }
  goToPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  getProgress() {
    return this.currentStep / 2; // Progress value for the progress bar
  }
}
_ListingFormComponent = ListingFormComponent;
_ListingFormComponent.ɵfac = function ListingFormComponent_Factory(t) {
  return new (t || _ListingFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_11__.Store));
};
_ListingFormComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _ListingFormComponent,
  selectors: [["app-listing-form"]],
  inputs: {
    listing: "listing"
  },
  outputs: {
    formSubmit: "formSubmit"
  },
  decls: 9,
  vars: 6,
  consts: [[3, "ngSubmit", "formGroup"], [4, "ngIf"], ["expand", "block", 3, "click", 4, "ngIf"], ["expand", "block", "color", "primary", "type", "submit", 4, "ngIf"], ["size", "12", "size-md", "6"], ["label", "Title", "label-placement", "floating", "fill", "outline", "formControlName", "title", "placeholder", "Enter position title"], ["color", "danger", 4, "ngIf"], ["label", "Organization", "label-placement", "floating", "fill", "outline", "formControlName", "organization", "placeholder", "Enter organization name"], ["label", "Listing Type", "label-placement", "stacked", "formControlName", "type", "fill", "outline"], [3, "value", 4, "ngFor", "ngForOf"], ["lines", "none"], ["formControlName", "remote"], ["size", "12"], ["label", "Description", "label-placement", "floating", "fill", "outline", "formControlName", "description", "rows", "6", "placeholder", "Describe the role"], ["formGroupName", "timeCommitment"], ["label", "Hours per Week", "label-placement", "floating", "fill", "outline", "type", "number", "formControlName", "hoursPerWeek", "placeholder", "Enter hours (e.g., 20)"], ["label", "Duration", "label-placement", "floating", "fill", "outline", "formControlName", "duration", "placeholder", "Enter duration (e.g., 6 months)"], ["label", "Schedule", "label-placement", "floating", "fill", "outline", "formControlName", "schedule", "placeholder", "Enter schedule (e.g., Mon-Fri, 9am-5pm)"], ["label", "Start Date", "label-placement", "floating", "fill", "outline", "formControlName", "startDate", "presentation", "date", 3, "preferWheel"], ["label", "End Date", "label-placement", "floating", "fill", "outline", "formControlName", "endDate", "presentation", "date", 3, "preferWheel"], ["formControlName", "isFlexible"], ["color", "danger"], [3, "value"], ["formArrayName", "skills"], [3, "formGroupName", 4, "ngFor", "ngForOf"], ["fill", "clear", 3, "click"], ["slot", "start", "name", "add-circle-outline"], ["formArrayName", "requirements"], [4, "ngFor", "ngForOf"], ["formArrayName", "responsibilities"], ["formArrayName", "benefits"], ["formGroupName", "contactInformation"], ["formArrayName", "emails"], ["color", "tertiary"], ["formArrayName", "addresses"], ["formArrayName", "phoneNumbers"], [3, "formGroupName"], ["size", "6"], ["formControlName", "name", "label", "Skill Name", "label-placement", "floating", "fill", "outline", "placeholder", "Enter skill"], ["size", "3"], ["formControlName", "level", "label", "Skill Level", "label-placement", "stacked", "fill", "outline"], ["size", "2"], ["formControlName", "required"], ["size", "1"], ["name", "trash-outline"], ["size", "10"], ["label", "Requirement", "label-placement", "floating", "fill", "outline", "type", "text", "placeholder", "Enter requirement", 3, "formControlName"], ["label", "Responsibility", "label-placement", "floating", "fill", "outline", "placeholder", "Enter responsibility", 3, "formControlName"], ["label", "Benefit", "label-placement", "floating", "fill", "outline", "placeholder", "Enter benefit", 3, "formControlName"], ["size", "5"], ["formControlName", "name", "label", "Name", "label-placement", "floating", "fill", "outline", "placeholder", "Enter name"], ["formControlName", "email", "label", "Email", "label-placement", "floating", "fill", "outline", "placeholder", "Enter email"], ["label", "Building Name", "label-placement", "floating", "fill", "outline", "formControlName", "name", "type", "text", "placeholder", "Enter building name"], ["label", "Street Address", "label-placement", "floating", "fill", "outline", "formControlName", "street", "type", "text", "placeholder", "Enter street address"], ["label", "City", "label-placement", "floating", "fill", "outline", "formControlName", "city", "type", "text", "placeholder", "Enter city"], ["label", "State", "label-placement", "floating", "fill", "outline", "formControlName", "state", "type", "text", "placeholder", "Enter state"], ["label", "Country", "label-placement", "floating", "fill", "outline", "formControlName", "country", "type", "text", "placeholder", "Enter country"], ["label", "Postal Code", "label-placement", "floating", "fill", "outline", "formControlName", "zipcode", "type", "text", "placeholder", "Enter postal code"], ["formControlName", "isPrimaryAddress"], ["size", "auto"], ["label", "Type", "label-placement", "stacked", "formControlName", "type", "fill", "outline"], ["value", "Mobile"], ["value", "Work"], ["value", "Home"], ["label", "Country Code", "label-placement", "floating", "fill", "outline", "formControlName", "countryCode", "type", "text"], ["label", "Number", "label-placement", "floating", "fill", "outline", "formControlName", "number", "type", "tel", "placeholder", "Enter phone number"], ["expand", "block", 3, "click"], ["expand", "block", "color", "primary", "type", "submit"]],
  template: function ListingFormComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "form", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function ListingFormComponent_Template_form_ngSubmit_0_listener() {
        return ctx.onSubmit();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ListingFormComponent_ng_container_1_Template, 58, 34, "ng-container", 1)(2, ListingFormComponent_ng_container_2_Template, 69, 7, "ng-container", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "ion-row")(4, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, ListingFormComponent_ion_button_5_Template, 2, 0, "ion-button", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-col");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](7, ListingFormComponent_ion_button_7_Template, 2, 0, "ion-button", 2)(8, ListingFormComponent_ion_button_8_Template, 2, 1, "ion-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroup", ctx.listingForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentStep === 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentStep === 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentStep > 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentStep < 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.currentStep === 2);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCheckbox, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonDatetime, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonItemDivider, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonSelect, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonSelectOption, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonToggle, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.BooleanValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.NumericValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormArrayName, _angular_common__WEBPACK_IMPORTED_MODULE_12__.TitleCasePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL2NvbXBvbmVudHMvbGlzdGluZy1mb3JtL2xpc3RpbmctZm9ybS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 4308:
/*!***********************************************************!*\
  !*** ./src/app/modules/listing/listing-routing.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingRoutingModule: () => (/* binding */ ListingRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _pages_listings_listings_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/listings/listings.page */ 8418);
/* harmony import */ var _pages_listing_detail_listing_detail_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/listing-detail/listing-detail.page */ 4068);
/* harmony import */ var _pages_listing_edit_listing_edit_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/listing-edit/listing-edit.page */ 6364);
/* harmony import */ var _pages_listing_create_listing_create_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/listing-create/listing-create.page */ 9322);
/* harmony import */ var _relatedAccount_pages_applicants_applicants_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./relatedAccount/pages/applicants/applicants.page */ 4653);
/* harmony import */ var _relatedAccount_pages_apply_apply_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./relatedAccount/pages/apply/apply.page */ 1733);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 6623);
var _ListingRoutingModule;









const routes = [{
  path: "",
  component: _pages_listings_listings_page__WEBPACK_IMPORTED_MODULE_0__.ListingsPage
}, {
  path: "create",
  component: _pages_listing_create_listing_create_page__WEBPACK_IMPORTED_MODULE_3__.ListingCreatePage
}, {
  path: ":id",
  component: _pages_listing_detail_listing_detail_page__WEBPACK_IMPORTED_MODULE_1__.ListingDetailPage
}, {
  path: ":id/applicants",
  component: _relatedAccount_pages_applicants_applicants_page__WEBPACK_IMPORTED_MODULE_4__.ApplicantsPage
}, {
  path: ":id/apply",
  component: _relatedAccount_pages_apply_apply_page__WEBPACK_IMPORTED_MODULE_5__.ApplyPage
}, {
  path: ":id/edit",
  component: _pages_listing_edit_listing_edit_page__WEBPACK_IMPORTED_MODULE_2__.ListingEditPage
}];
class ListingRoutingModule {}
_ListingRoutingModule = ListingRoutingModule;
_ListingRoutingModule.ɵfac = function ListingRoutingModule_Factory(t) {
  return new (t || _ListingRoutingModule)();
};
_ListingRoutingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
  type: _ListingRoutingModule
});
_ListingRoutingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
  imports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](ListingRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule]
  });
})();

/***/ }),

/***/ 3461:
/*!***************************************************!*\
  !*** ./src/app/modules/listing/listing.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingModule: () => (/* binding */ ListingModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var _pages_listings_listings_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/listings/listings.page */ 8418);
/* harmony import */ var _listing_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./listing-routing.module */ 4308);
/* harmony import */ var _state_reducers_listings_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../state/reducers/listings.reducer */ 3133);
/* harmony import */ var _state_effects_listings_effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../state/effects/listings.effects */ 9540);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _pages_listing_detail_listing_detail_page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/listing-detail/listing-detail.page */ 4068);
/* harmony import */ var _pages_listing_edit_listing_edit_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/listing-edit/listing-edit.page */ 6364);
/* harmony import */ var _pages_listing_create_listing_create_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/listing-create/listing-create.page */ 9322);
/* harmony import */ var _shared_pipes_timestamp_pipe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/pipes/timestamp.pipe */ 9260);
/* harmony import */ var _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/listing-form/listing-form.component */ 3302);
/* harmony import */ var _shared_pipes_format_address_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../shared/pipes/format-address.pipe */ 9932);
/* harmony import */ var _pages_listing_detail_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pages/listing-detail/components/hero/hero.component */ 5000);
/* harmony import */ var _relatedAccount_pages_applicants_applicants_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./relatedAccount/pages/applicants/applicants.page */ 4653);
/* harmony import */ var _shared_pipes_phone_format_pipe__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../shared/pipes/phone-format.pipe */ 5013);
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../shared/shared.module */ 3887);
/* harmony import */ var _relatedAccount_pages_apply_apply_page__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./relatedAccount/pages/apply/apply.page */ 1733);
/* harmony import */ var _relatedAccount_pages_applicants_components_applicant_details_modal_applicant_details_modal_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./relatedAccount/pages/applicants/components/applicant-details-modal/applicant-details-modal.component */ 6288);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 6623);
var _ListingModule;

























class ListingModule {}
_ListingModule = ListingModule;
_ListingModule.ɵfac = function ListingModule_Factory(t) {
  return new (t || _ListingModule)();
};
_ListingModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineNgModule"]({
  type: _ListingModule
});
_ListingModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_17__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_19__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_20__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.ReactiveFormsModule, _listing_routing_module__WEBPACK_IMPORTED_MODULE_1__.ListingRoutingModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__.SharedModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_21__.StoreModule.forFeature("listings", _state_reducers_listings_reducer__WEBPACK_IMPORTED_MODULE_2__.listingsReducer), _ngrx_effects__WEBPACK_IMPORTED_MODULE_22__.EffectsModule.forFeature([_state_effects_listings_effects__WEBPACK_IMPORTED_MODULE_3__.ListingsEffects])]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵsetNgModuleScope"](ListingModule, {
    declarations: [_relatedAccount_pages_applicants_applicants_page__WEBPACK_IMPORTED_MODULE_11__.ApplicantsPage, _relatedAccount_pages_apply_apply_page__WEBPACK_IMPORTED_MODULE_14__.ApplyPage, _pages_listings_listings_page__WEBPACK_IMPORTED_MODULE_0__.ListingsPage, _pages_listing_create_listing_create_page__WEBPACK_IMPORTED_MODULE_6__.ListingCreatePage, _pages_listing_detail_listing_detail_page__WEBPACK_IMPORTED_MODULE_4__.ListingDetailPage, _pages_listing_edit_listing_edit_page__WEBPACK_IMPORTED_MODULE_5__.ListingEditPage, _shared_pipes_timestamp_pipe__WEBPACK_IMPORTED_MODULE_7__.TimestampPipe, _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_8__.ListingFormComponent, _shared_pipes_format_address_pipe__WEBPACK_IMPORTED_MODULE_9__.FormatAddressPipe, _shared_pipes_phone_format_pipe__WEBPACK_IMPORTED_MODULE_12__.PhoneFormatPipe, _pages_listing_detail_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_10__.HeroComponent, _relatedAccount_pages_applicants_components_applicant_details_modal_applicant_details_modal_component__WEBPACK_IMPORTED_MODULE_15__.ApplicantDetailsModalComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_17__.CommonModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormsModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_19__.IonicModule, _angular_router__WEBPACK_IMPORTED_MODULE_20__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.ReactiveFormsModule, _listing_routing_module__WEBPACK_IMPORTED_MODULE_1__.ListingRoutingModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_13__.SharedModule, _ngrx_store__WEBPACK_IMPORTED_MODULE_21__.StoreFeatureModule, _ngrx_effects__WEBPACK_IMPORTED_MODULE_22__.EffectsFeatureModule]
  });
})();

/***/ }),

/***/ 9322:
/*!*****************************************************************************!*\
  !*** ./src/app/modules/listing/pages/listing-create/listing-create.page.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingCreatePage: () => (/* binding */ ListingCreatePage)
/* harmony export */ });
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 3782);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/listing-form/listing-form.component */ 3302);
var _ListingCreatePage;







class ListingCreatePage {
  constructor(store) {
    this.store = store;
  }
  onSubmit(formValue) {
    this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.first)()).subscribe(user => {
      if (user) {
        const listing = {
          ...formValue,
          createdBy: user.uid
        };
        this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.createListing({
          listing
        }));
      }
    });
  }
}
_ListingCreatePage = ListingCreatePage;
_ListingCreatePage.ɵfac = function ListingCreatePage_Factory(t) {
  return new (t || _ListingCreatePage)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_5__.Store));
};
_ListingCreatePage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _ListingCreatePage,
  selectors: [["app-listing-create"]],
  decls: 8,
  vars: 0,
  consts: [["slot", "start"], [3, "formSubmit"]],
  template: function ListingCreatePage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-buttons", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "ion-back-button");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "Create New Listing");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "ion-content")(7, "app-listing-form", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("formSubmit", function ListingCreatePage_Template_app_listing_form_formSubmit_7_listener($event) {
        return ctx.onSubmit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonBackButton, _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_2__.ListingFormComponent],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3BhZ2VzL2xpc3RpbmctY3JlYXRlL2xpc3RpbmctY3JlYXRlLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 5000:
/*!****************************************************************************************!*\
  !*** ./src/app/modules/listing/pages/listing-detail/components/hero/hero.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeroComponent: () => (/* binding */ HeroComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 1099);
var _HeroComponent;




const _c0 = a0 => ["/listings", a0, "apply"];
const _c1 = a0 => ["/listings", a0, "edit"];
const _c2 = a0 => ["/listings", a0, "applicants"];
function HeroComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r0.listing.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function HeroComponent_div_34_ion_button_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Apply Now ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.listing.status !== "active")("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](2, _c0, ctx_r0.listing.id));
  }
}
function HeroComponent_div_34_ion_button_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "ion-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](1, _c1, ctx_r0.listing.id));
  }
}
function HeroComponent_div_34_ion_button_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "ion-button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "ion-icon", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " View Applicants ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](1, _c2, ctx_r0.listing.id));
  }
}
function HeroComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, HeroComponent_div_34_ion_button_1_Template, 2, 4, "ion-button", 18)(2, HeroComponent_div_34_ion_button_2_Template, 3, 3, "ion-button", 19)(3, HeroComponent_div_34_ion_button_3_Template, 3, 3, "ion-button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx_r0.isOwner);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.isOwner);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.isOwner);
  }
}
class HeroComponent {
  constructor() {
    this.isOwner = false;
    this.showButtons = true;
  }
  getCities() {
    var _this$listing$contact;
    if (this.listing.remote) {
      return "Remote";
    }
    const addresses = (_this$listing$contact = this.listing.contactInformation) === null || _this$listing$contact === void 0 ? void 0 : _this$listing$contact.addresses;
    if (!addresses || addresses.length === 0) {
      return "No locations available";
    }
    return addresses.map(address => `${address === null || address === void 0 ? void 0 : address.city}, ${address === null || address === void 0 ? void 0 : address.country}`).join(", ");
  }
}
_HeroComponent = HeroComponent;
_HeroComponent.ɵfac = function HeroComponent_Factory(t) {
  return new (t || _HeroComponent)();
};
_HeroComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: _HeroComponent,
  selectors: [["app-hero"]],
  inputs: {
    listing: "listing",
    isOwner: "isOwner",
    showButtons: "showButtons"
  },
  decls: 35,
  vars: 15,
  consts: [[1, "header-image"], ["alt", "Header Background", 3, "src"], [1, "listing-header"], [1, "listing-info"], [1, "title-section"], ["class", "hero-image-small", 4, "ngIf"], [1, "title-content"], [1, "details-icons"], [1, "detail-item"], ["name", "heart-outline", "color", "primary"], ["color", "primary", 3, "name"], ["name", "location-outline", "color", "primary"], ["name", "time-outline", "color", "primary"], ["name", "briefcase-outline", "color", "primary"], ["class", "listing-actions", 4, "ngIf"], [1, "hero-image-small"], ["alt", "Listing Hero", 3, "src"], [1, "listing-actions"], ["fill", "outline", 3, "disabled", "routerLink", 4, "ngIf"], ["fill", "outline", "size", "small", 3, "routerLink", 4, "ngIf"], ["fill", "outline", 3, "disabled", "routerLink"], ["fill", "outline", "size", "small", 3, "routerLink"], ["name", "pencil-outline"], ["name", "people-outline"]],
  template: function HeroComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 2)(3, "div", 3)(4, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, HeroComponent_div_5_Template, 2, 1, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 6)(7, "h2");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "h3");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 7)(12, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](13, "ion-icon", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](16, "titlecase");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "ion-icon", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](22, "ion-icon", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](26, "ion-icon", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "ion-icon", 13);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "span");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](33, "titlecase");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](34, HeroComponent_div_34_Template, 4, 3, "div", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx.listing.heroImage || "assets/image/orghero.png", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.listing.iconImage);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.listing.title);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.listing.organization);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](16, 11, ctx.listing.type));
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("name", ctx.listing.remote ? "cloud-outline" : "business-outline");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.listing.remote ? "Remote" : "On-site");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.getCities());
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.listing.timeCommitment.hoursPerWeek, " hrs/week");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](33, 13, ctx.listing.status));
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showButtons);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_2__.RouterLinkDelegate, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_1__.TitleCasePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.header-image[_ngcontent-%COMP%] {\n  position: relative;\n  height: 200px;\n  overflow: hidden;\n}\n.header-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n\n\n\n.listing-header[_ngcontent-%COMP%] {\n  padding: 20px;\n  margin-top: -50px;\n  background: var(--ion-background-color);\n  border-radius: 20px 20px 0 0;\n  position: relative;\n}\n\n.listing-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n.listing-info[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n.listing-info[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   .hero-image-small[_ngcontent-%COMP%] {\n  width: 80px;\n  height: 80px;\n  overflow: hidden;\n  border-radius: 8px;\n}\n.listing-info[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   .hero-image-small[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.listing-info[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   .title-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: bold;\n  margin: 0;\n}\n.listing-info[_ngcontent-%COMP%]   .title-section[_ngcontent-%COMP%]   .title-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: var(--ion-color-medium);\n  margin: 0;\n}\n.listing-info[_ngcontent-%COMP%]   .details-icons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}\n.listing-info[_ngcontent-%COMP%]   .details-icons[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 1rem;\n  color: var(--ion-color-dark);\n}\n.listing-info[_ngcontent-%COMP%]   .details-icons[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n}\n\n\n\n.listing-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  justify-content: flex-start;\n  margin-top: 1rem;\n}\n.listing-actions[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n}\n.listing-actions[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  margin-right: 8px;\n}\n.listing-actions[_ngcontent-%COMP%]   .edit-button[_ngcontent-%COMP%] {\n  --color: var(--ion-color-primary);\n}\n\n@media (prefers-color-scheme: light) {\n  .listing-header[_ngcontent-%COMP%] {\n    background: #fff;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3BhZ2VzL2xpc3RpbmctZGV0YWlsL2NvbXBvbmVudHMvaGVyby9oZXJvLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUE7QUFxQkEseUJBQUE7QUFDQTtFQUNFLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0FBREY7QUFHRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFESjs7QUFLQSwyQkFBQTtBQUNBO0VBQ0UsYUFBQTtFQUNBLGlCQUFBO0VBQ0EsdUNBQUE7RUFDQSw0QkFBQTtFQUNBLGtCQUFBO0FBRkY7O0FBS0E7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBRkY7QUFJRTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7QUFGSjtBQUlJO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBRk47QUFJTTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUFGUjtBQU1NO0VBQ0UsaUJBQUE7RUFDQSxpQkFBQTtFQUNBLFNBQUE7QUFKUjtBQU9NO0VBQ0UsaUJBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7QUFMUjtBQVVFO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSxTQUFBO0FBUko7QUFVSTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsNEJBQUE7QUFSTjtBQVVNO0VBQ0UsaUJBQUE7QUFSUjs7QUFjQSw0QkFBQTtBQUNBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7RUFDQSxnQkFBQTtBQVhGO0FBYUU7RUFDRSxpQkFBQTtBQVhKO0FBY0U7RUFDRSxpQkFBQTtBQVpKO0FBZUU7RUFDRSxpQ0FBQTtBQWJKOztBQWlCQTtFQUNFO0lBQ0UsZ0JBQUE7RUFkRjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vLyBzcmMvYXBwL21vZHVsZXMvbGlzdGluZy9wYWdlcy9saXN0aW5nLWRldGFpbC9jb21wb25lbnRzL2hlcm8vaGVyby5jb21wb25lbnQuc2Nzc1xuXG4vKiBIZWFkZXIgSW1hZ2UgU3R5bGluZyAqL1xuLmhlYWRlci1pbWFnZSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgaGVpZ2h0OiAyMDBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICBpbWcge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgfVxufVxuXG4vKiBMaXN0aW5nIEhlYWRlciBTdHlsaW5nICovXG4ubGlzdGluZy1oZWFkZXIge1xuICBwYWRkaW5nOiAyMHB4O1xuICBtYXJnaW4tdG9wOiAtNTBweDtcbiAgYmFja2dyb3VuZDogdmFyKC0taW9uLWJhY2tncm91bmQtY29sb3IpO1xuICBib3JkZXItcmFkaXVzOiAyMHB4IDIwcHggMCAwO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5saXN0aW5nLWluZm8ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDFyZW07XG5cbiAgLnRpdGxlLXNlY3Rpb24ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDFyZW07XG5cbiAgICAuaGVyby1pbWFnZS1zbWFsbCB7XG4gICAgICB3aWR0aDogODBweDtcbiAgICAgIGhlaWdodDogODBweDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG5cbiAgICAgIGltZyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIG9iamVjdC1maXQ6IGNvdmVyO1xuICAgICAgfVxuICAgIH1cbiAgICAudGl0bGUtY29udGVudCB7XG4gICAgICBoMiB7XG4gICAgICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgfVxuXG4gICAgICBoMyB7XG4gICAgICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgICAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLW1lZGl1bSk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAuZGV0YWlscy1pY29ucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgZ2FwOiAxcmVtO1xuXG4gICAgLmRldGFpbC1pdGVtIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgZ2FwOiAwLjVyZW07XG4gICAgICBmb250LXNpemU6IDFyZW07XG4gICAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLWRhcmspO1xuXG4gICAgICBpb24taWNvbiB7XG4gICAgICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKiBMaXN0aW5nIEFjdGlvbnMgU2VjdGlvbiAqL1xuLmxpc3RpbmctYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiA4cHg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgbWFyZ2luLXRvcDogMXJlbTtcblxuICBpb24tYnV0dG9uIHtcbiAgICBmb250LXNpemU6IDAuOXJlbTtcbiAgfVxuXG4gIGlvbi1pY29uIHtcbiAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgfVxuXG4gIC5lZGl0LWJ1dHRvbiB7XG4gICAgLS1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICB9XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KSB7XG4gIC5saXN0aW5nLWhlYWRlciB7XG4gICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 4068:
/*!*****************************************************************************!*\
  !*** ./src/app/modules/listing/pages/listing-detail/listing-detail.page.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingDetailPage: () => (/* binding */ ListingDetailPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 4406);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 3782);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../state/selectors/listings.selectors */ 2320);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/firestore */ 1342);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/hero/hero.component */ 5000);

var _ListingDetailPage;













const _c0 = a0 => ["/listings", a0, "edit"];
function ListingDetailPage_ng_container_3_ion_card_16_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const responsibility_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](responsibility_r1);
  }
}
function ListingDetailPage_ng_container_3_ion_card_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Responsibilities");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_16_div_7_Template, 4, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.responsibilities);
  }
}
function ListingDetailPage_ng_container_3_ion_card_18_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const requirement_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](requirement_r3);
  }
}
function ListingDetailPage_ng_container_3_ion_card_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Requirements");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_18_div_7_Template, 4, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.requirements);
  }
}
function ListingDetailPage_ng_container_3_ion_card_20_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const benefit_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](benefit_r4);
  }
}
function ListingDetailPage_ng_container_3_ion_card_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Benefits");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_20_div_7_Template, 4, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.benefits);
  }
}
function ListingDetailPage_ng_container_3_ion_card_23_div_7_ion_badge_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-badge", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Required");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function ListingDetailPage_ng_container_3_ion_card_23_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 24)(1, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-badge", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](5, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, ListingDetailPage_ng_container_3_ion_card_23_div_7_ion_badge_6_Template, 2, 0, "ion-badge", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const skill_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](skill_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](5, 3, skill_r5.level));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", skill_r5.required);
  }
}
function ListingDetailPage_ng_container_3_ion_card_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Skills");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_23_div_7_Template, 7, 5, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.skills);
  }
}
function ListingDetailPage_ng_container_3_div_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "Flexible Schedule Available");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "ion-badge", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5, "Flexible");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function ListingDetailPage_ng_container_3_ion_card_46_div_7_ion_badge_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-badge", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Primary Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function ListingDetailPage_ng_container_3_ion_card_46_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 34)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](9, ListingDetailPage_ng_container_3_ion_card_46_div_7_ion_badge_9_Template, 2, 0, "ion-badge", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const address_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](address_r6 == null ? null : address_r6.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](address_r6 == null ? null : address_r6.street);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("", address_r6 == null ? null : address_r6.city, ", ", address_r6 == null ? null : address_r6.state, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("", address_r6 == null ? null : address_r6.country, " ", address_r6 == null ? null : address_r6.zipcode, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", address_r6 == null ? null : address_r6.isPrimaryAddress);
  }
}
function ListingDetailPage_ng_container_3_ion_card_46_ion_badge_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-badge", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, "Remote Available");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function ListingDetailPage_ng_container_3_ion_card_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Location");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_46_div_7_Template, 10, 7, "div", 32)(8, ListingDetailPage_ng_container_3_ion_card_46_ion_badge_8_Template, 2, 0, "ion-badge", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.contactInformation == null ? null : listing_r2.contactInformation.addresses);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.remote);
  }
}
function ListingDetailPage_ng_container_3_ion_card_48_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const email_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](email_r7.email);
  }
}
function ListingDetailPage_ng_container_3_ion_card_48_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "ion-icon", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "ion-badge", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const phone_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("", phone_r8.countryCode, " ", phone_r8.number, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](phone_r8.type);
  }
}
function ListingDetailPage_ng_container_3_ion_card_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4, "Contact Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "ion-card-content")(6, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, ListingDetailPage_ng_container_3_ion_card_48_div_7_Template, 4, 1, "div", 36)(8, ListingDetailPage_ng_container_3_ion_card_48_div_8_Template, 6, 3, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.contactInformation == null ? null : listing_r2.contactInformation.emails);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", listing_r2.contactInformation == null ? null : listing_r2.contactInformation.phoneNumbers);
  }
}
function ListingDetailPage_ng_container_3_div_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 41)(1, "ion-button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "ion-icon", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, " Edit ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "ion-button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ListingDetailPage_ng_container_3_div_49_Template_ion_button_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r9);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r9.togglePublishStatus());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "ion-icon", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const listing_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](3, _c0, listing_r2.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("name", listing_r2.status === "active" ? "pencil-outline" : "cloud-upload-outline");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", listing_r2.status === "active" ? "Unpublish" : "Publish", " Listing ");
  }
}
function ListingDetailPage_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "app-hero", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ion-grid")(4, "ion-row")(5, "ion-col", 3)(6, "ion-card")(7, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "ion-icon", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10, "Description");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "ion-card-content")(12, "div", 5)(13, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "ion-col", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](16, ListingDetailPage_ng_container_3_ion_card_16_Template, 8, 1, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "ion-col", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](18, ListingDetailPage_ng_container_3_ion_card_18_Template, 8, 1, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "ion-col", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](20, ListingDetailPage_ng_container_3_ion_card_20_Template, 8, 1, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "ion-row")(22, "ion-col", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](23, ListingDetailPage_ng_container_3_ion_card_23_Template, 8, 1, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](24, "ion-col", 6)(25, "ion-card")(26, "ion-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](27, "ion-icon", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](28, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](29, "Time Commitment");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](30, "ion-card-content")(31, "div", 5)(32, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](33, "ion-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](34, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](36, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](37, "ion-icon", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](38, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](40, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](41, "ion-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](42, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](44, ListingDetailPage_ng_container_3_div_44_Template, 6, 0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](45, "ion-col", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](46, ListingDetailPage_ng_container_3_ion_card_46_Template, 9, 2, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](47, "ion-col", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](48, ListingDetailPage_ng_container_3_ion_card_48_Template, 9, 2, "ion-card", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](49, ListingDetailPage_ng_container_3_div_49_Template, 7, 5, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](50, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_3_0;
    const listing_r2 = ctx.ngIf;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("listing", listing_r2)("isOwner", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](2, 14, ctx_r9.isOwner$)) !== null && tmp_3_0 !== undefined ? tmp_3_0 : false);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](listing_r2.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.responsibilities == null ? null : listing_r2.responsibilities.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.requirements == null ? null : listing_r2.requirements.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.benefits == null ? null : listing_r2.benefits.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.skills == null ? null : listing_r2.skills.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", listing_r2.timeCommitment.hoursPerWeek, " hours/week");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Duration: ", listing_r2.timeCommitment.duration, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("Schedule: ", listing_r2.timeCommitment.schedule, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", listing_r2.timeCommitment.isFlexible);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", (listing_r2.contactInformation == null ? null : listing_r2.contactInformation.addresses == null ? null : listing_r2.contactInformation.addresses.length) || listing_r2.remote);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", (listing_r2.contactInformation == null ? null : listing_r2.contactInformation.emails == null ? null : listing_r2.contactInformation.emails.length) || (listing_r2.contactInformation == null ? null : listing_r2.contactInformation.phoneNumbers == null ? null : listing_r2.contactInformation.phoneNumbers.length));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](50, 16, ctx_r9.isOwner$));
  }
}
class ListingDetailPage {
  constructor(store, route, alertController) {
    this.store = store;
    this.route = route;
    this.alertController = alertController;
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.listing$ = this.store.select((0,_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_3__.selectListingById)(this.listingId));
    // Determine if current user is the listing creator
    this.isOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.combineLatest)([this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAuthUser), this.listing$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(([user, listing]) => !!(user && listing && listing.createdBy === user.uid)));
  }
  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingById({
        id: this.listingId
      }));
    }
  }
  deleteListing() {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this.alertController.create({
        header: "Confirm Deletion",
        message: "Are you sure you want to delete this listing?",
        buttons: [{
          text: "Cancel",
          role: "cancel"
        }, {
          text: "Delete",
          role: "destructive",
          handler: () => {
            if (_this.listingId) {
              _this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.deleteListing({
                id: _this.listingId
              }));
            }
          }
        }]
      });
      yield alert.present();
    })();
  }
  togglePublishStatus() {
    var _this2 = this;
    this.listing$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.first)()).subscribe( /*#__PURE__*/function () {
      var _ref = (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (listing) {
        if (listing) {
          const newStatus = listing.status === "active" ? "draft" : "active";
          const updatedListing = {
            ...listing,
            status: newStatus,
            lastModifiedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.serverTimestamp)()
          };
          _this2.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateListing({
            listing: updatedListing
          }));
        }
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
}
_ListingDetailPage = ListingDetailPage;
_ListingDetailPage.ɵfac = function ListingDetailPage_Factory(t) {
  return new (t || _ListingDetailPage)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_11__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_13__.AlertController));
};
_ListingDetailPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
  type: _ListingDetailPage,
  selectors: [["app-listing-detail"]],
  decls: 5,
  vars: 3,
  consts: [["title", "Listing Details", "defaultHref", "/listings"], [4, "ngIf"], [3, "listing", "isOwner"], ["size", "12"], ["name", "information-circle-outline", "slot", "start"], [1, "info-block"], ["size", "12", "size-md", "6"], ["name", "time-outline", "slot", "start"], [1, "time-item"], ["name", "hourglass-outline"], ["name", "calendar-outline"], ["name", "alarm-outline"], ["class", "time-item", 4, "ngIf"], ["class", "bottom-actions", 4, "ngIf"], ["name", "list-outline", "slot", "start"], ["class", "list-item", 4, "ngFor", "ngForOf"], [1, "list-item"], ["name", "arrow-forward-circle-outline"], ["name", "warning-outline", "slot", "start"], ["name", "checkmark-circle-outline"], ["name", "gift-outline", "slot", "start"], ["name", "star-outline"], ["name", "ribbon-outline", "slot", "start"], ["class", "skill-item", 4, "ngFor", "ngForOf"], [1, "skill-item"], [1, "skill-name"], ["color", "tertiary"], ["color", "primary", 4, "ngIf"], ["color", "primary"], ["name", "calendar-clear-outline"], ["color", "success"], ["name", "location-outline", "slot", "start"], ["class", "location-item", 4, "ngFor", "ngForOf"], ["color", "success", 4, "ngIf"], [1, "location-item"], ["name", "call-outline", "slot", "start"], ["class", "contact-item", 4, "ngFor", "ngForOf"], [1, "contact-item"], ["name", "mail-outline"], ["name", "call-outline"], ["color", "medium"], [1, "bottom-actions"], ["fill", "outline", 3, "routerLink"], ["name", "pencil-outline", "slot", "start"], ["color", "primary", 3, "click"], ["slot", "start", 3, "name"]],
  template: function ListingDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "ion-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, ListingDetailPage_ng_container_3_Template, 51, 18, "ng-container", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](4, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](4, 1, ctx.listing$));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonBadge, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_13__.RouterLinkDelegate, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLink, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__.AppHeaderComponent, _components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__.HeroComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.AsyncPipe, _angular_common__WEBPACK_IMPORTED_MODULE_14__.TitleCasePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-card[_ngcontent-%COMP%] {\n  margin: 16px;\n  border-radius: 12px;\n  border: 1px solid var(--ion-color-primary);\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s ease;\n  color: var(--ion-text-color);\n}\nion-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n}\n\nion-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: left;\n  gap: 8px;\n  border-bottom: 1px solid var(--ion-color-light-shade);\n}\nion-card-header[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 24px;\n  color: var(--ion-color-primary);\n}\nion-card-header[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5em;\n  font-weight: 600;\n}\n\n.info-block[_ngcontent-%COMP%] {\n  padding: 16px 0 0;\n}\n\n.contact-item[_ngcontent-%COMP%], .time-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n  padding: 8px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.contact-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .time-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--ion-text-color);\n}\n.contact-item[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%], .time-item[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  color: var(--ion-color-primary);\n}\n\n.skill-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 16px;\n  padding: 8px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.skill-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--ion-text-color);\n}\n.skill-item[_ngcontent-%COMP%]   .skill-name[_ngcontent-%COMP%] {\n  font-weight: 500;\n  flex: 1;\n}\n\n.location-item[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.location-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  line-height: 1.4;\n  color: var(--ion-text-color);\n}\n\n.time-dates[_ngcontent-%COMP%] {\n  margin: 16px 0;\n}\n.time-dates[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0;\n  color: var(--ion-color-dark);\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\nion-badge[_ngcontent-%COMP%] {\n  margin-right: 6px;\n  padding: 6px 12px;\n  border-radius: 12px;\n}\n\n.list-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n  padding: 8px;\n  border-radius: 8px;\n}\n.list-item[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  color: var(--ion-color-primary);\n}\n.list-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--ion-text-color);\n}\n\n@media (prefers-color-scheme: dark) {\n  ion-card[_ngcontent-%COMP%], .contact-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .location-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    color: var(--ion-text-color);\n  }\n}\n.bottom-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 1rem;\n  padding: 1rem;\n}\n.bottom-actions[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  min-width: 200px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3BhZ2VzL2xpc3RpbmctZGV0YWlsL2xpc3RpbmctZGV0YWlsLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsMENBQUE7RUFDQSx3Q0FBQTtFQUNBLCtCQUFBO0VBQ0EsNEJBQUE7QUFDRjtBQUNFO0VBQ0UsMkJBQUE7QUFDSjs7QUFHQTtFQUNFLGFBQUE7RUFDQSxpQkFBQTtFQUNBLFFBQUE7RUFFQSxxREFBQTtBQURGO0FBR0U7RUFDRSxlQUFBO0VBQ0EsK0JBQUE7QUFESjtBQUlFO0VBQ0UsZ0JBQUE7RUFDQSxnQkFBQTtBQUZKOztBQU1BO0VBQ0UsaUJBQUE7QUFIRjs7QUFNQTs7RUFFRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtBQUhGO0FBS0U7O0VBQ0UsNEJBQUE7QUFGSjtBQUtFOztFQUNFLGVBQUE7RUFDQSwrQkFBQTtBQUZKOztBQU1BO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0NBQUE7QUFIRjtBQUtFO0VBQ0UsNEJBQUE7QUFISjtBQU1FO0VBQ0UsZ0JBQUE7RUFDQSxPQUFBO0FBSko7O0FBUUE7RUFDRSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGtDQUFBO0FBTEY7QUFPRTtFQUNFLGFBQUE7RUFDQSxnQkFBQTtFQUNBLDRCQUFBO0FBTEo7O0FBU0E7RUFDRSxjQUFBO0FBTkY7QUFRRTtFQUNFLGFBQUE7RUFDQSw0QkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7QUFOSjs7QUFVQTtFQUNFLGlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtBQVBGOztBQVVBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0FBUEY7QUFTRTtFQUNFLGVBQUE7RUFDQSwrQkFBQTtBQVBKO0FBVUU7RUFDRSw0QkFBQTtBQVJKOztBQVlBO0VBU0U7OztJQUdFLDRCQUFBO0VBakJGO0FBQ0Y7QUFvQkE7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxlQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7QUFsQkY7QUFvQkU7RUFDRSxnQkFBQTtBQWxCSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW9uLWNhcmQge1xuICBtYXJnaW46IDE2cHg7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWlvbi1jb2xvci1wcmltYXJ5KTtcbiAgYm94LXNoYWRvdzogMCA0cHggNnB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZTtcbiAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcblxuICAmOmhvdmVyIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIH1cbn1cblxuaW9uLWNhcmQtaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGxlZnQ7XG4gIGdhcDogOHB4O1xuICAvLyBiYWNrZ3JvdW5kOiB2YXIoLS1pb24tY29sb3ItbGlnaHQpO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0taW9uLWNvbG9yLWxpZ2h0LXNoYWRlKTtcblxuICBpb24taWNvbiB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gIH1cblxuICBpb24tY2FyZC10aXRsZSB7XG4gICAgZm9udC1zaXplOiAxLjVlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG59XG5cbi5pbmZvLWJsb2NrIHtcbiAgcGFkZGluZzogMTZweCAwIDA7XG59XG5cbi5jb250YWN0LWl0ZW0sXG4udGltZS1pdGVtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBwYWRkaW5nOiA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLWxpZ2h0KTtcblxuICBzcGFuIHtcbiAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICB9XG5cbiAgaW9uLWljb24ge1xuICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICBjb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICB9XG59XG5cbi5za2lsbC1pdGVtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBwYWRkaW5nOiA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLWxpZ2h0KTtcblxuICBzcGFuIHtcbiAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICB9XG5cbiAgLnNraWxsLW5hbWUge1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZmxleDogMTtcbiAgfVxufVxuXG4ubG9jYXRpb24taXRlbSB7XG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gIHBhZGRpbmc6IDEycHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLWxpZ2h0KTtcblxuICBwIHtcbiAgICBtYXJnaW46IDZweCAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgY29sb3I6IHZhcigtLWlvbi10ZXh0LWNvbG9yKTtcbiAgfVxufVxuXG4udGltZS1kYXRlcyB7XG4gIG1hcmdpbjogMTZweCAwO1xuXG4gIHAge1xuICAgIG1hcmdpbjogNnB4IDA7XG4gICAgY29sb3I6IHZhcigtLWlvbi1jb2xvci1kYXJrKTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gIH1cbn1cblxuaW9uLWJhZGdlIHtcbiAgbWFyZ2luLXJpZ2h0OiA2cHg7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xufVxuXG4ubGlzdC1pdGVtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBwYWRkaW5nOiA4cHg7XG4gIGJvcmRlci1yYWRpdXM6IDhweDtcblxuICBpb24taWNvbiB7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeSk7XG4gIH1cblxuICBzcGFuIHtcbiAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICB9XG59XG5cbkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHtcbiAgLmNvbnRhY3QtaXRlbSxcbiAgLnRpbWUtaXRlbSxcbiAgLnNraWxsLWl0ZW0sXG4gIC5sb2NhdGlvbi1pdGVtLFxuICAubGlzdC1pdGVtIHtcbiAgICAvLyBiYWNrZ3JvdW5kOiB2YXIoLS1pb24tY29sb3ItZGFyay1zaGFkZSk7XG4gIH1cblxuICBpb24tY2FyZCxcbiAgLmNvbnRhY3QtaXRlbSBzcGFuLFxuICAubG9jYXRpb24taXRlbSBwIHtcbiAgICBjb2xvcjogdmFyKC0taW9uLXRleHQtY29sb3IpO1xuICB9XG59XG5cbi5ib3R0b20tYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDFyZW07XG4gIHBhZGRpbmc6IDFyZW07XG5cbiAgaW9uLWJ1dHRvbiB7XG4gICAgbWluLXdpZHRoOiAyMDBweDtcbiAgfVxufVxuXG5AbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCkge1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 6364:
/*!*************************************************************************!*\
  !*** ./src/app/modules/listing/pages/listing-edit/listing-edit.page.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingEditPage: () => (/* binding */ ListingEditPage)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 1969);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/selectors/listings.selectors */ 2320);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/listing-form/listing-form.component */ 3302);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 9191);
var _ListingEditPage;










class ListingEditPage {
  constructor(store, route, router) {
    this.store = store;
    this.route = route;
    this.router = router;
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser);
    this.listingId = this.route.snapshot.paramMap.get("id");
    this.listing$ = this.listingId ? this.store.select((0,_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectListingById)(this.listingId)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(listing => listing || null)) // Map undefined to null
    : (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.of)(null);
    this.isOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.combineLatest)([this.authUser$, this.listing$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.map)(([user, listing]) => !!(user && listing && listing.createdBy === user.uid)), (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.tap)(isOwner => {
      if (!isOwner) {
        this.router.navigate(["/listings"]);
      }
    }));
  }
  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListingById({
        id: this.listingId
      }));
    }
  }
  onSubmit(listing) {
    if (this.listingId) {
      this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.updateListing({
        listing: listing
      }));
    }
  }
}
_ListingEditPage = ListingEditPage;
_ListingEditPage.ɵfac = function ListingEditPage_Factory(t) {
  return new (t || _ListingEditPage)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_9__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router));
};
_ListingEditPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
  type: _ListingEditPage,
  selectors: [["app-listing-edit"]],
  decls: 9,
  vars: 3,
  consts: [["slot", "start"], [3, "formSubmit", "listing"]],
  template: function ListingEditPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-buttons", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "ion-back-button");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5, "Edit Listing");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "ion-content")(7, "app-listing-form", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](8, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("formSubmit", function ListingEditPage_Template_app_listing_form_formSubmit_7_listener($event) {
        return ctx.onSubmit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](7);
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("listing", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](8, 1, ctx.listing$));
    }
  },
  dependencies: [_ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_11__.IonBackButton, _components_listing_form_listing_form_component__WEBPACK_IMPORTED_MODULE_3__.ListingFormComponent, _angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3BhZ2VzL2xpc3RpbmctZWRpdC9saXN0aW5nLWVkaXQucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7K0ZBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 8418:
/*!*****************************************************************!*\
  !*** ./src/app/modules/listing/pages/listings/listings.page.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingsPage: () => (/* binding */ ListingsPage)
/* harmony export */ });
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../state/selectors/listings.selectors */ 2320);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 3478);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/app-header/app-header.component */ 8245);
var _ListingsPage;









const _c0 = a0 => ["/listings", a0];
function ListingsPage_ion_segment_button_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-segment-button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "ion-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const type_r1 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", type_r1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("name", ctx_r1.getIconForType(type_r1));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 3, type_r1));
  }
}
function ListingsPage_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "ion-skeleton-text", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
}
function ListingsPage_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "ion-text", 11)(2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const error_r3 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](error_r3);
  }
}
function ListingsPage_ion_item_16_ion_badge_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-badge", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Remote");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ListingsPage_ion_item_16_p_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listing_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r1.getListingLocation(listing_r4));
  }
}
function ListingsPage_ion_item_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-item", 12)(1, "ion-thumbnail", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "ion-img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "ion-label")(4, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "ion-badge", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](13, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, ListingsPage_ion_item_16_ion_badge_14_Template, 2, 0, "ion-badge", 16)(15, ListingsPage_ion_item_16_p_15_Template, 2, 1, "p", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "ion-note");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "ion-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const listing_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](15, _c0, listing_r4.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("src", listing_r4.iconImage || "assets/image/logo/ASCENDynamics NFP-logos_transparent.png");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](listing_r4.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](listing_r4.organization);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind3"](10, 9, listing_r4.description, 0, 100), "...");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](13, 13, listing_r4.type));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", listing_r4.remote);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !listing_r4.remote);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", listing_r4.timeCommitment.hoursPerWeek, " hrs/week ");
  }
}
function ListingsPage_ion_fab_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-fab", 19)(1, "ion-fab-button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "ion-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
class ListingsPage {
  constructor(store, navCtrl) {
    this.store = store;
    this.navCtrl = navCtrl;
    this.listingTypes = ["all", "volunteer", "job", "internship", "gig"];
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAuthUser);
    this.listings$ = this.store.select(_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_1__.selectFilteredListings);
    this.loading$ = this.store.select(_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_1__.selectLoading);
    this.error$ = this.store.select(_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_1__.selectError);
  }
  ngOnInit() {
    this.loadListings();
  }
  loadListings() {
    this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.loadListings());
  }
  createListing() {
    this.navCtrl.navigateForward("/listings/create");
  }
  viewListing(id) {
    this.navCtrl.navigateForward(`/listings/${id}`);
  }
  filterListings(event) {
    const listingType = event.detail.value;
    this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.filterListings({
      listingType
    }));
  }
  searchListings(event) {
    const query = event.detail.value;
    this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_0__.searchListings({
      query
    }));
  }
  doRefresh(event) {
    this.loadListings();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  getListingLocation(listing) {
    var _listing$contactInfor;
    const primaryAddress = (_listing$contactInfor = listing.contactInformation) === null || _listing$contactInfor === void 0 || (_listing$contactInfor = _listing$contactInfor.addresses) === null || _listing$contactInfor === void 0 ? void 0 : _listing$contactInfor[0];
    if (primaryAddress) {
      return `${primaryAddress.city}, ${primaryAddress.country}`;
    }
    return "Location not specified";
  }
  getIconForType(type) {
    const iconMap = {
      volunteer: "people-outline",
      job: "briefcase-outline",
      event: "calendar-outline",
      project: "construct-outline",
      resource: "library-outline",
      service: "hand-right-outline",
      all: "apps-outline",
      internship: "school-outline",
      gig: "flash-outline"
    };
    return iconMap[type.toLowerCase()] || "help-outline";
  }
}
_ListingsPage = ListingsPage;
_ListingsPage.ɵfac = function ListingsPage_Factory(t) {
  return new (t || _ListingsPage)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_5__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_6__.NavController));
};
_ListingsPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
  type: _ListingsPage,
  selectors: [["app-listings"]],
  decls: 20,
  vars: 13,
  consts: [["title", "Listings"], [3, "ionInput"], ["scrollable", "", 3, "ionChange"], [3, "value", 4, "ngFor", "ngForOf"], ["slot", "fixed", 3, "ionRefresh"], [4, "ngIf"], [3, "routerLink", 4, "ngFor", "ngForOf"], ["vertical", "bottom", "horizontal", "end", "slot", "fixed", 4, "ngIf"], [3, "value"], [3, "name"], ["animated", ""], ["color", "danger"], [3, "routerLink"], ["slot", "start"], [3, "src"], ["color", "primary"], ["color", "success", 4, "ngIf"], ["name", "time-outline"], ["color", "success"], ["vertical", "bottom", "horizontal", "end", "slot", "fixed"], ["routerLink", "/listings/create"], ["name", "add"]],
  template: function ListingsPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "ion-toolbar")(3, "ion-searchbar", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ionInput", function ListingsPage_Template_ion_searchbar_ionInput_3_listener($event) {
        return ctx.searchListings($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "ion-toolbar")(5, "ion-segment", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ionChange", function ListingsPage_Template_ion_segment_ionChange_5_listener($event) {
        return ctx.filterListings($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, ListingsPage_ion_segment_button_6_Template, 5, 5, "ion-segment-button", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "ion-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "ion-refresher", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ionRefresh", function ListingsPage_Template_ion_refresher_ionRefresh_9_listener($event) {
        return ctx.doRefresh($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "ion-refresher-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](11, ListingsPage_ng_container_11_Template, 2, 0, "ng-container", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](12, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](13, ListingsPage_ng_container_13_Template, 4, 1, "ng-container", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](14, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "ion-list");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](16, ListingsPage_ion_item_16_Template, 19, 17, "ion-item", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](17, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, ListingsPage_ion_fab_18_Template, 3, 0, "ion-fab", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](19, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.listingTypes);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](12, 5, ctx.loading$));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](14, 7, ctx.error$));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](17, 9, ctx.listings$));
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](19, 11, ctx.authUser$));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonBadge, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonFab, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonFabButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonImg, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonRefresher, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonRefresherContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSearchbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSegment, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSegmentButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonSkeletonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonThumbnail, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.IonToolbar, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.SelectValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.TextValueAccessor, _ionic_angular__WEBPACK_IMPORTED_MODULE_8__.RouterLinkDelegate, _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterLink, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_3__.AppHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_7__.AsyncPipe, _angular_common__WEBPACK_IMPORTED_MODULE_7__.SlicePipe, _angular_common__WEBPACK_IMPORTED_MODULE_7__.TitleCasePipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-segment[_ngcontent-%COMP%] {\n  --padding-top: 0;\n  --padding-bottom: 0;\n  --padding-start: 0;\n  --padding-end: 0;\n  --indicator-height: 2px;\n  overflow-x: auto;\n}\n\nion-segment-button[_ngcontent-%COMP%] {\n  --padding: 6px 8px;\n  --min-width: auto;\n  flex: 0 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\nion-segment-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  margin-bottom: 4px;\n}\n\nion-segment-button[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  margin: 0;\n}\n\n@media (max-width: 576px) {\n  ion-segment-button[_ngcontent-%COMP%] {\n    --padding: 4px 6px;\n  }\n  ion-segment-button[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%] {\n    display: none;\n  }\n  ion-segment-button[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n    margin-bottom: 0;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3BhZ2VzL2xpc3RpbmdzL2xpc3RpbmdzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsZ0JBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0VBQ0Esa0JBQUE7QUFDRjs7QUFFQTtFQUNFLGVBQUE7RUFDQSxTQUFBO0FBQ0Y7O0FBRUE7RUFDRTtJQUNFLGtCQUFBO0VBQ0Y7RUFFQTtJQUNFLGFBQUE7RUFBRjtFQUdBO0lBQ0UsZ0JBQUE7RUFERjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybTogQWxsb3dpbmcgVXNlcnMgYW5kIE9yZ2FuaXphdGlvbnMgdG8gQ29sbGFib3JhdGUuXG4qIENvcHlyaWdodCAoQykgMjAyMyAgQVNDRU5EeW5hbWljcyBORlBcbipcbiogVGhpcyBmaWxlIGlzIHBhcnQgb2YgTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLlxuKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWRcbiogYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiogKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiogYWxvbmcgd2l0aCBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5pb24tc2VnbWVudCB7XG4gIC0tcGFkZGluZy10b3A6IDA7XG4gIC0tcGFkZGluZy1ib3R0b206IDA7XG4gIC0tcGFkZGluZy1zdGFydDogMDtcbiAgLS1wYWRkaW5nLWVuZDogMDtcbiAgLS1pbmRpY2F0b3ItaGVpZ2h0OiAycHg7XG4gIG92ZXJmbG93LXg6IGF1dG87XG59XG5cbmlvbi1zZWdtZW50LWJ1dHRvbiB7XG4gIC0tcGFkZGluZzogNnB4IDhweDtcbiAgLS1taW4td2lkdGg6IGF1dG87XG4gIGZsZXg6IDAgMCBhdXRvO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG5pb24tc2VnbWVudC1idXR0b24gaW9uLWljb24ge1xuICBmb250LXNpemU6IDIwcHg7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbn1cblxuaW9uLXNlZ21lbnQtYnV0dG9uIGlvbi1sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbWFyZ2luOiAwO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTc2cHgpIHtcbiAgaW9uLXNlZ21lbnQtYnV0dG9uIHtcbiAgICAtLXBhZGRpbmc6IDRweCA2cHg7XG4gIH1cblxuICBpb24tc2VnbWVudC1idXR0b24gaW9uLWxhYmVsIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgaW9uLXNlZ21lbnQtYnV0dG9uIGlvbi1pY29uIHtcbiAgICBtYXJnaW4tYm90dG9tOiAwO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 4653:
/*!************************************************************************************!*\
  !*** ./src/app/modules/listing/relatedAccount/pages/applicants/applicants.page.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApplicantsPage: () => (/* binding */ ApplicantsPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 5536);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 1640);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 5117);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../state/selectors/listings.selectors */ 2320);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var _components_applicant_details_modal_applicant_details_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/applicant-details-modal/applicant-details-modal.component */ 6288);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../../shared/components/app-header/app-header.component */ 8245);
/* harmony import */ var _pages_listing_detail_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../pages/listing-detail/components/hero/hero.component */ 5000);
/* harmony import */ var _shared_pipes_timestamp_pipe__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../shared/pipes/timestamp.pipe */ 9260);
/* harmony import */ var _shared_pipes_phone_format_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../shared/pipes/phone-format.pipe */ 5013);

var _ApplicantsPage;














function ApplicantsPage_app_hero_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "app-hero", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](1, "async");
  }
  if (rf & 2) {
    let tmp_3_0;
    const listing_r1 = ctx.ngIf;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("listing", listing_r1)("isOwner", (tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](1, 3, ctx_r1.isOwner$)) !== null && tmp_3_0 !== undefined ? tmp_3_0 : false)("showButtons", false);
  }
}
function ApplicantsPage_ion_loading_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "ion-loading", 7);
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "img", 13);
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", account_r4.iconImage, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_h3_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](account_r4.email);
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_p_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "phoneFormat");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, account_r4.phone), " ");
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_p_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "timestamp");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" Applied: ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, account_r4.applicationDate), " ");
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_ion_badge_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-badge", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("color", account_r4.status === "accepted" ? "success" : account_r4.status === "rejected" ? "danger" : "primary");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", account_r4.status, " ");
  }
}
function ApplicantsPage_ion_list_7_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-item", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ApplicantsPage_ion_list_7_ion_item_1_Template_ion_item_click_0_listener() {
      const account_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.openApplicantDetailsModal(account_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "ion-avatar", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, ApplicantsPage_ion_list_7_ion_item_1_img_2_Template, 1, 1, "img", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "ion-label")(4, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, ApplicantsPage_ion_list_7_ion_item_1_h3_6_Template, 2, 1, "h3", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, ApplicantsPage_ion_list_7_ion_item_1_p_8_Template, 3, 3, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, ApplicantsPage_ion_list_7_ion_item_1_p_10_Template, 3, 3, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](11, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](12, ApplicantsPage_ion_list_7_ion_item_1_ion_badge_12_Template, 2, 2, "ion-badge", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](13, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const account_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", account_r4.iconImage);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate2"]("", account_r4.firstName, " ", account_r4.lastName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 7, ctx_r1.isOwner$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", account_r4.phone && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](9, 9, ctx_r1.isOwner$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](11, 11, ctx_r1.isOwner$));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](13, 13, ctx_r1.isOwner$));
  }
}
function ApplicantsPage_ion_list_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-list");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, ApplicantsPage_ion_list_7_ion_item_1_Template, 14, 15, "ion-item", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, ctx_r1.paginatedAccounts$));
  }
}
function ApplicantsPage_ion_text_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-text", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const error_r5 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", error_r5, " ");
  }
}
function ApplicantsPage_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "ion-text", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const range_r6 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate3"](" ", range_r6.start, "-", range_r6.end, " of ", range_r6.total, " ");
  }
}
function ApplicantsPage_ng_container_15_ion_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ApplicantsPage_ng_container_15_ion_button_4_Template_ion_button_click_0_listener() {
      const page_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r8).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.goToPage(page_r9));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const page_r9 = ctx.$implicit;
    const pageData_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("color", pageData_r10.currentPage === page_r9 ? "primary" : "medium");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", page_r9, " ");
  }
}
function ApplicantsPage_ng_container_15_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "ion-text");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2, "...");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "ion-button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ApplicantsPage_ng_container_15_ng_container_5_Template_ion_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r11);
      const pageData_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().ngIf;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.goToPage(pageData_r10.totalPages));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pageData_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", pageData_r10.currentPage === pageData_r10.totalPages);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", pageData_r10.totalPages, " ");
  }
}
function ApplicantsPage_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 17)(2, "ion-button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ApplicantsPage_ng_container_15_Template_ion_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.previousPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "ion-icon", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, ApplicantsPage_ng_container_15_ion_button_4_Template, 2, 2, "ion-button", 20)(5, ApplicantsPage_ng_container_15_ng_container_5_Template, 5, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "ion-button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ApplicantsPage_ng_container_15_Template_ion_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.nextPage());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](7, "ion-icon", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const pageData_r10 = ctx.ngIf;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", pageData_r10.currentPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", pageData_r10.pageNumbers);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", pageData_r10.totalPages > ctx_r1.maxVisiblePages && pageData_r10.pageNumbers.length && pageData_r10.pageNumbers[pageData_r10.pageNumbers.length - 1] < pageData_r10.totalPages);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", pageData_r10.currentPage === pageData_r10.totalPages);
  }
}
class ApplicantsPage {
  constructor(store, route, modalController, router) {
    this.store = store;
    this.route = route;
    this.modalController = modalController;
    this.router = router;
    this.currentPageSubject = new rxjs__WEBPACK_IMPORTED_MODULE_10__.BehaviorSubject(1);
    this.currentPage$ = this.currentPageSubject.asObservable();
    this.pageSize = 20; // Items per page
    this.maxVisiblePages = 5; // Max visible page numbers
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.relatedAccounts$ = this.store.select((0,_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectRelatedAccountsByListingId)(this.listingId));
    this.loading$ = this.store.select(state => state.listings.loading);
    this.error$ = this.store.select(state => state.listings.error);
    this.listing$ = this.store.select((0,_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectListingById)(this.listingId));
    // Determine if current user is the listing creator
    this.isOwner$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAuthUser), this.listing$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([user, listing]) => !!(user && listing && listing.createdBy === user.uid)));
  }
  ngOnInit() {
    if (this.listingId) {
      this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingRelatedAccounts({
        listingId: this.listingId
      }));
    }
    // Calculate total items dynamically
    this.totalItems$ = this.relatedAccounts$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(accounts => accounts.length));
    // Calculate total pages
    this.totalPages$ = this.totalItems$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(totalItems => Math.ceil(totalItems / this.pageSize)));
    // Generate paginated accounts
    this.paginatedAccounts$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.relatedAccounts$, this.currentPage$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([accounts, currentPage]) => {
      const startIndex = (currentPage - 1) * this.pageSize;
      return accounts.slice(startIndex, startIndex + this.pageSize);
    }));
    // Generate page numbers
    this.pageNumbers$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.currentPage$, this.totalPages$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([currentPage, totalPages]) => {
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
    // Calculate start and end indices for the current page
    this.currentPageStart$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.currentPage$, this.totalItems$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([currentPage, totalItems]) => {
      const start = (currentPage - 1) * this.pageSize + 1;
      return Math.min(start, totalItems);
    }));
    this.currentPageEnd$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.currentPage$, this.totalItems$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([currentPage, totalItems]) => Math.min(currentPage * this.pageSize, totalItems)));
    // Combine pagination observables
    this.pagination$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.currentPage$, this.totalPages$, this.pageNumbers$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([currentPage, totalPages, pageNumbers]) => ({
      currentPage,
      totalPages,
      pageNumbers
    })));
    // Combine current page range observables
    this.currentPageRange$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.currentPageStart$, this.currentPageEnd$, this.totalItems$]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.map)(([start, end, total]) => ({
      start,
      end,
      total
    })));
  }
  openApplicantDetailsModal(account) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Check if the user is the owner
      (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([_this.isOwner$, _this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_3__.selectAuthUser)]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(([isOwner, authUser]) => {
        // Check if user is owner or if it's their own account
        if (isOwner && authUser && authUser.uid !== account.id) {
          // Open modal for owners or account owners
          _this.openModal(account, isOwner);
        } else {
          // Navigate to profile for other users
          _this.router.navigate(["/account", account.id]);
        }
      });
    })();
  }
  openModal(relatedAccount, isOwner) {
    var _this2 = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const modal = yield _this2.modalController.create({
        component: _components_applicant_details_modal_applicant_details_modal_component__WEBPACK_IMPORTED_MODULE_4__.ApplicantDetailsModalComponent,
        componentProps: {
          relatedAccount,
          isOwner
        }
      });
      yield modal.present();
    })();
  }
  // Pagination methods
  goToPage(pageNumber) {
    this.currentPageSubject.next(pageNumber);
  }
  nextPage() {
    this.currentPage$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(currentPage => {
      this.currentPageSubject.next(currentPage + 1);
    });
  }
  previousPage() {
    this.currentPage$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(currentPage => {
      this.currentPageSubject.next(currentPage - 1);
    });
  }
}
_ApplicantsPage = ApplicantsPage;
_ApplicantsPage.ɵfac = function ApplicantsPage_Factory(t) {
  return new (t || _ApplicantsPage)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_14__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_15__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_16__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_15__.Router));
};
_ApplicantsPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
  type: _ApplicantsPage,
  selectors: [["app-applicants"]],
  decls: 17,
  vars: 19,
  consts: [["title", "Applicants", 3, "defaultHref"], [3, "listing", "isOwner", "showButtons", 4, "ngIf"], ["message", "Loading applicants...", 4, "ngIf"], [4, "ngIf"], ["color", "danger", 4, "ngIf"], [1, "pagination-toolbar"], [3, "listing", "isOwner", "showButtons"], ["message", "Loading applicants..."], [3, "click", 4, "ngFor", "ngForOf"], [3, "click"], ["slot", "start"], [3, "src", 4, "ngIf"], ["slot", "end", 3, "color", 4, "ngIf"], [3, "src"], ["slot", "end", 3, "color"], ["color", "danger"], [1, "pagination-range"], [1, "pagination-controls"], ["fill", "clear", 3, "click", "disabled"], ["name", "chevron-back-outline"], ["fill", "clear", 3, "color", "click", 4, "ngFor", "ngForOf"], ["name", "chevron-forward-outline"], ["fill", "clear", 3, "click", "color"]],
  template: function ApplicantsPage_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "app-header", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "ion-content");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](3, ApplicantsPage_app_hero_3_Template, 2, 5, "app-hero", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](5, ApplicantsPage_ion_loading_5_Template, 1, 0, "ion-loading", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](6, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, ApplicantsPage_ion_list_7_Template, 3, 3, "ion-list", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](8, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](9, ApplicantsPage_ion_text_9_Template, 2, 1, "ion-text", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](10, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "ion-footer")(12, "ion-toolbar", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](13, ApplicantsPage_ng_container_13_Template, 3, 3, "ng-container", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](14, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, ApplicantsPage_ng_container_15_Template, 8, 4, "ng-container", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](16, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("defaultHref", "/listings/" + ctx.listingId);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 7, ctx.listing$));
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](6, 9, ctx.loading$));
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](8, 11, ctx.loading$));
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](10, 13, ctx.error$));
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](14, 15, ctx.currentPageRange$));
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](16, 17, ctx.pagination$));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_17__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_17__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonAvatar, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonBadge, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonFooter, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonList, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonLoading, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_16__.IonToolbar, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_5__.AppHeaderComponent, _pages_listing_detail_components_hero_hero_component__WEBPACK_IMPORTED_MODULE_6__.HeroComponent, _angular_common__WEBPACK_IMPORTED_MODULE_17__.AsyncPipe, _shared_pipes_timestamp_pipe__WEBPACK_IMPORTED_MODULE_7__.TimestampPipe, _shared_pipes_phone_format_pipe__WEBPACK_IMPORTED_MODULE_8__.PhoneFormatPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.pagination-toolbar[_ngcontent-%COMP%] {\n  display: flex; \n\n  justify-content: center; \n\n  align-items: center; \n\n  padding: 0.5rem 1rem;\n  gap: 2rem; \n\n  width: 100%; \n\n  box-sizing: border-box; \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-range[_ngcontent-%COMP%], .pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%] {\n  display: flex; \n\n  align-items: center; \n\n  gap: 0.5rem; \n\n  flex-shrink: 0; \n\n  justify-content: center; \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --background: transparent; \n\n  --color: var(--ion-color-medium); \n\n  padding: 0; \n\n  font-size: 1rem; \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button.active[_ngcontent-%COMP%] {\n  --color: var(--ion-color-primary); \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%]:hover {\n  --color: var(--ion-color-primary-shade); \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem; \n\n}\n.pagination-toolbar[_ngcontent-%COMP%]   .pagination-controls[_ngcontent-%COMP%]   ion-text[_ngcontent-%COMP%] {\n  margin: 0 0.25rem; \n\n  white-space: nowrap; \n\n}\n\n\n\n@media (max-width: 768px) {\n  .pagination-toolbar[_ngcontent-%COMP%] {\n    flex-direction: column; \n\n    gap: 1rem; \n\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3JlbGF0ZWRBY2NvdW50L3BhZ2VzL2FwcGxpY2FudHMvYXBwbGljYW50cy5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRkFBQTtBQW1CQTtFQUNFLGFBQUEsRUFBQSxtQkFBQTtFQUNBLHVCQUFBLEVBQUEsOEJBQUE7RUFDQSxtQkFBQSxFQUFBLDRCQUFBO0VBQ0Esb0JBQUE7RUFDQSxTQUFBLEVBQUEseUNBQUE7RUFDQSxXQUFBLEVBQUEsNENBQUE7RUFDQSxzQkFBQSxFQUFBLDBDQUFBO0VBRUEsbURBQUE7RUFDQSwyQkFBQTtFQUVBLCtCQUFBO0VBVUEsbUJBQUE7RUFnQkEsaUJBQUE7RUFLQSwwQkFBQTtBQTdCRjtBQURFOztFQUVFLGFBQUEsRUFBQSw2QkFBQTtFQUNBLG1CQUFBLEVBQUEsOEJBQUE7RUFDQSxXQUFBLEVBQUEsMEJBQUE7RUFDQSxjQUFBLEVBQUEsc0JBQUE7RUFDQSx1QkFBQSxFQUFBLCtCQUFBO0FBR0o7QUFDRTtFQUNFLHlCQUFBLEVBQUEsMkJBQUE7RUFDQSxnQ0FBQSxFQUFBLGtCQUFBO0VBQ0EsVUFBQSxFQUFBLDJCQUFBO0VBQ0EsZUFBQSxFQUFBLHFCQUFBO0FBQ0o7QUFDSTtFQUNFLGlDQUFBLEVBQUEsd0JBQUE7QUFDTjtBQUVJO0VBQ0UsdUNBQUEsRUFBQSxnQkFBQTtBQUFOO0FBS0U7RUFDRSxpQkFBQSxFQUFBLHFCQUFBO0FBSEo7QUFPRTtFQUNFLGlCQUFBLEVBQUEsMEJBQUE7RUFDQSxtQkFBQSxFQUFBLCtCQUFBO0FBTEo7O0FBU0EsMENBQUE7QUFDQTtFQUNFO0lBQ0Usc0JBQUEsRUFBQSw4QkFBQTtJQUNBLFNBQUEsRUFBQSxtQ0FBQTtFQU5GO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi5wYWdpbmF0aW9uLXRvb2xiYXIge1xuICBkaXNwbGF5OiBmbGV4OyAvKiBFbmFibGUgRmxleGJveCAqL1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgLyogQ2VudGVyIGl0ZW1zIGhvcml6b250YWxseSAqL1xuICBhbGlnbi1pdGVtczogY2VudGVyOyAvKiBDZW50ZXIgaXRlbXMgdmVydGljYWxseSAqL1xuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcbiAgZ2FwOiAycmVtOyAvKiBTcGFjZSBiZXR3ZWVuIHRoZSByYW5nZSBhbmQgY29udHJvbHMgKi9cbiAgd2lkdGg6IDEwMCU7IC8qIEVuc3VyZSB0aGUgdG9vbGJhciBzcGFucyB0aGUgZnVsbCB3aWR0aCAqL1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiBJbmNsdWRlIHBhZGRpbmcgaW4gd2lkdGggY2FsY3VsYXRpb25zICovXG5cbiAgLyogT3B0aW9uYWw6IEFkZCBhIHRlbXBvcmFyeSBib3JkZXIgZm9yIGRlYnVnZ2luZyAqL1xuICAvKiBib3JkZXI6IDFweCBzb2xpZCByZWQ7ICovXG5cbiAgLyogQ3VycmVudCBQYWdlIFJhbmdlIFN0eWxpbmcgKi9cbiAgLnBhZ2luYXRpb24tcmFuZ2UsXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIHtcbiAgICBkaXNwbGF5OiBmbGV4OyAvKiBBcnJhbmdlIGJ1dHRvbnMgaW4gYSByb3cgKi9cbiAgICBhbGlnbi1pdGVtczogY2VudGVyOyAvKiBWZXJ0aWNhbGx5IGNlbnRlciBidXR0b25zICovXG4gICAgZ2FwOiAwLjVyZW07IC8qIFNwYWNlIGJldHdlZW4gYnV0dG9ucyAqL1xuICAgIGZsZXgtc2hyaW5rOiAwOyAvKiBQcmV2ZW50IHNocmlua2luZyAqL1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOyAvKiBDZW50ZXIgcGFnaW5hdGlvbiBjb250cm9scyAqL1xuICB9XG5cbiAgLyogQnV0dG9uIFN0eWxpbmcgKi9cbiAgLnBhZ2luYXRpb24tY29udHJvbHMgaW9uLWJ1dHRvbiB7XG4gICAgLS1iYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgLyogVHJhbnNwYXJlbnQgYmFja2dyb3VuZCAqL1xuICAgIC0tY29sb3I6IHZhcigtLWlvbi1jb2xvci1tZWRpdW0pOyAvKiBEZWZhdWx0IGNvbG9yICovXG4gICAgcGFkZGluZzogMDsgLyogUmVtb3ZlIGRlZmF1bHQgcGFkZGluZyAqL1xuICAgIGZvbnQtc2l6ZTogMXJlbTsgLyogQWRqdXN0IGZvbnQgc2l6ZSAqL1xuXG4gICAgJi5hY3RpdmUge1xuICAgICAgLS1jb2xvcjogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpOyAvKiBBY3RpdmUgYnV0dG9uIGNvbG9yICovXG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAtLWNvbG9yOiB2YXIoLS1pb24tY29sb3ItcHJpbWFyeS1zaGFkZSk7IC8qIEhvdmVyIGNvbG9yICovXG4gICAgfVxuICB9XG5cbiAgLyogSWNvbiBTdHlsaW5nICovXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIGlvbi1pY29uIHtcbiAgICBmb250LXNpemU6IDEuMnJlbTsgLyogQWRqdXN0IGljb24gc2l6ZSAqL1xuICB9XG5cbiAgLyogRWxsaXBzaXMgVGV4dCBTdHlsaW5nICovXG4gIC5wYWdpbmF0aW9uLWNvbnRyb2xzIGlvbi10ZXh0IHtcbiAgICBtYXJnaW46IDAgMC4yNXJlbTsgLyogU3BhY2UgYXJvdW5kIGVsbGlwc2lzICovXG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDsgLyogUHJldmVudCB0ZXh0IGZyb20gd3JhcHBpbmcgKi9cbiAgfVxufVxuXG4vKiBSZXNwb25zaXZlIERlc2lnbiBmb3IgU21hbGxlciBTY3JlZW5zICovXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLnBhZ2luYXRpb24tdG9vbGJhciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgLyogU3RhY2sgZWxlbWVudHMgdmVydGljYWxseSAqL1xuICAgIGdhcDogMXJlbTsgLyogUmVkdWNlZCBzcGFjZSBiZXR3ZWVuIGVsZW1lbnRzICovXG4gIH1cblxuICAucGFnaW5hdGlvbi1yYW5nZSxcbiAgLnBhZ2luYXRpb24tY29udHJvbHMge1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
});

/***/ }),

/***/ 6288:
/*!*****************************************************************************************************************************************!*\
  !*** ./src/app/modules/listing/relatedAccount/pages/applicants/components/applicant-details-modal/applicant-details-modal.component.ts ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApplicantDetailsModalComponent: () => (/* binding */ ApplicantDetailsModalComponent)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 9191);

var _ApplicantDetailsModalComponent;






function ApplicantDetailsModalComponent_ion_content_7_p_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p")(1, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Phone Number:");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.relatedAccount.phone, " ");
  }
}
function ApplicantDetailsModalComponent_ion_content_7_p_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p")(1, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "Notes:");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.relatedAccount.notes, " ");
  }
}
function ApplicantDetailsModalComponent_ion_content_7_ion_card_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-content")(2, "ion-item");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "ion-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Resume");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, " Download ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpropertyInterpolate"]("href", ctx_r0.relatedAccount.resumeFile);
  }
}
function ApplicantDetailsModalComponent_ion_content_7_ion_card_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-card")(1, "ion-card-content")(2, "ion-item");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "ion-icon", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-label");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, "Cover Letter");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "ion-button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7, " Download ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpropertyInterpolate"]("href", ctx_r0.relatedAccount.coverLetterFile);
  }
}
function ApplicantDetailsModalComponent_ion_content_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-content")(1, "ion-card")(2, "ion-card-header")(3, "ion-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "Applicant Information");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "ion-card-content")(6, "p")(7, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, "First Name:");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "p")(11, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12, "Last Name:");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "p")(15, "strong");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "Email Address:");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](18, ApplicantDetailsModalComponent_ion_content_7_p_18_Template, 4, 1, "p", 3)(19, ApplicantDetailsModalComponent_ion_content_7_p_19_Template, 4, 1, "p", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](20, ApplicantDetailsModalComponent_ion_content_7_ion_card_20_Template, 8, 1, "ion-card", 3)(21, ApplicantDetailsModalComponent_ion_content_7_ion_card_21_Template, 8, 1, "ion-card", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.relatedAccount.firstName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.relatedAccount.lastName, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r0.relatedAccount.email, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.relatedAccount.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.relatedAccount.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.relatedAccount == null ? null : ctx_r0.relatedAccount.resumeFile);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r0.relatedAccount == null ? null : ctx_r0.relatedAccount.coverLetterFile);
  }
}
class ApplicantDetailsModalComponent {
  constructor(modalController, router, store) {
    this.modalController = modalController;
    this.router = router;
    this.store = store;
    this.isOwner = false;
  }
  closeModal() {
    this.modalController.dismiss();
  }
  copyEmail() {
    navigator.clipboard.writeText(this.relatedAccount.email);
    this.showToast("Email copied to clipboard!");
  }
  rejectApplication() {
    this.updateApplicationStatus("rejected", "Application rejected!");
  }
  acceptApplication() {
    this.updateApplicationStatus("accepted", "Application accepted!");
  }
  viewProfile() {
    this.router.navigate(["/account", this.relatedAccount.id]);
    this.closeModal();
  }
  updateApplicationStatus(status, successMessage) {
    const updatedAccount = {
      ...this.relatedAccount,
      status
    };
    // Dispatch an action to update the status in the store
    this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateRelatedAccount({
      listingId: this.relatedAccount.listingId,
      relatedAccount: updatedAccount
    }));
    this.showToast(successMessage);
    this.closeModal();
  }
  showToast(message) {
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const toast = document.createElement("ion-toast");
      toast.message = message;
      toast.duration = 2000;
      document.body.appendChild(toast);
      yield toast.present();
    })();
  }
}
_ApplicantDetailsModalComponent = ApplicantDetailsModalComponent;
_ApplicantDetailsModalComponent.ɵfac = function ApplicantDetailsModalComponent_Factory(t) {
  return new (t || _ApplicantDetailsModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_3__.ModalController), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_5__.Store));
};
_ApplicantDetailsModalComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: _ApplicantDetailsModalComponent,
  selectors: [["app-applicant-details-modal"]],
  inputs: {
    relatedAccount: "relatedAccount",
    isOwner: "isOwner"
  },
  decls: 24,
  vars: 2,
  consts: [["slot", "end"], [3, "click"], ["name", "close"], [4, "ngIf"], ["size", "6"], ["expand", "block", "color", "medium", 3, "click"], ["expand", "block", "color", "primary", 3, "click"], ["expand", "block", "color", "success", 3, "click"], ["expand", "block", "color", "danger", 3, "click"], ["name", "document-outline", "slot", "start"], ["fill", "clear", "target", "_blank", 3, "href"]],
  template: function ApplicantDetailsModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "ion-header")(1, "ion-toolbar")(2, "ion-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "ion-buttons", 0)(5, "ion-button", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ApplicantDetailsModalComponent_Template_ion_button_click_5_listener() {
        return ctx.closeModal();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "ion-icon", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, ApplicantDetailsModalComponent_ion_content_7_Template, 22, 7, "ion-content", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "ion-footer")(9, "ion-grid")(10, "ion-row")(11, "ion-col", 4)(12, "ion-button", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ApplicantDetailsModalComponent_Template_ion_button_click_12_listener() {
        return ctx.copyEmail();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13, " Copy Email ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "ion-col", 4)(15, "ion-button", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ApplicantDetailsModalComponent_Template_ion_button_click_15_listener() {
        return ctx.viewProfile();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, " View Profile ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "ion-row")(18, "ion-col", 4)(19, "ion-button", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ApplicantDetailsModalComponent_Template_ion_button_click_19_listener() {
        return ctx.acceptApplication();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](20, " Accept ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](21, "ion-col", 4)(22, "ion-button", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function ApplicantDetailsModalComponent_Template_ion_button_click_22_listener() {
        return ctx.rejectApplication();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, " Reject ");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", ctx.relatedAccount.name, " Application Details");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.isOwner);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonButtons, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonFooter, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonIcon, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.IonToolbar],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-card[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\nion-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  padding: 16px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3JlbGF0ZWRBY2NvdW50L3BhZ2VzL2FwcGxpY2FudHMvY29tcG9uZW50cy9hcHBsaWNhbnQtZGV0YWlscy1tb2RhbC9hcHBsaWNhbnQtZGV0YWlscy1tb2RhbC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBO0VBQ0UsbUJBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLGFBQUE7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuKiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm06IEFsbG93aW5nIFVzZXJzIGFuZCBPcmdhbml6YXRpb25zIHRvIENvbGxhYm9yYXRlLlxuKiBDb3B5cmlnaHQgKEMpIDIwMjMgIEFTQ0VORHluYW1pY3MgTkZQXG4qXG4qIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS5cbipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkXG4qIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4qIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qIGFsb25nIHdpdGggTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuaW9uLWNhcmQge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG5pb24tZm9vdGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBwYWRkaW5nOiAxNnB4O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 1733:
/*!**************************************************************************!*\
  !*** ./src/app/modules/listing/relatedAccount/pages/apply/apply.page.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApplyPage: () => (/* binding */ ApplyPage)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 8015);
/* harmony import */ var _state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../state/selectors/auth.selectors */ 9559);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 5117);
/* harmony import */ var _state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../state/actions/listings.actions */ 7118);
/* harmony import */ var _state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../state/selectors/listings.selectors */ 2320);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ 5480);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 9191);
/* harmony import */ var _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../shared/components/app-header/app-header.component */ 8245);

var _ApplyPage;












const _c0 = ["resumeInput"];
const _c1 = ["coverLetterInput"];
function ApplyPage_ion_note_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " First Name is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " First Name must be at least 2 characters long. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Last Name is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Last Name must be at least 2 characters long. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Email is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Please enter a valid email address. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Phone Number is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_note_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-note", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Phone Number must be at least 7 characters long. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ApplyPage_ion_text_60_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-text");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" Selected File: ", ctx_r2.resumeFileName, " ");
  }
}
function ApplyPage_ion_text_77_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-text");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" Selected File: ", ctx_r2.coverLetterFileName, " ");
  }
}
class ApplyPage {
  constructor(fb, store, route, alertController) {
    this.fb = fb;
    this.store = store;
    this.route = route;
    this.alertController = alertController;
    this.resumeFile = null;
    this.coverLetterFile = null;
    this.resumeFileName = "";
    this.coverLetterFileName = "";
    this.applyForm = this.fb.group({
      firstName: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(2)]],
      lastName: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(2)]],
      email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.email]],
      phone: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(7)]],
      notes: [""]
    });
    this.authUser$ = this.store.select(_state_selectors_auth_selectors__WEBPACK_IMPORTED_MODULE_1__.selectAuthUser);
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.listing$ = this.store.select((0,_state_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_3__.selectListingById)(this.listingId));
  }
  ngOnInit() {
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.take)(1)).subscribe(authUser => {
      if (authUser) {
        const [firstName, ...lastNameParts] = (authUser.name || "").split(" ");
        const lastName = lastNameParts.join(" ");
        this.applyForm.patchValue({
          firstName: firstName || "",
          lastName: lastName || "",
          email: authUser.email || "",
          phone: authUser.phoneNumber || ""
        });
      }
    });
  }
  onFileSelect(event, type) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== "application/pdf") {
        this.showAlert("Invalid File", "Please upload a valid PDF file.");
        input.value = ""; // Reset the input
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.showAlert("File Too Large", "File size must not exceed 10 MB.");
        input.value = ""; // Reset the input
        return;
      }
      if (type === "resume") {
        this.resumeFile = file;
        this.resumeFileName = file.name;
      } else if (type === "coverLetter") {
        this.coverLetterFile = file;
        this.coverLetterFileName = file.name;
      }
    }
  }
  formatPhoneNumber(event) {
    const input = event.target;
    let phone = input.value.replace(/\D/g, ""); // Remove all non-numeric characters
    if (phone.length > 3 && phone.length <= 6) {
      phone = `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    } else if (phone.length > 6) {
      phone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    }
    input.value = phone; // Update the input value
  }
  onSubmit() {
    if (!this.applyForm.valid) {
      this.markFormAsDirty(this.applyForm);
      this.showAlert("Form Invalid", "Please fill out all required fields correctly.");
      return;
    }
    this.authUser$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.take)(1)).subscribe(authUser => {
      if (!authUser) {
        this.showAlert("Error", "Unable to fetch user information. Please try again.");
        return;
      }
      const relatedAccount = {
        ...this.applyForm.value,
        id: authUser.uid,
        // Populate the id
        name: authUser.name,
        iconImage: authUser.iconImage,
        heroImage: authUser.heroImage,
        accountId: authUser.uid,
        // Populate the accountId
        resumeFile: this.resumeFile,
        coverLetterFile: this.coverLetterFile,
        listingId: this.listingId,
        type: "application",
        status: "applied"
      };
      // Dispatch action to submit application
      this.store.dispatch(_state_actions_listings_actions__WEBPACK_IMPORTED_MODULE_2__.submitApplication({
        relatedAccount
      }));
      this.showAlert("Application Submitted", "Your application has been submitted successfully!");
      console.log("Form Submitted!", relatedAccount);
    });
  }
  markFormAsDirty(formGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }
  showAlert(header, message) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const alert = yield _this.alertController.create({
        header,
        message,
        buttons: ["OK"]
      });
      yield alert.present();
    })();
  }
}
_ApplyPage = ApplyPage;
_ApplyPage.ɵfac = function ApplyPage_Factory(t) {
  return new (t || _ApplyPage)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_8__.Store), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_9__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_10__.AlertController));
};
_ApplyPage.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
  type: _ApplyPage,
  selectors: [["app-apply"]],
  viewQuery: function ApplyPage_Query(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵviewQuery"](_c0, 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵviewQuery"](_c1, 5);
    }
    if (rf & 2) {
      let _t;
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵloadQuery"]()) && (ctx.resumeInput = _t.first);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵloadQuery"]()) && (ctx.coverLetterInput = _t.first);
    }
  },
  decls: 82,
  vars: 15,
  consts: [["resumeInput", ""], ["coverLetterInput", ""], [3, "defaultHref", "title"], [3, "ngSubmit", "formGroup"], ["size", "12"], ["lines", "none"], ["formControlName", "firstName", "label", "First Name", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your first name"], ["color", "danger", 4, "ngIf"], ["formControlName", "lastName", "label", "Last Name", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your last name"], ["formControlName", "email", "type", "email", "label", "Email Address", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your email address"], ["formControlName", "phone", "type", "tel", "label", "Phone Number", "label-placement", "floating", "fill", "outline", "placeholder", "Enter your phone number", 3, "ionInput"], ["formControlName", "notes", "label", "Notes", "label-placement", "floating", "fill", "outline", "placeholder", "Enter any additional information", "auto-grow", "true"], ["fill", "outline", 3, "click"], ["type", "file", "accept", "application/pdf", "hidden", "", 3, "change"], [4, "ngIf"], ["expand", "block", "color", "primary", "type", "submit"], ["color", "danger"]],
  template: function ApplyPage_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "ion-header");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-header", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "ion-content")(4, "form", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ngSubmit", function ApplyPage_Template_form_ngSubmit_4_listener() {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.onSubmit());
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "ion-grid")(6, "ion-row")(7, "ion-col", 4)(8, "ion-card")(9, "ion-card-header")(10, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11, "Apply to this Opportunity");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](13, " Please complete the form below to apply to this position ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "ion-card-content")(15, "ion-grid")(16, "ion-row")(17, "ion-col", 4)(18, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](19, "ion-input", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](20, ApplyPage_ion_note_20_Template, 2, 0, "ion-note", 7)(21, ApplyPage_ion_note_21_Template, 2, 0, "ion-note", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](22, "ion-row")(23, "ion-col", 4)(24, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](25, "ion-input", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](26, ApplyPage_ion_note_26_Template, 2, 0, "ion-note", 7)(27, ApplyPage_ion_note_27_Template, 2, 0, "ion-note", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "ion-row")(29, "ion-col", 4)(30, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](31, "ion-input", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](32, ApplyPage_ion_note_32_Template, 2, 0, "ion-note", 7)(33, ApplyPage_ion_note_33_Template, 2, 0, "ion-note", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](34, "ion-row")(35, "ion-col", 4)(36, "ion-item", 5)(37, "ion-input", 10);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ionInput", function ApplyPage_Template_ion_input_ionInput_37_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.formatPhoneNumber($event));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](38, ApplyPage_ion_note_38_Template, 2, 0, "ion-note", 7)(39, ApplyPage_ion_note_39_Template, 2, 0, "ion-note", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](40, "ion-row")(41, "ion-col", 4)(42, "ion-item", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](43, "ion-textarea", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](44, "ion-row")(45, "ion-col", 4)(46, "ion-card")(47, "ion-card-header")(48, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](49, "Resume (if applicable)");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](50, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](51, " Resume must be uploaded in PDF format (Max 10 MB) ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](52, "ion-card-content")(53, "ion-item", 5)(54, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](55, "Upload Resume");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](56, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ApplyPage_Template_ion_button_click_56_listener() {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        const resumeInput_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](59);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](resumeInput_r2.click());
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](57, " Choose File ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](58, "input", 13, 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ApplyPage_Template_input_change_58_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.onFileSelect($event, "resume"));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](60, ApplyPage_ion_text_60_Template, 2, 1, "ion-text", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](61, "ion-row")(62, "ion-col", 4)(63, "ion-card")(64, "ion-card-header")(65, "ion-card-title");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](66, "Cover Letter (if applicable)");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](67, "ion-card-subtitle");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](68, "Maximum size: 10 MB");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](69, "ion-card-content")(70, "ion-item", 5)(71, "ion-label");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](72, "Upload Cover Letter");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](73, "ion-button", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ApplyPage_Template_ion_button_click_73_listener() {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        const coverLetterInput_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](76);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](coverLetterInput_r4.click());
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](74, " Choose File ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](75, "input", 13, 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ApplyPage_Template_input_change_75_listener($event) {
        _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
        return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx.onFileSelect($event, "coverLetter"));
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](77, ApplyPage_ion_text_77_Template, 2, 1, "ion-text", 14);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](78, "ion-row")(79, "ion-col")(80, "ion-button", 15);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](81, " Submit ");
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_9_0;
      let tmp_10_0;
      let tmp_11_0;
      let tmp_12_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("defaultHref", "/listings/" + ctx.listingId)("title", "Apply for " + ((tmp_3_0 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 13, ctx.listing$)) == null ? null : tmp_3_0.title));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("formGroup", ctx.applyForm);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](16);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_5_0 = ctx.applyForm.get("firstName")) == null ? null : tmp_5_0.touched) && ((tmp_5_0 = ctx.applyForm.get("firstName")) == null ? null : tmp_5_0.errors == null ? null : tmp_5_0.errors["required"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_6_0 = ctx.applyForm.get("firstName")) == null ? null : tmp_6_0.touched) && ((tmp_6_0 = ctx.applyForm.get("firstName")) == null ? null : tmp_6_0.errors == null ? null : tmp_6_0.errors["minlength"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_7_0 = ctx.applyForm.get("lastName")) == null ? null : tmp_7_0.touched) && ((tmp_7_0 = ctx.applyForm.get("lastName")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors["required"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_8_0 = ctx.applyForm.get("lastName")) == null ? null : tmp_8_0.touched) && ((tmp_8_0 = ctx.applyForm.get("lastName")) == null ? null : tmp_8_0.errors == null ? null : tmp_8_0.errors["minlength"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_9_0 = ctx.applyForm.get("email")) == null ? null : tmp_9_0.touched) && ((tmp_9_0 = ctx.applyForm.get("email")) == null ? null : tmp_9_0.errors == null ? null : tmp_9_0.errors["required"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_10_0 = ctx.applyForm.get("email")) == null ? null : tmp_10_0.touched) && ((tmp_10_0 = ctx.applyForm.get("email")) == null ? null : tmp_10_0.errors == null ? null : tmp_10_0.errors["email"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_11_0 = ctx.applyForm.get("phone")) == null ? null : tmp_11_0.touched) && ((tmp_11_0 = ctx.applyForm.get("phone")) == null ? null : tmp_11_0.errors == null ? null : tmp_11_0.errors["required"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_12_0 = ctx.applyForm.get("phone")) == null ? null : tmp_12_0.touched) && ((tmp_12_0 = ctx.applyForm.get("phone")) == null ? null : tmp_12_0.errors == null ? null : tmp_12_0.errors["minlength"]));
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](21);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.resumeFileName);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.coverLetterFileName);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatusGroup, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonButton, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCard, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCardContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCardHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCardSubtitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCardTitle, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonCol, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonContent, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonGrid, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonHeader, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonInput, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonItem, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonLabel, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonNote, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonRow, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonText, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.IonTextarea, _ionic_angular__WEBPACK_IMPORTED_MODULE_10__.TextValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormControlName, _shared_components_app_header_app_header_component__WEBPACK_IMPORTED_MODULE_4__.AppHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_11__.AsyncPipe],
  styles: ["\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nion-header[_ngcontent-%COMP%] {\n  --background: var(--ion-color-primary);\n  --color: white;\n}\n\nion-content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n\nh2[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  margin: 0;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0 0 16px 0;\n  color: var(--ion-color-medium);\n}\n\nion-input[_ngcontent-%COMP%], ion-textarea[_ngcontent-%COMP%] {\n  margin: 8px auto;\n}\n\nion-card[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n\nion-item[_ngcontent-%COMP%] {\n  --padding-start: 0;\n  --inner-padding-end: 0;\n}\n\nion-button[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n\nion-text[_ngcontent-%COMP%] {\n  display: block;\n  margin-top: 8px;\n  color: var(--ion-color-medium);\n}\n\nion-button[type=submit][_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbW9kdWxlcy9saXN0aW5nL3JlbGF0ZWRBY2NvdW50L3BhZ2VzL2FwcGx5L2FwcGx5LnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OytGQUFBO0FBbUJBLHlEQUFBO0FBRUE7RUFDRSxzQ0FBQTtFQUNBLGNBQUE7QUFBRjs7QUFHQTtFQUNFLGFBQUE7QUFBRjs7QUFHQTtFQUNFLGlCQUFBO0VBQ0EsU0FBQTtBQUFGOztBQUdBO0VBQ0Usa0JBQUE7RUFDQSw4QkFBQTtBQUFGOztBQUdBOztFQUVFLGdCQUFBO0FBQUY7O0FBR0E7RUFDRSxtQkFBQTtBQUFGOztBQUdBO0VBQ0Usa0JBQUE7RUFDQSxzQkFBQTtBQUFGOztBQUdBO0VBQ0UsaUJBQUE7QUFBRjs7QUFHQTtFQUNFLGNBQUE7RUFDQSxlQUFBO0VBQ0EsOEJBQUE7QUFBRjs7QUFHQTtFQUNFLGdCQUFBO0FBQUYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiogTm9ucHJvZml0IFNvY2lhbCBOZXR3b3JraW5nIFBsYXRmb3JtOiBBbGxvd2luZyBVc2VycyBhbmQgT3JnYW5pemF0aW9ucyB0byBDb2xsYWJvcmF0ZS5cbiogQ29weXJpZ2h0IChDKSAyMDIzICBBU0NFTkR5bmFtaWNzIE5GUFxuKlxuKiBUaGlzIGZpbGUgaXMgcGFydCBvZiBOb25wcm9maXQgU29jaWFsIE5ldHdvcmtpbmcgUGxhdGZvcm0uXG4qXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4qIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZFxuKiBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4qIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4qIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4qIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiBhbG9uZyB3aXRoIE5vbnByb2ZpdCBTb2NpYWwgTmV0d29ya2luZyBQbGF0Zm9ybS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qIHNyYy9hcHAvbW9kdWxlcy9saXN0aW5ncy9wYWdlcy9hcHBseS9hcHBseS5wYWdlLnNjc3MgKi9cblxuaW9uLWhlYWRlciB7XG4gIC0tYmFja2dyb3VuZDogdmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICAtLWNvbG9yOiB3aGl0ZTtcbn1cblxuaW9uLWNvbnRlbnQge1xuICBwYWRkaW5nOiAxNnB4O1xufVxuXG5oMiB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBtYXJnaW46IDA7XG59XG5cbnAge1xuICBtYXJnaW46IDAgMCAxNnB4IDA7XG4gIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItbWVkaXVtKTtcbn1cblxuaW9uLWlucHV0LFxuaW9uLXRleHRhcmVhIHtcbiAgbWFyZ2luOiA4cHggYXV0bztcbn1cblxuaW9uLWNhcmQge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xufVxuXG5pb24taXRlbSB7XG4gIC0tcGFkZGluZy1zdGFydDogMDtcbiAgLS1pbm5lci1wYWRkaW5nLWVuZDogMDtcbn1cblxuaW9uLWJ1dHRvbiB7XG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xufVxuXG5pb24tdGV4dCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIGNvbG9yOiB2YXIoLS1pb24tY29sb3ItbWVkaXVtKTtcbn1cblxuaW9uLWJ1dHRvblt0eXBlPVwic3VibWl0XCJdIHtcbiAgbWFyZ2luLXRvcDogMTZweDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
});

/***/ }),

/***/ 9932:
/*!*****************************************************!*\
  !*** ./src/app/shared/pipes/format-address.pipe.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormatAddressPipe: () => (/* binding */ FormatAddressPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
var _FormatAddressPipe;

class FormatAddressPipe {
  transform(address) {
    if (!address) return "";
    const parts = [address.street, address.city, address.state, address.country, address.zipcode].filter(part => part);
    return parts.join(", ");
  }
}
_FormatAddressPipe = FormatAddressPipe;
_FormatAddressPipe.ɵfac = function FormatAddressPipe_Factory(t) {
  return new (t || _FormatAddressPipe)();
};
_FormatAddressPipe.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
  name: "formatAddress",
  type: _FormatAddressPipe,
  pure: true
});

/***/ }),

/***/ 5013:
/*!***************************************************!*\
  !*** ./src/app/shared/pipes/phone-format.pipe.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PhoneFormatPipe: () => (/* binding */ PhoneFormatPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 6623);
var _PhoneFormatPipe;

class PhoneFormatPipe {
  transform(phoneNumber) {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      const intlCode = match[1] ? "+1 " : "";
      return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
    }
    return "";
  }
}
_PhoneFormatPipe = PhoneFormatPipe;
_PhoneFormatPipe.ɵfac = function PhoneFormatPipe_Factory(t) {
  return new (t || _PhoneFormatPipe)();
};
_PhoneFormatPipe.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
  name: "phoneFormat",
  type: _PhoneFormatPipe,
  pure: true
});

/***/ }),

/***/ 9260:
/*!************************************************!*\
  !*** ./src/app/shared/pipes/timestamp.pipe.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimestampPipe: () => (/* binding */ TimestampPipe)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/firestore */ 1342);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 6623);
var _TimestampPipe;


class TimestampPipe {
  transform(value) {
    if (!value) return null;
    // Handle Firestore Timestamp
    if (value instanceof firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.Timestamp) {
      return value.toDate();
    }
    // Handle server timestamp
    if (value.seconds) {
      return new firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.Timestamp(value.seconds, value.nanoseconds).toDate();
    }
    return null;
  }
}
_TimestampPipe = TimestampPipe;
_TimestampPipe.ɵfac = function TimestampPipe_Factory(t) {
  return new (t || _TimestampPipe)();
};
_TimestampPipe.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefinePipe"]({
  name: "timestamp",
  type: _TimestampPipe,
  pure: true
});

/***/ }),

/***/ 9540:
/*!***************************************************!*\
  !*** ./src/app/state/effects/listings.effects.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ListingsEffects: () => (/* binding */ ListingsEffects)
/* harmony export */ });
/* harmony import */ var _Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 6207);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/effects */ 1996);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 4752);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 3496);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 4406);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 8713);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 3901);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 5733);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 1856);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 1082);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs */ 5117);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 3396);
/* harmony import */ var _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/listings.actions */ 7118);
/* harmony import */ var _angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/fire/firestore */ 744);
/* harmony import */ var _selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../selectors/listings.selectors */ 2320);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 6623);
/* harmony import */ var _core_services_firestore_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/services/firestore.service */ 3073);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 1099);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @ionic/angular */ 1116);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @ngrx/store */ 5480);

var _ListingsEffects;











class ListingsEffects {
  constructor(actions$, firestoreService, router, toastController, store) {
    this.actions$ = actions$;
    this.firestoreService = firestoreService;
    this.router = router;
    this.toastController = toastController;
    this.store = store;
    // Create a new listing
    this.createListing$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.createListing), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      listing
    }) => {
      const newListing = {
        ...listing,
        createdAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)(),
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.from)(this.firestoreService.addDocument("listings", newListing)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(docId => {
        this.router.navigate([`/listings/${docId}`]);
        this.showToast("Listing created successfully", "success");
        return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.createListingSuccess({
          listing: {
            ...newListing,
            id: docId
          }
        });
      }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => {
        this.showToast(`Error: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.createListingFailure({
          error: error.message
        }));
      }));
    })));
    // Load all listings if not fresh
    this.loadListings$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListings), (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.withLatestFrom)(this.store.select(_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAreListingsFresh)), (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.filter)(([_, areFresh]) => !areFresh),
    // Only load if not fresh
    (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.switchMap)(() => this.firestoreService.getCollectionWithCondition("listings", "status", "==", "active").pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(listings => _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingsSuccess({
      listings
    })), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingsFailure({
      error: error.message
    })))))));
    // Load a single listing by ID if not already in the store
    this.loadListingById$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingById), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      id
    }) => this.store.select((0,_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectListingById)(id)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(listing => {
      if (listing) {
        // Listing already loaded
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingByIdSuccess({
          listing
        }));
      } else {
        // Fetch from Firestore
        return this.firestoreService.getDocument("listings", id).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(fetchedListing => {
          if (!fetchedListing) {
            throw new Error("Listing not found");
          }
          return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingByIdSuccess({
            listing: fetchedListing
          });
        }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingByIdFailure({
          error: error.message
        }))));
      }
    })))));
    // Update an existing listing
    this.updateListing$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateListing), (0,rxjs__WEBPACK_IMPORTED_MODULE_15__.debounceTime)(300), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      listing
    }) => {
      const updatedListing = {
        ...listing,
        lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)()
      };
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.from)(this.firestoreService.updateDocument("listings", listing.id, updatedListing)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(() => {
        this.router.navigate([`/listings/${listing.id}`]);
        this.showToast("Listing updated successfully", "success");
        return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateListingSuccess({
          listing: updatedListing
        });
      }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => {
        this.showToast(`Error updating listing: ${error.message}`, "danger");
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateListingFailure({
          error: error.message
        }));
      }));
    })));
    // Delete a listing
    this.deleteListing$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.deleteListing), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      id
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.from)(this.firestoreService.deleteDocument("listings", id)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(() => {
      this.showToast("Listing deleted successfully", "success");
      return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.deleteListingSuccess({
        id
      });
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => {
      this.showToast(`Error deleting listing: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.deleteListingFailure({
        error: error.message
      }));
    })))));
    // Submit application (related to a listing)
    this.submitApplication$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.submitApplication), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      relatedAccount
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.from)(this.submitApplicationToFirestore(relatedAccount)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(() => {
      this.router.navigate(["/listings", relatedAccount.listingId]);
      this.showToast("Application submitted successfully", "success");
      return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.submitApplicationSuccess();
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => {
      this.showToast(`Error submitting application: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.submitApplicationFailure({
        error: error.message
      }));
    })))));
    // Load related accounts for a listing if not fresh
    this.loadListingRelatedAccounts$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingRelatedAccounts), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      listingId
    }) => this.store.select((0,_selectors_listings_selectors__WEBPACK_IMPORTED_MODULE_2__.selectAreRelatedAccountsFresh)(listingId)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_14__.take)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.filter)(areFresh => !areFresh),
    // Only load if stale
    (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.switchMap)(() => this.firestoreService.getDocuments(`listings/${listingId}/relatedAccounts`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(relatedAccounts => {
      this.showToast("Applications loaded successfully", "success");
      return _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingRelatedAccountsSuccess({
        listingId,
        relatedAccounts
      });
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => {
      this.showToast(`Error loading applications: ${error.message}`, "danger");
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.loadListingRelatedAccountsFailure({
        listingId,
        error: error.message
      }));
    })))))));
    this.updateRelatedAccount$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => this.actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateRelatedAccount), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(({
      listingId,
      relatedAccount
    }) => (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.from)(this.firestoreService.updateDocument(`listings/${listingId}/relatedAccounts`, relatedAccount.id, relatedAccount)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.map)(() => _actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateRelatedAccountSuccess({
      listingId,
      relatedAccount
    })), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.of)(_actions_listings_actions__WEBPACK_IMPORTED_MODULE_1__.updateRelatedAccountFailure({
      error: error.message
    })))))));
  }
  // Helper method for submitting an application
  submitApplicationToFirestore(relatedAccount) {
    var _this = this;
    return (0,_Users_marcinufniarz_Desktop_ASCENDynamicsNFP_ascendcoopplatform_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const applicationId = relatedAccount.id;
        // Upload files if present
        const resumeFile = relatedAccount.resumeFile ? yield _this.firestoreService.uploadFile(`accounts/${applicationId}/listing/${relatedAccount.listingId}/resume.pdf`, relatedAccount.resumeFile) : null;
        const coverLetterFile = relatedAccount.coverLetterFile ? yield _this.firestoreService.uploadFile(`accounts/${applicationId}/listing/${relatedAccount.listingId}/coverLetter.pdf`, relatedAccount.coverLetterFile) : null;
        // Save application data using setDocument
        yield _this.firestoreService.setDocument(`listings/${relatedAccount.listingId}/relatedAccounts/${applicationId}`, {
          id: applicationId,
          name: relatedAccount.name,
          firstName: relatedAccount.firstName,
          lastName: relatedAccount.lastName,
          email: relatedAccount.email,
          phone: relatedAccount.phone,
          notes: relatedAccount.notes,
          resumeFile,
          coverLetterFile,
          listingId: relatedAccount.listingId,
          applicationDate: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)(),
          createdAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)(),
          lastModifiedAt: (0,_angular_fire_firestore__WEBPACK_IMPORTED_MODULE_6__.serverTimestamp)(),
          iconImage: relatedAccount.iconImage,
          accountId: applicationId,
          type: "application",
          status: "applied"
        }, {
          merge: true
        });
      } catch (error) {
        console.error("Error submitting application to Firestore:", error);
        throw new Error("Failed to submit application. Please try again later.");
      }
    })();
  }
  showToast(message, color) {
    this.toastController.create({
      message,
      duration: 2000,
      color
    }).then(toast => toast.present());
  }
}
_ListingsEffects = ListingsEffects;
_ListingsEffects.ɵfac = function ListingsEffects_Factory(t) {
  return new (t || _ListingsEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.Actions), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵinject"](_core_services_firestore_service__WEBPACK_IMPORTED_MODULE_3__.FirestoreService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_17__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵinject"](_ionic_angular__WEBPACK_IMPORTED_MODULE_18__.ToastController), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_19__.Store));
};
_ListingsEffects.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineInjectable"]({
  token: _ListingsEffects,
  factory: _ListingsEffects.ɵfac
});

/***/ }),

/***/ 2320:
/*!*******************************************************!*\
  !*** ./src/app/state/selectors/listings.selectors.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectAllListings: () => (/* binding */ selectAllListings),
/* harmony export */   selectAreListingsFresh: () => (/* binding */ selectAreListingsFresh),
/* harmony export */   selectAreRelatedAccountsFresh: () => (/* binding */ selectAreRelatedAccountsFresh),
/* harmony export */   selectError: () => (/* binding */ selectError),
/* harmony export */   selectFilterType: () => (/* binding */ selectFilterType),
/* harmony export */   selectFilteredListings: () => (/* binding */ selectFilteredListings),
/* harmony export */   selectListingById: () => (/* binding */ selectListingById),
/* harmony export */   selectListingsLastUpdated: () => (/* binding */ selectListingsLastUpdated),
/* harmony export */   selectListingsState: () => (/* binding */ selectListingsState),
/* harmony export */   selectLoading: () => (/* binding */ selectLoading),
/* harmony export */   selectRelatedAccountsByListingId: () => (/* binding */ selectRelatedAccountsByListingId),
/* harmony export */   selectRelatedAccountsLastUpdated: () => (/* binding */ selectRelatedAccountsLastUpdated),
/* harmony export */   selectSearchQuery: () => (/* binding */ selectSearchQuery),
/* harmony export */   selectSelectedListing: () => (/* binding */ selectSelectedListing)
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
// src/app/state/listings/listings.selectors.ts

// TTL in milliseconds (e.g., 5 minutes)
const LISTINGS_TTL = 5 * 60 * 1000; // 5 minutes
// Utility: Check if data is stale
function isStale(lastUpdated, ttl) {
  if (!lastUpdated) return true; // If never updated, consider it stale
  const now = Date.now();
  return now - lastUpdated > ttl;
}
// Feature Selector
const selectListingsState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createFeatureSelector)("listings");
// Selectors for related accounts
const selectRelatedAccountsByListingId = listingId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.relatedAccounts[listingId] || []);
// Select all listings
const selectAllListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => Object.values(state.entities));
// Select a specific listing by ID
const selectListingById = listingId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.entities[listingId]);
// Select the currently selected listing
const selectSelectedListing = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.selectedListingId ? state.entities[state.selectedListingId] : undefined);
// Select loading state
const selectLoading = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.loading);
// Select error state
const selectError = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.error);
// Select filter type
const selectFilterType = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.filterType);
// Select search query
const selectSearchQuery = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.searchQuery);
// Select filtered listings
const selectFilteredListings = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectAllListings, selectFilterType, selectSearchQuery, (listings, filterType, searchQuery) => {
  let filteredListings = listings;
  if (filterType && filterType !== "all") {
    filteredListings = filteredListings.filter(listing => listing.type === filterType);
  }
  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase();
    filteredListings = filteredListings.filter(listing => listing.title.toLowerCase().includes(queryLower) || listing.description.toLowerCase().includes(queryLower));
  }
  return filteredListings;
});
// Cache and Freshness Selectors
const selectListingsLastUpdated = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.listingsLastUpdated);
const selectRelatedAccountsLastUpdated = listingId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsState, state => state.relatedAccountsLastUpdated[listingId] || null);
// Determine if listings are fresh
const selectAreListingsFresh = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectListingsLastUpdated, listingsLastUpdated => !isStale(listingsLastUpdated, LISTINGS_TTL));
// Determine if related accounts for a listing are fresh
const selectAreRelatedAccountsFresh = listingId => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRelatedAccountsLastUpdated(listingId), relatedAccountsLastUpdated => !isStale(relatedAccountsLastUpdated, LISTINGS_TTL));

/***/ })

}]);
//# sourceMappingURL=src_app_modules_listing_listing_module_ts.js.map