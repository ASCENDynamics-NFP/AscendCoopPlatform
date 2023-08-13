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
  ): Promise<string> {
    const loading = await this.loadingController.create({
      message: "Starting upload...",
    });
    await loading.present();

    const resizedImageBlob = await this.resizeImage(file, maxWidth, maxHeight);
    const filePath = `${firestoreLocation}/${file.name}`;
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
          await this.saveImageToFirestore(collectionName, docId, downloadURL);
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
  ) {
    await this.storeService.updateDoc(collectionName, {
      id: docId,
      profilePicture: downloadURL,
    });
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
