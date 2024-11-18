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
import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators, FormArray} from "@angular/forms";
import {Listing, SkillRequirement} from "../../../../models/listing.model";
import {serverTimestamp, Timestamp} from "firebase/firestore";
import {Store} from "@ngrx/store";
import {filter, first, switchMap, take, tap} from "rxjs";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {Account} from "../../../../models/account.model";
import {selectSelectedAccount} from "../../../../state/selectors/account.selectors";
import {AuthUser} from "../../../../models/auth-user.model";

@Component({
  selector: "app-listing-form",
  templateUrl: "./listing-form.component.html",
  styleUrls: ["./listing-form.component.scss"],
})
export class ListingFormComponent implements OnInit {
  @Input() listing: Listing | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  authUser: AuthUser | null = null;

  listingForm!: FormGroup;
  listingTypes = ["volunteer", "job", "internship", "gig"];
  skillLevels = ["beginner", "intermediate", "advanced"];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.initForm();
  }

  private initForm() {
    this.listingForm = this.fb.group({
      title: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
      type: ["volunteer", Validators.required],
      organization: ["", [Validators.required, Validators.minLength(2)]],
      remote: [false],
      timeCommitment: this.fb.group(
        {
          hoursPerWeek: [
            "",
            [Validators.required, Validators.min(1), Validators.max(168)],
          ],
          duration: ["", Validators.required],
          schedule: ["", Validators.required],
          startDate: [null, Validators.required],
          endDate: [null],
          isFlexible: [false],
        },
        {validator: this.dateRangeValidator},
      ),
      skills: this.fb.array([]),
      requirements: this.fb.array([]),
      responsibilities: this.fb.array([]),
      benefits: this.fb.array([]),
      contactInformation: this.fb.group({
        emails: this.fb.array([]),
        phoneNumbers: this.fb.array([]),
        addresses: this.fb.array([]),
      }),
    });
  }

  dateRangeValidator(group: FormGroup) {
    const start = group.get("startDate")?.value;
    const end = group.get("endDate")?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return {dateRange: true};
    }
    return null;
  }

  ngOnInit() {
    if (this.listing) {
      const formValue = {
        ...this.listing,
        timeCommitment: {
          ...this.listing.timeCommitment,
          startDate: this.listing.timeCommitment.startDate
            ?.toDate()
            .toISOString(),
          endDate: this.listing.timeCommitment.endDate?.toDate().toISOString(),
        },
      };
      this.listingForm.patchValue(formValue);
      this.initializeFormArrays(this.listing);
    } else {
      // New listing - populate from account
      this.store
        .select(selectAuthUser)
        .pipe(
          first(),
          tap((user) => {
            if (user?.uid) {
              this.store.dispatch(
                AccountActions.loadAccount({accountId: user.uid}),
              );
              this.authUser = user;
            }
          }),
          switchMap(() => this.store.select(selectSelectedAccount)),
          filter((account): account is Account => account !== null),
          take(1),
        )
        .subscribe((account) => {
          // Only call one initialization method
          this.initializeFormFromAccount(account);
        });
    }
  }

  private initializeFormFromAccount(account: Account) {
    this.listingForm.patchValue({
      organization: account.name,
    });

    // Initialize contact information arrays
    account.contactInformation?.emails?.forEach((email) => {
      const emailForm = this.fb.group({
        name: [email.name],
        email: [email.email],
      });
      (this.listingForm.get("contactInformation.emails") as FormArray).push(
        emailForm,
      );
    });

    account.contactInformation?.phoneNumbers?.forEach((phone) => {
      const phoneForm = this.fb.group({
        type: [phone.type],
        countryCode: [phone.countryCode],
        number: [phone.number],
      });
      (
        this.listingForm.get("contactInformation.phoneNumbers") as FormArray
      ).push(phoneForm);
    });

    account.contactInformation?.addresses?.forEach((address) => {
      const addressForm = this.fb.group({
        name: [address?.name],
        street: [address?.street],
        city: [address?.city],
        state: [address?.state],
        country: [address?.country],
        zipcode: [address?.zipcode],
        isPrimaryAddress: [address?.isPrimaryAddress],
      });
      (this.listingForm.get("contactInformation.addresses") as FormArray).push(
        addressForm,
      );
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private initializeFormArrays(listing: Listing) {
    // Clear existing arrays
    (this.listingForm.get("skills") as FormArray).clear();
    (this.listingForm.get("requirements") as FormArray).clear();
    (this.listingForm.get("responsibilities") as FormArray).clear();
    (this.listingForm.get("benefits") as FormArray).clear();
    (this.listingForm.get("contactInformation.emails") as FormArray).clear();
    (
      this.listingForm.get("contactInformation.phoneNumbers") as FormArray
    ).clear();
    (this.listingForm.get("contactInformation.addresses") as FormArray).clear();

    // Initialize skills
    listing.skills?.forEach((skill) => {
      const skillForm = this.fb.group({
        name: [skill.name, Validators.required],
        level: [skill.level],
        required: [skill.required],
      });
      (this.listingForm.get("skills") as FormArray).push(skillForm);
    });

    // Initialize requirements
    listing.requirements?.forEach((req) => {
      const control = this.fb.control(req, Validators.required);
      (this.listingForm.get("requirements") as FormArray).push(control);
    });

    // Initialize responsibilities
    listing.responsibilities?.forEach((resp) => {
      const control = this.fb.control(resp, Validators.required);
      (this.listingForm.get("responsibilities") as FormArray).push(control);
    });

    // Initialize benefits
    listing.benefits?.forEach((benefit) => {
      const control = this.fb.control(benefit, Validators.required);
      (this.listingForm.get("benefits") as FormArray).push(control);
    });

    // Initialize contact information
    listing.contactInformation?.emails?.forEach((email) => {
      const emailForm = this.fb.group({
        name: [email.name],
        email: [email.email, [Validators.required, Validators.email]],
      });
      (this.listingForm.get("contactInformation.emails") as FormArray).push(
        emailForm,
      );
    });

    listing.contactInformation?.phoneNumbers?.forEach((phone) => {
      const phoneForm = this.fb.group({
        type: [phone.type],
        countryCode: [phone.countryCode],
        number: [phone.number, Validators.required],
        isEmergencyNumber: [phone.isEmergencyNumber],
      });
      (
        this.listingForm.get("contactInformation.phoneNumbers") as FormArray
      ).push(phoneForm);
    });

    listing.contactInformation?.addresses?.forEach((address) => {
      const addressForm = this.fb.group({
        name: [address?.name],
        street: [address?.street],
        city: [address?.city],
        state: [address?.state],
        country: [address?.country],
        zipcode: [address?.zipcode],
        isPrimaryAddress: [address?.isPrimaryAddress],
      });
      (this.listingForm.get("contactInformation.addresses") as FormArray).push(
        addressForm,
      );
    });
  }

  addSkill(skill?: SkillRequirement) {
    const skillForm = this.fb.group({
      name: [skill?.name || "", Validators.required],
      level: [skill?.level || "beginner"],
      required: [skill?.required || true],
    });
    (this.listingForm.get("skills") as FormArray).push(skillForm);
  }

  addArrayItem(arrayName: string, value: string = "") {
    const control = this.fb.control(value, Validators.required);
    (this.listingForm.get(arrayName) as FormArray).push(control);
  }

  addEmail() {
    const emailForm = this.fb.group({
      name: [""],
      email: ["", [Validators.required, Validators.email]],
    });
    (this.listingForm.get("contactInformation.emails") as FormArray).push(
      emailForm,
    );
  }

  addPhoneNumber() {
    const phoneForm = this.fb.group({
      type: ["Mobile"],
      countryCode: ["+1"],
      number: ["", Validators.required],
    });
    (this.listingForm.get("contactInformation.phoneNumbers") as FormArray).push(
      phoneForm,
    );
  }

  removeArrayItem(arrayName: string, index: number) {
    (this.listingForm.get(arrayName) as FormArray).removeAt(index);
  }

  getFormArray(arrayName: string) {
    return this.listingForm.get(arrayName) as FormArray;
  }

  private submitForm(status: "draft" | "active" | "inactive") {
    if (this.listingForm.valid) {
      const formValue = this.listingForm.value;
      const listing = {
        ...formValue,
        timeCommitment: {
          ...formValue.timeCommitment,
          startDate: formValue.timeCommitment.startDate
            ? Timestamp.fromDate(new Date(formValue.timeCommitment.startDate))
            : null,
          endDate: formValue.timeCommitment.endDate
            ? Timestamp.fromDate(new Date(formValue.timeCommitment.endDate))
            : null,
        },
        status,
        iconImage: this.authUser?.iconImage || "",
        heroImage: this.authUser?.heroImage || "",
        lastModifiedBy: this.authUser?.uid,
        lastModifiedDate: serverTimestamp(),
      };
      this.formSubmit.emit(listing);
    } else {
      this.markFormGroupTouched(this.listingForm);
    }
  }

  saveAsDraft() {
    this.submitForm("draft");
  }

  saveAsActive() {
    this.submitForm("active");
  }

  saveAsInactive() {
    this.submitForm("inactive");
  }

  addAddress() {
    const addressForm = this.fb.group({
      name: [""],
      street: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      zipcode: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")],
      ],
      isPrimaryAddress: [false],
    });
    (this.listingForm.get("contactInformation.addresses") as FormArray).push(
      addressForm,
    );
  }
}
