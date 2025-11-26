import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {ToastController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";
import {Chat} from "../models/chat.model";
import {RelationshipService} from "../services/relationship.service";

@Injectable({
  providedIn: "root",
})
export class ChatHelperService {
  constructor(
    private router: Router,
    private toastController: ToastController,
    private relationshipService: RelationshipService,
  ) {}

  /**
   * Validate user has access to this chat based on relationships
   */
  async validateChatAccess(
    chat: Chat,
    currentUserId: string,
  ): Promise<{
    canAccess: boolean;
    otherParticipantId: string | null;
    isContactBlocked: boolean;
    canSendMessages: boolean;
  }> {
    const result = {
      canAccess: false,
      otherParticipantId: null as string | null,
      isContactBlocked: false,
      canSendMessages: true,
    };

    try {
      if (!currentUserId) {
        await this.showErrorToast("Authentication required");
        this.router.navigate(["/messaging/chats"]);
        return result;
      }

      // Check if user is a participant
      if (!chat.participants.includes(currentUserId)) {
        await this.showErrorToast("You don't have access to this chat");
        this.router.navigate(["/messaging/chats"]);
        return result;
      }

      result.canAccess = true;

      // For group chats, skip individual relationship validation
      if (chat.isGroup) {
        return result;
      }

      // For 1-on-1 chats, validate relationship with the other participant
      result.otherParticipantId =
        chat.participants.find((p) => p !== currentUserId) || null;

      if (result.otherParticipantId) {
        // Check if contact is blocked
        result.isContactBlocked =
          (await firstValueFrom(
            this.relationshipService.isUserBlocked(
              currentUserId,
              result.otherParticipantId,
            ),
          )) || false;

        // Check if can message
        const canMessage =
          (await firstValueFrom(
            this.relationshipService.canMessage(
              currentUserId,
              result.otherParticipantId,
            ),
          )) || false;

        result.canSendMessages = !result.isContactBlocked && canMessage;

        // Validate that user can access this chat
        if (!canMessage) {
          await this.showErrorToast("You can only message accepted friends");
          this.router.navigate(["/messaging/chats"]);
          result.canAccess = false;
          return result;
        }
      }

      return result;
    } catch (error) {
      console.error("Error validating chat access:", error);
      await this.showErrorToast("Error validating chat access");
      this.router.navigate(["/messaging/chats"]);
      result.canAccess = false;
      return result;
    }
  }

  /**
   * Get file preview type based on MIME type
   */
  getFilePreviewType(file: File): "image" | "video" | "audio" | "document" {
    if (file.type.startsWith("image/")) {
      return "image";
    } else if (file.type.startsWith("video/")) {
      return "video";
    } else if (file.type.startsWith("audio/")) {
      return "audio";
    } else {
      return "document";
    }
  }

  /**
   * Get file icon based on file type
   */
  getFileIcon(fileType: string): string {
    if (fileType.startsWith("image/")) return "image-outline";
    if (fileType.startsWith("video/")) return "videocam-outline";
    if (fileType.startsWith("audio/")) return "musical-notes-outline";
    if (fileType.includes("pdf")) return "document-text-outline";
    if (fileType.includes("word") || fileType.includes("doc"))
      return "document-outline";
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return "grid-outline";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "easel-outline";
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("archive")
    )
      return "archive-outline";
    return "document-outline";
  }

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: "danger",
      position: "bottom",
    });
    await toast.present();
  }
}
