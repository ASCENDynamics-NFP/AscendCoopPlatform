import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {MessagingPage} from "./messaging.page";
import {ChatAccessGuard} from "../../guards/chat-access.guard";

const routes: Routes = [
  {
    path: "",
    component: MessagingPage,
    children: [
      {
        path: "",
        redirectTo: "chats",
        pathMatch: "full",
      },
      {
        path: "chats",
        loadChildren: () =>
          import("../chat-list/chat-list.module").then(
            (m) => m.ChatListPageModule,
          ),
      },
      {
        path: "chat/:id",
        canActivate: [ChatAccessGuard],
        loadChildren: () =>
          import("../chat-window/chat-window.module").then(
            (m) => m.ChatWindowPageModule,
          ),
      },
      {
        path: "new-chat",
        loadChildren: () =>
          import("../new-chat/new-chat.module").then(
            (m) => m.NewChatPageModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagingPageRoutingModule {}
