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
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import {Observable, of, forkJoin} from "rxjs";
import {map, catchError, switchMap, take} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {ToastController} from "@ionic/angular";
import {ChatService} from "../services/chat.service";
import {RelationshipService} from "../services/relationship.service";
import {AuthState} from "../../../state/reducers/auth.reducer";
import {selectAuthUser} from "../../../state/selectors/auth.selectors";

@Injectable({
  providedIn: "root",
})
export class ChatAccessGuard implements CanActivate {
  constructor(
    private chatService: ChatService,
    private relationshipService: RelationshipService,
    private router: Router,
    private store: Store<{auth: AuthState}>,
    private toastController: ToastController,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const chatId = route.paramMap.get("id");

    if (!chatId) {
      this.showErrorToast("Invalid chat ID");
      return this.router.createUrlTree(["/messaging/chats"]);
    }

    return this.store.select(selectAuthUser).pipe(
      take(1),
      switchMap((user) => {
        if (!user?.uid) {
          this.showErrorToast("Authentication required");
          return of(this.router.createUrlTree(["/auth/login"]));
        }

        return this.validateChatAccess(chatId, user.uid);
      }),
      catchError((error) => {
        console.error("Error in ChatAccessGuard:", error);
        this.showErrorToast("Error accessing chat");
        return of(this.router.createUrlTree(["/messaging/chats"]));
      }),
    );
  }

  /**
   * Validate if user has access to the chat
   */
  private validateChatAccess(
    chatId: string,
    currentUserId: string,
  ): Observable<boolean | UrlTree> {
    return this.chatService.getChat(chatId).pipe(
      take(1),
      switchMap((chat) => {
        if (!chat) {
          this.showErrorToast("Chat not found");
          return of(this.router.createUrlTree(["/messaging/chats"]));
        }

        // Check if participants array exists and current user is in it
        if (
          !chat.participants ||
          !Array.isArray(chat.participants) ||
          !chat.participants.includes(currentUserId)
        ) {
          this.showErrorToast("You don't have access to this chat");
          return of(this.router.createUrlTree(["/messaging/chats"]));
        }

        // For group chats, allow access if user is participant
        if (chat.isGroup) {
          return of(true);
        }

        // For 1-on-1 chats, validate relationships
        const otherParticipant = chat.participants.find(
          (p) => p !== currentUserId,
        );

        if (!otherParticipant) {
          this.showErrorToast("Invalid chat configuration");
          return of(this.router.createUrlTree(["/messaging/chats"]));
        }

        // Check if user can message the other participant
        return this.relationshipService
          .canMessage(currentUserId, otherParticipant)
          .pipe(
            map((canMessage) => {
              if (!canMessage) {
                this.showErrorToast("You can only message accepted friends");
                return this.router.createUrlTree(["/messaging/chats"]);
              }
              return true;
            }),
          );
      }),
    );
  }

  /**
   * Show error toast message
   */
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
