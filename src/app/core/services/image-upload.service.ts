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
// image-upload.service.ts
import {Injectable} from "@angular/core";
import {LoadingController, ToastController} from "@ionic/angular";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  private storage = getStorage();

  constructor(
    private loadingController: LoadingController,
    private firestoreService: FirestoreService,
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

    try {
      const resizedImageBlob = await this.resizeImage(
        file,
        maxWidth,
        maxHeight,
      );
      const filePath = `${firestoreLocation}/${new Date().toISOString()}_${
        file.name
      }`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, resizedImageBlob);

      const downloadURL = await this.monitorUploadTask(uploadTask, loading);
      await this.saveImageToFirestore(
        collectionName,
        docId,
        downloadURL,
        fieldName,
      );

      return downloadURL;
    } catch (error: any) {
      await loading.dismiss();
      await this.showErrorToast(`Upload failed: ${error.message || error}`);
      throw error;
    } finally {
      await loading.dismiss();
    }
  }

  private monitorUploadTask(
    uploadTask: UploadTask,
    loading: HTMLIonLoadingElement,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          loading.message = `Uploading file... ${progress.toFixed(0)}%`;
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }

  private async saveImageToFirestore(
    collectionName: string,
    docId: string,
    downloadURL: string,
    fieldName: string,
  ): Promise<void> {
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
    const docData = {[fieldName]: downloadURL};
    await this.firestoreService.updateDocument(collectionName, docId, docData);
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "danger",
    });
    await toast.present();
  }

  private resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.src = url;

      image.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let {width, height} = image;

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
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas is empty"));
            }
          },
          "image/jpeg",
          0.95,
        );
      };

      image.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Image load error: ${error}`));
      };
    });
  }
}
