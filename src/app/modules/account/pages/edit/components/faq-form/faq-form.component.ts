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
import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {FormBuilder, FormGroup, Validators, FormArray} from "@angular/forms";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../../../state/actions/account.actions";

export interface Account {
  id?: string;
  type?: "user" | "group" | "new";
  groupDetails?: {
    faqs?: FAQ[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: "app-faq-form",
  templateUrl: "./faq-form.component.html",
  styleUrls: ["./faq-form.component.scss"],
})
export class FaqFormComponent implements OnInit {
  @Input() account: Partial<Account> = {};
  @Output() formSubmitted = new EventEmitter<void>();

  faqForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.faqForm = this.fb.group({
      faqs: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.loadFormData();
  }

  get faqsFormArray(): FormArray {
    return this.faqForm.get("faqs") as FormArray;
  }

  private loadFormData() {
    if (this.account?.groupDetails?.faqs) {
      this.account.groupDetails.faqs.forEach((faq) => {
        this.faqsFormArray.push(this.createFAQFormGroup(faq));
      });
    }
  }

  createFAQFormGroup(faq?: FAQ): FormGroup {
    return this.fb.group({
      id: [faq?.id || this.generateId()],
      question: [
        faq?.question || "",
        [Validators.required, Validators.maxLength(500)],
      ],
      answer: [
        faq?.answer || "",
        [Validators.required, Validators.maxLength(2000)],
      ],
      createdAt: [faq?.createdAt || new Date()],
      updatedAt: [new Date()],
    });
  }

  addFAQ() {
    this.faqsFormArray.push(this.createFAQFormGroup());
  }

  removeFAQ(index: number) {
    this.faqsFormArray.removeAt(index);
  }

  moveFAQUp(index: number) {
    if (index > 0) {
      const faq = this.faqsFormArray.at(index);
      this.faqsFormArray.removeAt(index);
      this.faqsFormArray.insert(index - 1, faq);
    }
  }

  moveFAQDown(index: number) {
    if (index < this.faqsFormArray.length - 1) {
      const faq = this.faqsFormArray.at(index);
      this.faqsFormArray.removeAt(index);
      this.faqsFormArray.insert(index + 1, faq);
    }
  }

  onSubmit() {
    if (this.faqForm.valid && this.account.id) {
      const faqs = this.faqsFormArray.value;

      const updatedAccount = {
        ...this.account,
        groupDetails: {
          ...this.account.groupDetails,
          faqs: faqs,
        },
      } as any;

      this.store.dispatch(
        AccountActions.updateAccount({account: updatedAccount}),
      );

      this.formSubmitted.emit();
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
