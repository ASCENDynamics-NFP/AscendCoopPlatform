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
import {
  Listing,
  SkillRequirement,
} from "../../../../../../shared/models/listing.model";
import {Timestamp} from "firebase/firestore";
import {Store} from "@ngrx/store";
import {
  combineLatest,
  filter,
  first,
  switchMap,
  take,
  tap,
  map,
  of,
  catchError,
  shareReplay,
} from "rxjs";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import * as AccountActions from "../../../../state/actions/account.actions";
import {
  Account,
  ContactInformation,
  Email,
  PhoneNumber,
  Address,
} from "../../../../../../shared/models/account.model";
import {AccountSectionsService} from "../../../account/services/account-sections.service";
import {
  selectAccountById,
  selectAllAccounts,
} from "../../../../state/selectors/account.selectors";
import {AuthUser} from "../../../../../../shared/models/auth-user.model";
import {AccountsService} from "../../../../core/services/accounts.service";

@Component({
  selector: "app-listing-form",
  templateUrl: "./listing-form.component.html",
  styleUrls: ["./listing-form.component.scss"],
})
export class ListingFormComponent implements OnInit {
  @Input() listing: Listing | null = null;
  @Output() formSubmit = new EventEmitter<any>();
  currentStep = 1; // Start at the first step
  authUser: AuthUser | null = null;
  useAccountContactInfo = false;
  private backupContactInfo: ContactInformation | null = null;
  private currentAccount?: Account;

  listingForm!: FormGroup;
  listingTypes = ["volunteer", "job", "internship", "gig"];
  skillLevels = ["beginner", "intermediate", "advanced"];
  ownerAccounts$ = of([] as Account[]);
  /** Cached accounts to use inside event handlers */
  private ownerAccountsCache: Account[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private sections: AccountSectionsService,
    private accountsService: AccountsService,
  ) {
    this.initForm();
  }

