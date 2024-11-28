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

import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AppState} from "../../../../../state/app.state";
import {selectAuthUser} from "../../../../../state/selectors/auth.selectors";
import {AuthUser} from "../../../../../models/auth-user.model";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import * as ListingsActions from "../../../../../state/actions/listings.actions";
import {ActivatedRoute} from "@angular/router";

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

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
    this.applyForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required, Validators.minLength(7)]],
    });

    this.authUser$ = this.store.select(selectAuthUser);
  }

  ngOnInit(): void {
    this.listingId = this.route.snapshot.paramMap.get("id") || "";

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

  onFileSelect(event: Event, type: "resume" | "coverLetter"): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must not exceed 10 MB.");
        return;
      }

      if (type === "resume") {
        this.resumeFile = file;
      } else if (type === "coverLetter") {
        this.coverLetterFile = file;
      }
    }
  }

  onSubmit(): void {
    if (this.applyForm.valid) {
      this.authUser$.pipe(take(1)).subscribe((authUser) => {
        if (authUser) {
          const relatedAccount = {
            ...this.applyForm.value,
            id: authUser.uid, // Populate the id
            accountId: authUser.uid, // Populate the accountId
            resumeFile: this.resumeFile,
            coverLetterFile: this.coverLetterFile,
            listingId: this.listingId,
            type: "application",
            status: "applied",
          };

          // Dispatch action to submit application
          this.store.dispatch(
            ListingsActions.submitApplication({relatedAccount}),
          );

          console.log("Form Submitted!", relatedAccount);

          // TODO: Navigate or show success message as needed
        } else {
          console.error("Auth user not available");
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }
}
