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
import {CommonModule} from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {IonicModule, LoadingController, ModalController} from "@ionic/angular";
import {User} from "firebase/auth";
import {StoreService} from "../../../core/services/store.service";
import {AppFeedback} from "../../../models/feedback.model";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";

// Custom validator to check if the file is an image
function imageFileValidator(
  control: AbstractControl,
): {[key: string]: any} | null {
  const file = control.value;
  if (file) {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.indexOf(file.type) === -1) {
      return {invalidImageType: true};
    }
  }
  return null;
}

// Custom validator to check if the file size is <= 5MB
function fileSizeValidator(
  control: AbstractControl,
): {[key: string]: any} | null {
  const file = control.value;
  if (file && file.size > 5 * 1024 * 1024) {
    // 5MB in bytes
    return {invalidFileSize: true};
  }
  return null;
}

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.component.html",
  styleUrls: ["./feedback-modal.component.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
})
export class FeedbackModalComponent implements OnInit {
  @Input() user?: User; // You can replace 'any' with your user type if you have one
  feedbackForm: FormGroup = this.fb.group({
    category: ["Bug Report", Validators.required],
    feedback: ["", Validators.required],
    attachment: [null, [imageFileValidator, fileSizeValidator]],
    rating: [3, [Validators.min(1), Validators.max(5)]],
  });
  categories: string[] = ["Bug Report", "Feature Request", "General Feedback"];
  isUploading: boolean = false;
  uploadedFileURL: string | null = null; // Add a new class property to store the download URL of the uploaded file
  storage = getStorage(); // This gets the default Firebase app's storage instance

  constructor(
    private errorHandler: ErrorHandlerService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private storeService: StoreService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    if (this.user) {
      this.feedbackForm.addControl(
        "name",
        this.fb.control(this.user?.displayName, Validators.required),
      );
      this.feedbackForm.addControl(
        "email",
        this.fb.control(this.user?.email, [
          Validators.required,
          Validators.email,
        ]),
      );
    } else {
      this.feedbackForm.addControl(
        "name",
        this.fb.control("", Validators.required),
      );
      this.feedbackForm.addControl(
        "email",
        this.fb.control("", [Validators.required, Validators.email]),
      );
    }
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.feedbackForm.get("attachment")?.setValue(file);
      this.uploadFile(file);
    }
  }

  async uploadFile(file: File) {
    const storageRef = ref(
      this.storage,
      `feedback/${this.user?.uid}/${new Date()}-${file.name}`,
    ); // This creates a reference to the file's future location

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Present the loader
    const loading = await this.loadingController.create({
      message: "Uploading file...",
    });
    await loading.present();

    this.isUploading = true;

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle the upload progress, maybe update a progress bar or show a message
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case "paused":
            loading.message = `Upload is paused`; // Update the loader message
            break;
          case "running":
            loading.message = `Uploading file... ${progress.toFixed(0)}%`; // Update the loader message
            break;
        }
      },
      async (error) => {
        // Handle errors, maybe show a message to the user
        this.errorHandler.handleFirebaseAuthError(error);
        switch (error.code) {
          case "storage/unauthorized":
            console.error("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            console.error("User canceled the upload");
            break;
          case "storage/unknown":
            console.error(
              "Unknown error occurred, inspect error.serverResponse",
            );
            break;
        }
        this.isUploading = false;
        await loading.dismiss(); // Dismiss the loader on error
      },
      async () => {
        // Once the upload is complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          this.uploadedFileURL = downloadURL;
          // console.log("uploadedFileURL set to:", this.uploadedFileURL);
          // this.attachment = this.uploadedFileURL;
        });
        this.isUploading = false;
        await loading.dismiss(); // Dismiss the loader on error
      },
    );
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      const formData = this.feedbackForm.value;
      this.storeService.createDoc("feedback", {
        email: this.user?.email,
        name: this.user?.displayName,
        emailVerified: this.user?.emailVerified,
        feedback: formData.feedback,
        rating: formData.rating,
        category: formData.category,
        attachment: this.uploadedFileURL,
        isRead: false,
        isResolved: false,
      } as Partial<AppFeedback>);
      this.modalCtrl.dismiss();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
