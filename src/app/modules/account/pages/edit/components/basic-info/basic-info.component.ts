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
import {CommonModule} from "@angular/common";
import {Component, Input, SimpleChanges} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {StoreService} from "../../../../../../core/services/store.service";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: ["./basic-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class BasicInfoComponent {
  @Input() account: Partial<Account> | null = null;
  public maxLinks = 10;

  basicInfoForm = this.fb.group({
    description: [""],
    tagline: ["", Validators.required],
    name: ["", Validators.required],
    webLinks: this.fb.array([this.createWebLinkFormGroup()]),
    groupDetails: this.fb.group({
      groupType: [''],
    }),
  });

  constructor(private fb: FormBuilder, private storeService: StoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["account"]) {
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
      url: ["", []],
      category: [""],
    });
  }

  onSubmit() {
    // Call the API to save changes
    if (this.account) {
      // Prepare the account object with form values
      const formValue = this.basicInfoForm.value;

      // Prepare the account object for update
      const updatedAccount: Partial<Account> = {
        ...this.account,
        ...formValue,
        name: formValue.name!,
        tagline: formValue.tagline!,
        description: formValue.description ?? "",
        webLinks:
          formValue.webLinks?.map((link) => {
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

      // Now update the document with the updatedAccount
      this.storeService.updateDoc("accounts", updatedAccount);
    }
  }

  loadFormData() {
    if (!this.account) return;
    // Reset the form arrays to ensure clean state
    while (this.webLinksFormArray.length !== 0) {
      this.webLinksFormArray.removeAt(0);
    }

    // If there are webLinks, create a FormGroup for each
    this.account.webLinks?.forEach((webLink) => {
      this.webLinksFormArray.push(
        this.fb.group({
          name: [webLink.name],
          url: [
            webLink.url,
            [
              Validators.pattern(
                /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/?].*)?$/,
              ),
            ],
          ],
          category: [webLink.category],
        }),
      );
    });

    // If after loading there are no webLinks, add a blank one
    if (this.webLinksFormArray.length === 0) {
      this.addWebLink();
    }

    // Load other form data as before
    this.basicInfoForm.patchValue({
      name: this.account.name,
      description: this.account.description,
      tagline: this.account.tagline,
    });

    if(this.account?.type === "group" && this.account?.groupDetails?.groupType) {
    this.basicInfoForm.get('groupDetails.groupType')?.setValue(this.account.groupDetails?.groupType);
    }
  }

  addWebLink(): void {
    if (this.webLinksFormArray.length < this.maxLinks) {
      this.webLinksFormArray.push(this.createWebLinkFormGroup());
    }
  }

  removeWebLink(index: number): void {
    // Remove the phone number form group at the given index
    this.webLinksFormArray.removeAt(index);
  }
}
