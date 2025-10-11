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
// src/app/modules/info/components/lead-form/lead-form.component.ts

import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";
import {LeadService} from "../../../../core/services/lead.service";

@Component({
  selector: "app-lead-form",
  templateUrl: "./lead-form.component.html",
  styleUrls: ["./lead-form.component.scss"],
})
export class LeadFormComponent implements OnInit {
  form: FormGroup;
  inquiries = [
    {value: "general", label: "General inquiry"},
    {value: "volunteer", label: "Volunteer opportunities"},
    {value: "collaboration", label: "Collaboration"},
    {value: "funding", label: "Funding & support"},
    {value: "technical", label: "Technical assistance"},
    {value: "other", label: "Other"},
  ];

  constructor(
    private formBuilder: FormBuilder,
    private leadService: LeadService,
    private toastController: ToastController,
  ) {
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [
        "",
        Validators.pattern("^(?=(?:\\D*\\d){10,15}$)[+]?[0-9()\\s-]+$"),
      ],
      inquiry: ["", Validators.required],
      message: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {}

  /**
   * Format phone number input as user types
   */
  onPhoneInput(event: any) {
    const input = event.target.value;
    const formatted = this.formatPhoneNumber(input);
    this.form.patchValue({phone: formatted});
  }

  /**
   * Format phone number to (###) ###-#### or +# (###) ###-#### pattern
   */
  private formatPhoneNumber(value: string): string {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Don't format if empty
    if (!digits) return "";

    // Limit to 15 digits
    const limitedDigits = digits.slice(0, 15);

    // Determine if it's an international number (starts with country code other than 1)
    const isInternational =
      limitedDigits.length > 10 ||
      (limitedDigits.length === 11 && limitedDigits[0] !== "1");

    if (isInternational) {
      // International format: +# (###) ###-#### or +## (###) ###-#### etc.
      if (limitedDigits.length <= 1) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 4) {
        return `+${limitedDigits}`;
      } else if (limitedDigits.length <= 7) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        return `+${countryCode} (${areaCode})`;
      } else if (limitedDigits.length <= 10) {
        const countryCode = limitedDigits.slice(0, -6);
        const areaCode = limitedDigits.slice(-6, -3);
        const firstPart = limitedDigits.slice(-3);
        return `+${countryCode} (${areaCode}) ${firstPart}`;
      } else {
        const countryCode = limitedDigits.slice(0, -10);
        const areaCode = limitedDigits.slice(-10, -7);
        const firstPart = limitedDigits.slice(-7, -4);
        const lastPart = limitedDigits.slice(-4);
        return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
      }
    } else {
      // Domestic US format: (###) ###-####
      if (limitedDigits.length <= 3) {
        return limitedDigits.length === 0 ? "" : `(${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
      } else {
        const areaCode = limitedDigits.slice(0, 3);
        const firstPart = limitedDigits.slice(3, 6);
        const lastPart = limitedDigits.slice(6, 10);
        return `(${areaCode}) ${firstPart}-${lastPart}`;
      }
    }
  }

  /**
   * Show success toast message
   */
  private async showSuccessToast() {
    const toast = await this.toastController.create({
      message:
        "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      duration: 4000,
      color: "success",
      position: "top",
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  /**
   * Show error toast message
   */
  private async showErrorToast() {
    const toast = await this.toastController.create({
      message:
        "Sorry, there was an error sending your message. Please try again.",
      duration: 4000,
      color: "danger",
      position: "top",
      buttons: [
        {
          text: "Dismiss",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }

  async submit() {
    if (this.form.valid) {
      try {
        const leadData = {
          ...this.form.value,
          from: "landing-page",
        };

        const response = await firstValueFrom(
          this.leadService.submitLead(leadData),
        );

        this.form.reset();
        await this.showSuccessToast();
      } catch (error: any) {
        console.error("Error submitting lead form:", error);

        // Check if it's a network error but the data might have been saved
        if (error?.status === 0 || error?.status === 200) {
          // Network error or successful response that wasn't parsed correctly
          this.form.reset();
          await this.showSuccessToast();
        } else {
          await this.showErrorToast();
        }
      }
    }
  }
}
