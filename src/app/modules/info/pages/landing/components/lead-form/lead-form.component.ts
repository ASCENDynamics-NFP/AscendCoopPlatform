/*******************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/
// src/app/modules/auth/pages/landing/components/lead-form/lead-form.component.ts

import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {LeadService} from "../../../../../../core/services/lead.service";

@Component({
  selector: "app-lead-form",
  templateUrl: "./lead-form.component.html",
  styleUrls: ["./lead-form.component.scss"],
})
export class LeadFormComponent {
  inquiries = [
    {value: "donate", label: "Donate to ASCENDynamics NFP"},
    {value: "question", label: "Question"},
    {value: "services", label: "Inquire on Services"},
    {value: "interview", label: "Interview Staff for an Article"},
    {value: "conference", label: "Invite ASCENDynamics to Conference"},
    {value: "partner", label: "Partner with ASCENDynamics NFP"},
    {value: "feedback", label: "Provide Site Feedback"},
    {value: "refer-client", label: "Refer a Client"},
    {value: "volunteer", label: "Volunteer at ASCENDynamics NFP"},
    {value: "other", label: "Other"},
  ];

  form = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    phone: [
      "",
      Validators.pattern("^(?=(?:\\D*\\d){10,15}$)[+]?[0-9()\\s-]+$"),
    ],
    inquiry: ["", Validators.required],
    message: ["", Validators.minLength(10)],
    from: ["ASCENDynamics NFP"],
  });

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
  ) {}

  submit() {
    if (this.form.valid) {
      this.leadService.submitLead(this.form.value as any).subscribe({
        next: () => this.form.reset({from: "ASCENDynamics NFP"}),
        error: (err: any) => console.error(err),
      });
    }
  }
}
