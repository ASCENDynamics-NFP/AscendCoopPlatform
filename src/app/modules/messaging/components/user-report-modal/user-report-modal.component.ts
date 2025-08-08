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
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  ModalController,
  ToastController,
  LoadingController,
} from "@ionic/angular";
import {AuthUser} from "../../../../../../shared/models/auth-user.model";
import {
  AppFeedback,
  ReportReason,
  ReportContext,
  ReportSeverity,
  ReportUtils,
  AdminAction,
} from "../../../../../../shared/models/feedback.model";
import {FirestoreService} from "../../../../core/services/firestore.service";
import {ErrorHandlerService} from "../../../../core/services/error-handler.service";

@Component({
  selector: "app-user-report-modal",
  templateUrl: "./user-report-modal.component.html",
  styleUrls: ["./user-report-modal.component.scss"],
})
export class UserReportModalComponent implements OnInit {
  @Input() reportedUserId!: string;
  @Input() reportedUserName!: string;
  @Input() chatId?: string;
  @Input() currentUser?: AuthUser;

  reportForm: FormGroup;

  // Report reasons with enum values and display labels
  reportReasons: Array<{value: ReportReason; label: string}> = [
    {value: ReportReason.HARASSMENT, label: "Harassment or Bullying"},
    {value: ReportReason.INAPPROPRIATE_CONTENT, label: "Inappropriate Content"},
    {value: ReportReason.SPAM, label: "Spam or Unwanted Messages"},
    {value: ReportReason.FAKE_PROFILE, label: "Impersonation or Fake Profile"},
    {value: ReportReason.THREATS, label: "Threats or Violence"},
    {value: ReportReason.SCAM, label: "Scam or Fraud"},
    {value: ReportReason.OTHER, label: "Other"},
  ];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private firestoreService: FirestoreService,
    private errorHandler: ErrorHandlerService,
  ) {
    this.reportForm = this.fb.group({
      reason: ["", Validators.required],
      description: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    // Pre-fill user information if available
    if (this.currentUser) {
      this.reportForm.addControl(
        "reporterName",
        this.fb.control(this.currentUser.displayName, Validators.required),
      );
      this.reportForm.addControl(
        "reporterEmail",
        this.fb.control(this.currentUser.email, [
          Validators.required,
          Validators.email,
        ]),
      );
    }
  }

  async submitReport() {
    if (this.reportForm.valid) {
      try {
        const formData = this.reportForm.value;
        const currentDate = new Date();

        // Create a feedback entry with user report data using the new properties
        const reportData: Partial<AppFeedback> = {
          // Standard feedback properties
          email: this.currentUser?.email || formData.reporterEmail,
          name: this.currentUser?.displayName || formData.reporterName,
          emailVerified: this.currentUser?.emailVerified || false,
          category: "User Report",
          type: "User Report",
          feedback: this.buildReportDescription(formData),
          rating: 1, // Low rating for reports
          attachment: "", // No attachments for now
          isRead: false,
          isResolved: false,

          // New user report specific properties
          isUserReport: true,
          reportedUserId: this.reportedUserId,
          reportedUserName: this.reportedUserName,
          reportReason: formData.reason as ReportReason,
          reportContext: this.chatId
            ? ReportContext.CHAT
            : ReportContext.PROFILE,
          chatId: this.chatId || undefined,
          reportSeverity: ReportUtils.getSeverityForReason(
            formData.reason as ReportReason,
          ),
          reporterUserId: this.currentUser?.uid,
          reportDate: currentDate,
          evidenceUrls: [], // Can be extended later for file uploads
          adminNotes: "",
          actionTaken: AdminAction.NONE,
          followUpRequired: ReportUtils.requiresFollowUp(
            formData.reason as ReportReason,
          ),
        };

        await this.firestoreService.addDocument("feedback", reportData);

        await this.showSuccessToast(
          "Report submitted successfully. Thank you for helping keep our community safe.",
        );
        this.closeModal();
      } catch (error) {
        console.error("Error submitting report:", error);
        this.errorHandler.handleFirebaseAuthError(error as any);
        await this.showErrorToast("Failed to submit report. Please try again.");
      }
    } else {
      await this.showErrorToast("Please fill out all required fields.");
    }
  }

  private buildReportDescription(formData: any): string {
    let description = `USER REPORT:\n\n`;
    description += `Reported User: ${this.reportedUserName} (ID: ${this.reportedUserId})\n`;
    description += `Reason: ${formData.reason}\n`;
    if (this.chatId) {
      description += `Chat ID: ${this.chatId}\n`;
    }
    description += `\nDescription:\n${formData.description}\n`;
    description += `\nReported by: ${formData.reporterName || this.currentUser?.displayName}\n`;
    description += `Reporter Email: ${formData.reporterEmail || this.currentUser?.email}\n`;
    description += `Report Date: ${new Date().toISOString()}`;

    return description;
  }

  closeModal() {
    this.modalController.dismiss();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "success",
      position: "top",
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }
}
