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
import {Timestamp} from "firebase/firestore";
import {Store} from "@ngrx/store";
import {filter, first, map, switchMap, tap} from "rxjs";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {Account} from "../../../../models/account.model";
import {selectSelectedAccount} from "../../../../state/selectors/account.selectors";

@Component({
  selector: "app-listing-form",
  templateUrl: "./listing-form.component.html",
  styleUrls: ["./listing-form.component.scss"],
})
export class ListingFormComponent implements OnInit {
  @Input() listing: Listing | null = null;
  @Output() formSubmit = new EventEmitter<any>();

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
      location: this.fb.group({
        street: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        country: ["", Validators.required],
        zipcode: [
          "",
          [Validators.required, Validators.pattern("^[0-9]{5}(?:-[0-9]{4})?$")],
        ],
        remote: [false],
      }),
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
      contactInformation: this.fb.group({
        emails: this.fb.array([]),
        phoneNumbers: this.fb.array([]),
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
      // Convert Timestamp to ISO string for datetime inputs
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
            }
          }),
          switchMap(() => this.store.select(selectSelectedAccount)),
          filter((account): account is Account => !!account),
          map((account: Account) => account),
        )
        .subscribe((account) => {
          this.listingForm.patchValue({
            organization: account.name,
            contactInformation: account.contactInformation,
          });
        });
    }
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
    if (listing.skills?.length) {
      listing.skills.forEach((skill) => this.addSkill(skill));
    }
    if (listing.requirements?.length) {
      listing.requirements.forEach((req) =>
        this.addArrayItem("requirements", req),
      );
    }
    if (listing.responsibilities?.length) {
      listing.responsibilities.forEach((resp) =>
        this.addArrayItem("responsibilities", resp),
      );
    }
    if (listing.benefits?.length) {
      listing.benefits.forEach((benefit) =>
        this.addArrayItem("benefits", benefit),
      );
    }
    if (listing.contactInformation?.emails?.length) {
      listing.contactInformation.emails.forEach((email) => {
        const emailForm = this.fb.group({
          name: [email.name],
          email: [email.email, [Validators.required, Validators.email]],
        });
        (this.listingForm.get("contactInformation.emails") as FormArray).push(
          emailForm,
        );
      });
    }

    if (listing.contactInformation?.phoneNumbers?.length) {
      listing.contactInformation.phoneNumbers.forEach((phone) => {
        const phoneForm = this.fb.group({
          type: [phone.type],
          countryCode: [phone.countryCode],
          number: [phone.number, Validators.required],
        });
        (
          this.listingForm.get("contactInformation.phoneNumbers") as FormArray
        ).push(phoneForm);
      });
    }
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

  onSubmit() {
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
        status: "active",
      };
      this.formSubmit.emit(listing);
    } else {
      this.markFormGroupTouched(this.listingForm);
    }
  }
}
