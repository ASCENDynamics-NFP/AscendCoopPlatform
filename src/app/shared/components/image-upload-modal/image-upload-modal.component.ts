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
import {ModalController, ToastController} from "@ionic/angular";
import {ImageUploadService} from "../../../core/services/image-upload.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

interface ImageTypeConfig {
  title: string;
  subtitle: string;
  icon: string;
  aspectRatio: string;
  recommendedSize: string;
  maxFileSize: number; // in MB
}

@Component({
  selector: "app-image-upload-modal",
  templateUrl: "./image-upload-modal.component.html",
  styleUrls: ["./image-upload-modal.component.scss"],
})
export class ImageUploadModalComponent implements OnInit {
  @Input() collectionName!: string;
  @Input() docId!: string;
  @Input() firestoreLocation!: string; // e.g. 'users/userId/profileImage'
  @Input() imageHeight!: number;
  @Input() imageWidth!: number;
  @Input() fieldName!: string;
  @Input() currentImageUrl?: string; // Current image that will be replaced

  imagePreview!: SafeUrl | string | ArrayBuffer;
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  isDragOver = false;
  errorMessage = "";

  imageTypeConfig: ImageTypeConfig = {
    title: "Upload Image",
    subtitle: "Select an image to upload",
    icon: "image-outline",
    aspectRatio: "1:1",
    recommendedSize: "200x200",
    maxFileSize: 5,
  };

  constructor(
    private imageUploadService: ImageUploadService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.configureImageType();
  }

  private configureImageType() {
    if (this.fieldName === "heroImage") {
      this.imageTypeConfig = {
        title: "Upload Hero Image",
        subtitle: "This will be displayed as your background banner",
        icon: "image-outline",
        aspectRatio: "3:1",
        recommendedSize: "900x300",
        maxFileSize: 10,
      };
    } else if (this.fieldName === "iconImage") {
      this.imageTypeConfig = {
        title: "Upload Profile Icon",
        subtitle: "This will be displayed as your profile picture",
        icon: "person-circle-outline",
        aspectRatio: "1:1",
        recommendedSize: "200x200",
        maxFileSize: 5,
      };
    }
  }

  get imagePreviewString(): string {
    return this.imagePreview as string;
  }

  get isHeroImage(): boolean {
    return this.fieldName === "heroImage";
  }

  get isIconImage(): boolean {
    return this.fieldName === "iconImage";
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileInput(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.handleFileSelection(file);
    }
  }

  private handleFileSelection(file: File) {
    this.errorMessage = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      this.errorMessage = "Please select a valid image file.";
      return;
    }

    // Validate file size
    const maxSizeInBytes = this.imageTypeConfig.maxFileSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.errorMessage = `File size must be less than ${this.imageTypeConfig.maxFileSize}MB.`;
      return;
    }

    this.selectedFile = file;
    this.previewImage(file);
  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const unsafeImageUrl = reader.result as string;
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    };
    reader.readAsDataURL(file);
  }

  async uploadImage() {
    if (!this.selectedFile) {
      this.showError("Please select an image to upload.");
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      const downloadURL = await this.imageUploadService.uploadImage(
        this.selectedFile,
        this.firestoreLocation,
        this.collectionName,
        this.docId,
        this.imageWidth,
        this.imageHeight,
        this.fieldName,
      );

      await this.showSuccess("Image uploaded successfully!");
      this.modalCtrl.dismiss(downloadURL);
    } catch (error: any) {
      this.showError(
        error.message || "Failed to upload image. Please try again.",
      );
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  clearSelection() {
    this.selectedFile = null;
    this.imagePreview = "";
    this.errorMessage = "";

    // Clear file input
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "danger",
      position: "top",
    });
    await toast.present();
  }

  private async showSuccess(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: "success",
      position: "top",
    });
    await toast.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
