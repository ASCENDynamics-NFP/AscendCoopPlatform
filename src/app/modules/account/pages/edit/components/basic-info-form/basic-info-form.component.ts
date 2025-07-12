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
// basic-info.component.ts
import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Account, WebLink} from "@shared/models/account.model";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";

@Component({
  selector: "app-basic-info-form",
  templateUrl: "./basic-info-form.component.html",
  styleUrls: ["./basic-info-form.component.scss"],
})
export class BasicInfoFormComponent implements OnChanges {
  @Input() account: Account | null = null;
  public maxLinks = 10;

  basicInfoForm!: FormGroup; // Declare the form but do not initialize it here

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    // Initialize the form in ngOnInit after fb is initialized
    this.basicInfoForm = this.fb.group({
      description: [""],
      tagline: ["", Validators.required],
      name: ["", Validators.required],
      webLinks: this.fb.array([this.createWebLinkFormGroup()]),
      groupDetails: this.fb.group({
        groupType: [""],
      }),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"] && this.account) {
      this.loadFormData();
    }
  }

  /**
   * Returns the FormArray for the webLinks control in the basicInfoForm.
   * @returns {FormArray} The FormArray for the webLinks control.
   */
  get webLinksFormArray(): FormArray {
    return this.basicInfoForm.get("webLinks") as FormArray;
  }

  createWebLinkFormGroup(): FormGroup {
    return this.fb.group({
      name: ["", []],
      url: [
        "",
        [
          Validators.pattern(
            /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/,
          ),
        ],
      ],
      category: [""],
    });
  }

  onSubmit() {
    if (this.account) {
      const formValue = this.basicInfoForm.value;

      const updatedAccount: Account = {
        ...this.account,
        ...formValue,
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description ?? "",
        webLinks:
          formValue.webLinks?.map((link: Partial<WebLink>) => {
            return {
              name: link.name!,
              url: link.url!,
              category: link.category ?? "",
            };
          }) ?? [],
        groupDetails: {
          ...formValue.groupDetails,
          groupType: formValue.groupDetails?.groupType || "Nonprofit",
        },
      };

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );
    }
  }

  loadFormData() {
    if (!this.account) return;

    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }

    this.account.webLinks?.forEach((webLink) => {
      this.webLinksFormArray.push(
        this.fb.group({
          name: [webLink.name],
          url: [
            webLink.url,
            [
              Validators.pattern(
                /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/,
              ),
            ],
          ],
          category: [webLink.category],
        }),
      );
    });

    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }

    this.basicInfoForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
    });

    if (
      this.account?.type === "group" &&
      this.account?.groupDetails?.groupType
    ) {
      this.basicInfoForm
        .get("groupDetails.groupType")
        ?.setValue(this.account.groupDetails?.groupType);
    }
  }

  addWebLink(): void {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }

  removeWebLink(index: number): void {
    this.webLinksFormArray.removeAt(index);
  }
}
