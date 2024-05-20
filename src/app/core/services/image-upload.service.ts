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
import {Injectable} from "@angular/core";
import {LoadingController, ToastController} from "@ionic/angular";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {StoreService} from "./store.service";

@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  storage = getStorage();

  constructor(
    private loadingController: LoadingController,
    private storeService: StoreService,
    private toastController: ToastController,
  ) {}

  async uploadImage(
    file: File,
    firestoreLocation: string,
    collectionName: string,
    docId: string,
    maxWidth: number,
    maxHeight: number,
    fieldName: string,
  ): Promise<string> {
    const loading = await this.loadingController.create({
      message: "Starting upload...",
    });
    await loading.present();

    const resizedImageBlob = await this.resizeImage(file, maxWidth, maxHeight);
    const filePath = `${firestoreLocation}/${new Date() + file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, resizedImageBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              loading.message = `Upload is paused`;
              break;
            case "running":
              loading.message = `Uploading file... ${progress.toFixed(0)}%`;
              break;
          }
        },
        async (error) => {
          loading.dismiss();
          this.showErrorToast(`Upload failed: ${error.message}`);
          reject(error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await this.saveImageToFirestore(
            collectionName,
            docId,
            downloadURL,
            fieldName,
          );
          loading.dismiss();
          resolve(downloadURL);
        },
      );
    });
  }

  private async saveImageToFirestore(
    collectionName: string,
    docId: string,
    downloadURL: string,
    fieldName: string,
  ) {
    if (!docId) {
      throw new Error("Missing document ID");
    }
    if (!downloadURL) {
      throw new Error("Missing download URL");
    }
    if (!fieldName) {
      throw new Error("Missing field name");
    }
    if (!collectionName) {
      throw new Error("Missing collection name");
    }
    const doc = {id: docId} as any;
    doc[fieldName] = downloadURL;
    await this.storeService.updateDoc(collectionName, doc);
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger",
    });
    toast.present();
  }

  private resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx!.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/jpeg",
          0.95,
        );
      };
      image.onerror = (error) =>
        reject(new Error(`Image load error: ${error}`));
    });
  }
}
