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
// src/app/modules/listings/pages/apply/apply.page.ts

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../state/app.state";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {AuthUser} from "@shared/models/auth-user.model";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {ActivatedRoute} from "@angular/router";
import {selectListingById} from "../../../../../state/selectors/listings.selectors";
import {Listing} from "@shared/models/listing.model";
import {AlertController} from "@ionic/angular";
import {MetaService} from "../../../../../core/services/meta.service";
import {formatPhoneNumber} from "../../../../../core/utils/phone.util";

@Component({
  selector: "app-apply",
  templateUrl: "./apply.page.html",
  styleUrls: ["./apply.page.scss"],
})
export class ApplyPage implements OnInit {
  applyForm: FormGroup;
  resumeFile: File | null = null;
  coverLetterFile: File | null = null;
  authUser$: Observable<AuthUser | null>;
  listingId?: string;
  listing$: Observable<Listing | undefined>;
  @ViewChild("resumeInput") resumeInput!: ElementRef<HTMLInputElement>;
  @ViewChild("coverLetterInput")
  coverLetterInput!: ElementRef<HTMLInputElement>;
  resumeFileName: string = "";
  coverLetterFileName: string = "";

  constructor(
    private metaService: MetaService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.applyForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(7)]],
      notes: [""],
    });

    this.authUser$ = this.store.select(selectAuthUser);
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.listing$ = this.store.select(selectListingById(this.listingId));
  }

  ngOnInit(): void {
    this.authUser$.pipe(take(1)).subscribe((authUser) => {
      if (authUser) {
        const [firstName, ...lastNameParts] = (authUser.name || "").split(" ");
        const lastName = lastNameParts.join(" ");

        this.applyForm.patchValue({
          firstName: firstName || "",
          lastName: lastName || "",
          email: authUser.email || "",
          phone: authUser.phoneNumber || "",
        });
      }
    });
  }

  ionViewWillEnter(): void {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";
    this.store.dispatch(ListingsActions.loadListingById({id: this.listingId}));
    // Default Meta Tags
    this.metaService.updateMetaTags(
      "Apply to Listing | ASCENDynamics NFP",
      "Submit your application to join this opportunity on ASCENDynamics NFP.",
      "listing, apply, volunteer, nonprofits",
      {
        title: "Apply to Listing | ASCENDynamics NFP",
        description:
          "Fill out your application and connect with organizations to make a difference.",
        url: "https://ascendynamics.org/listings",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
      {
        card: "summary_large_image",
        title: "Apply to Listing",
        description:
          "Submit your application to this listing and start making an impact today.",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ascendcoopplatform.appspot.com/o/org%2Fmeta-images%2Ficon-512x512.png?alt=media",
      },
    );
  }

  onFileSelect(event: Event, type: "resume" | "coverLetter"): void {
    const input = event.target as HTMLInputElement;
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

  formatPhoneNumber(event: any): void {
    const input = event.target as HTMLInputElement;
    const formatted = formatPhoneNumber(input.value);
    input.value = formatted;
  }

  onSubmit(): void {
    if (!this.applyForm.valid) {
      this.markFormAsDirty(this.applyForm);
      this.showAlert(
        "Form Invalid",
        "Please fill out all required fields correctly.",
      );
      return;
    }

    this.authUser$.pipe(take(1)).subscribe((authUser) => {
      if (!authUser) {
        this.showAlert(
          "Error",
          "Unable to fetch user information. Please try again.",
        );
        return;
      }

      const formValues = this.applyForm.value;
      // const fullName = `${formValues.firstName} ${formValues.lastName}`.trim();

      const relatedAccount = {
        ...formValues,
        id: authUser.uid, // Populate the id
        name: authUser.name || "Anonymous User",
        iconImage: authUser.iconImage || "",
        heroImage: authUser.heroImage || "",
        accountId: authUser.uid, // Populate the accountId
        resumeFile: this.resumeFile,
        coverLetterFile: this.coverLetterFile,
        listingId: this.listingId,
        type: "application",
        status: "applied",
      };

      // Dispatch action to submit application
      this.store.dispatch(ListingsActions.submitApplication({relatedAccount}));

      this.showAlert(
        "Application Submitted",
        "Your application has been submitted successfully!",
      );
    });
  }

  markFormAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
