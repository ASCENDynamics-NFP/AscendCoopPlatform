import {Injectable} from "@angular/core";
import {ToastController} from "@ionic/angular";

/**
 * Simple test service to verify notification system functionality
 */
@Injectable({
  providedIn: "root",
})
export class NotificationTestService {
  constructor(private toastController: ToastController) {}

  /**
   * Test browser notification permissions
   */
  async testNotificationPermissions(): Promise<void> {
    if (!("Notification" in window)) {
      await this.showToast("Browser notifications not supported");
      return;
    }

    const permission = Notification.permission;
    let message = "";

    switch (permission) {
      case "granted":
        message = "✅ Notifications are enabled";
        break;
      case "denied":
        message = "❌ Notifications are blocked";
        break;
      case "default":
        message = "⚠️ Notification permission not requested yet";
        break;
    }

    await this.showToast(message);
  }

  /**
   * Test sending a notification
   */
  async testSendNotification(): Promise<void> {
    if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from your chat app!",
        icon: "/assets/icon/favicon.png",
        badge: "/assets/icon/favicon.png",
      });
      await this.showToast("Test notification sent!");
    } else {
      await this.showToast("Please enable notifications first");
    }
  }

  /**
   * Show a toast message
   */
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: "bottom",
    });
    await toast.present();
  }
}
