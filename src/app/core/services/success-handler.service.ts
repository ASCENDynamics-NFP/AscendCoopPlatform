import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class SuccessHandlerService {
  constructor(private toastController: ToastController) {}

  handleSuccess(message: string): void {
    this.showToast(message);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 8000,
      position: "top",
      color: "success",
      buttons: [
        {
          text: "OK",
          role: "cancel",
        },
      ],
    });
    await toast.present();
  }
}