  get isEditMode(): boolean {
    return !!this.listing?.id;
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
      ownerAccountId: [""],
      ownerAccountType: ["user"],
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
          startDate: this.convertToISOString(
            this.listing.timeCommitment.startDate,
          ),
          endDate: this.convertToISOString(this.listing.timeCommitment.endDate),
        },
      };
      this.listingForm.patchValue(formValue);
      this.initializeFormArrays(this.listing);
      // Prevent changing owner on edit
      this.listingForm.get("ownerAccountId")?.disable({emitEvent: false});
    } else {
      // New listing - populate from account and owner choices
      this.store
        .select(selectAuthUser)
        .pipe(
          first(),
          tap((user) => {
            if (user?.uid) {
              this.store.dispatch(
                AccountActions.loadAccount({accountId: user.uid}),
              );
              // Fetch accounts to populate owner selection
              this.store.dispatch(AccountActions.loadAccounts());
              this.authUser = user;
            }
          }),
          switchMap((user) => this.store.select(selectAccountById(user!.uid))),
          filter((account): account is Account => account !== null),
          take(1),
        )
        .subscribe((account) => {
          // Set organization name only; do NOT prefill contact info.
          // Users can use the toggle to import their account contact info.
          this.currentAccount = account;
          this.listingForm.patchValue({
            organization: account.name,
            ownerAccountId: account.id,
            ownerAccountType: account.type,
          });
        });

      // Build list of accounts user can post as: self + groups where user is admin/moderator via callable
      this.ownerAccounts$ = this.store.select(selectAuthUser).pipe(
        switchMap((user) => {
          if (!user) return of([] as Account[]);

          const userAccount$ = this.store
            .select(selectAccountById(user.uid))
            .pipe(
              filter((account): account is Account => !!account),
              take(1),
            );

          const manageable$ = this.accountsService.getUserManageableAccounts();

          return combineLatest([userAccount$, manageable$]).pipe(
            map(([userAccount, manageable]) => [userAccount, ...manageable]),
          );
        }),
        shareReplay(1),
      );

      // Keep a live cache for use in event handlers (can't use pipes there)
      this.ownerAccounts$.subscribe((accs) => (this.ownerAccountsCache = accs));
    }
  }

  onOwnerAccountChange(event: CustomEvent) {
    const selectedId = (event as any)?.detail?.value as string | undefined;
    const selected = this.ownerAccountsCache.find((a) => a.id === selectedId);
    const ownerAccountType = selected?.type || "user";
    const organization =
      selected?.name || this.listingForm.get("organization")?.value;
    this.listingForm.patchValue({ownerAccountType, organization});
  }

  private initializeFormFromAccount(
    account: Account,
    contactInfo?: ContactInformation | null,
  ) {
    this.listingForm.patchValue({organization: account.name});
    if (this.useAccountContactInfo) {
      this.setContactInfoFromSource(contactInfo ?? account.contactInformation);
    }
  }

  private setContactInfoFromSource(source?: ContactInformation | null) {
    // Clear current arrays
    (this.listingForm.get("contactInformation.emails") as FormArray).clear();
    (
      this.listingForm.get("contactInformation.phoneNumbers") as FormArray
    ).clear();
    (this.listingForm.get("contactInformation.addresses") as FormArray).clear();

    if (!source) return;

    source.emails?.forEach((email) => {
      const emailForm = this.fb.group({
        name: [email.name],
        email: [email.email],
      });
      (this.listingForm.get("contactInformation.emails") as FormArray).push(
        emailForm,
      );
    });

    source.phoneNumbers?.forEach((phone) => {
      const phoneForm = this.fb.group({
        type: [phone.type],
        number: [phone.number],
      });
      (
        this.listingForm.get("contactInformation.phoneNumbers") as FormArray
      ).push(phoneForm);
    });

    source.addresses?.forEach((address) => {
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

  onToggleUseAccountContactInfo(checked: boolean) {
    this.useAccountContactInfo = checked;
    if (checked) {
      // Backup current manual entries
      this.backupContactInfo = this.getContactInfoFromForm();
      if (!this.authUser?.uid) return;
      // Re-pull from sections/contactInfo and populate
      this.sections
        .contactInfo$(this.authUser.uid)
        .pipe(take(1))
        .subscribe((ci: ContactInformation | null) => {
          if (ci) {
            this.setContactInfoFromSource(ci);
          } else if (this.currentAccount?.contactInformation) {
            // Fallback to base account contact info if subdoc missing
            this.setContactInfoFromSource(
              this.currentAccount.contactInformation,
            );
          } else {
            // Nothing to load; keep backup intact so user can toggle off
          }
        });
    } else {
      // Restore backup if available, else clear
      if (this.backupContactInfo) {
        this.setContactInfoFromSource(this.backupContactInfo);
      } else {
        this.setContactInfoFromSource({
          emails: [],
          phoneNumbers: [],
          addresses: [],
          preferredMethodOfContact: "Email",
        } as ContactInformation);
      }
      this.backupContactInfo = null;
    }
  }

  private getContactInfoFromForm(): ContactInformation {
    const emailsCtrl = this.listingForm.get(
      "contactInformation.emails",
    ) as FormArray;
    const phonesCtrl = this.listingForm.get(
      "contactInformation.phoneNumbers",
    ) as FormArray;
    const addressesCtrl = this.listingForm.get(
      "contactInformation.addresses",
    ) as FormArray;

    const emails: Email[] = (emailsCtrl?.value || []).map((e: any) => ({
      name: e?.name ?? null,
      email: e?.email ?? null,
    }));
    const phoneNumbers: PhoneNumber[] = (phonesCtrl?.value || []).map(
      (p: any) => ({
        type: p?.type ?? null,
        number: p?.number ?? null,
        isEmergencyNumber: false,
      }),
    );
    const addresses: (Address | null)[] = (addressesCtrl?.value || []).map(
      (a: any) => ({
        name: a?.name ?? null,
        street: a?.street ?? null,
        city: a?.city ?? null,
        state: a?.state ?? null,
        country: a?.country ?? null,
        zipcode: a?.zipcode ?? null,
        isPrimaryAddress: !!a?.isPrimaryAddress,
      }),
    );

    return {
      emails,
      phoneNumbers,
      addresses,
      preferredMethodOfContact: "Email",
    } as ContactInformation;
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
        number: [
          phone.number,
          [Validators.required, Validators.pattern("^[+]?[0-9()\\s-]{10,25}$")],
        ],
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

  private submitForm(status: "draft" | "active" | "filled" | "expired") {
    if (this.listingForm.valid) {
      this.store
        .select(selectAuthUser)
        .pipe(take(1))
        .subscribe((user) => {
          const formValue = this.listingForm.value;
          const listing = {
            ...formValue,
            id: this.listing?.id || null,
            timeCommitment: {
              ...formValue.timeCommitment,
              startDate: formValue.timeCommitment.startDate
                ? Timestamp.fromDate(
                    new Date(formValue.timeCommitment.startDate),
                  )
                : null,
              endDate: formValue.timeCommitment.endDate
                ? Timestamp.fromDate(new Date(formValue.timeCommitment.endDate))
                : null,
            },
            status,
            iconImage: user?.iconImage || "",
            heroImage: user?.heroImage || "",
            lastModifiedBy: user?.uid,
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
      // If listing exists, keep current status, otherwise set as draft
      const status = this.listing?.id ? this.listing.status : "draft";
      this.submitForm(status as "draft" | "active" | "filled" | "expired");
    } else {
      this.markFormGroupTouched(this.listingForm);
    }
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

  /**
   * Safely converts various date formats to ISO string
   * @param date The date to convert (Timestamp, Date, string, or undefined)
   * @returns ISO string or empty string if invalid
   */
  private convertToISOString(date: any): string {
    if (!date) return "";

    try {
      // If it's a Firestore Timestamp
      if (date && typeof date.toDate === "function") {
        return date.toDate().toISOString();
      }

      // If it's already a Date object
      if (date instanceof Date) {
        return date.toISOString();
      }

      // If it's a string, try to parse it
      if (typeof date === "string") {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
      }

      // If it has seconds and nanoseconds (Timestamp-like object)
      if (date.seconds !== undefined) {
        return new Date(date.seconds * 1000).toISOString();
      }
    } catch (error) {
      console.warn("Error converting date:", error);
    }

    return "";
  }
}
