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
import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
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

@Component({
  selector: "app-feedback-modal",
  templateUrl: "./feedback-modal.component.html",
  styleUrls: ["./feedback-modal.component.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class FeedbackModalComponent {
  @Input() user?: User; // You can replace 'any' with your user type if you have one
  feedback: string = "";
  rating: number = 0; // or any default value you prefer
  category: string = ""; // or set a default category if you prefer
  attachment: string | null = null;
  categories: string[] = ["Bug Report", "Feature Request", "General Feedback"];
  isUploading: boolean = false;

  constructor(
    private errorHandler: ErrorHandlerService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private storeService: StoreService,
  ) {}

  storage = getStorage(); // This gets the default Firebase app's storage instance

  onFileChange(event: any) {
    console.log(event);
    console.log(event.target);
    const fileList: FileList = event.target.files;
    console.log(fileList);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.uploadFile(file);
    }
  }
  // Add a new class property to store the download URL of the uploaded file
  uploadedFileURL: string | null = null;

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
          console.log("File available at", downloadURL);
          this.uploadedFileURL = downloadURL;
          console.log("uploadedFileURL set to:", this.uploadedFileURL);
          this.attachment = this.uploadedFileURL;
        });
        this.isUploading = false;
        await loading.dismiss(); // Dismiss the loader on error
      },
    );
  }

  submitFeedback() {
    console.log(this.feedback, this.rating, this.category, this.attachment);
    // Here you can send the feedback to your server or handle it as you wish
    this.storeService.createDoc("feedback", {
      email: this.user?.email,
      name: this.user?.displayName, // Fixed the typo here
      emailVerified: this.user?.emailVerified,
      feedback: this.feedback,
      rating: this.rating,
      category: this.category,
      attachment: this.uploadedFileURL, // Save the download URL instead of the FileList object
      isRead: false,
      isResolved: false,
    } as Partial<AppFeedback>);
    // Close the modal after submitting
    this.modalCtrl.dismiss();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
