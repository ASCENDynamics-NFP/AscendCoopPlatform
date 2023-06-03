import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import { User } from "firebase/auth";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class MenuComponent implements OnInit {
  user: User | null = null;
  public userPages = {
    // User
    user: [
      {title: "Profile", url: `user-profile/${this.user?.uid}`, icon: "archive"},
      {title: "Settings", url: `user-settings/${this.user?.uid}`, icon: "trash"},
      {title: "Dashboard", url: `user-dashboard/${this.user?.uid}`, icon: "heart"},
    ],
    // Group
    group: [
      {title: "Group List", url: "group-list", icon: "warning"},
      {title: "Group Create", url: "group-create", icon: "archive"},
      {title: "Group Profile", url: "group-profile", icon: "warning"},
      {title: "Group Detail", url: "group-detail", icon: "heart"},
      {title: "Group Edit", url: "group-edit", icon: "trash"},
      {title: "Group Members", url: "group-members", icon: "warning"},
    ],
  };
  public guestPages = {
    // User
    user: [
      {title: "Login", url: "user-login", icon: "mail"},
      {title: "Signup", url: "user-signup", icon: "paper-plane"},
    ],
    // Group
    group: [
      {title: "Group List", url: "group-list", icon: "warning"},
      {title: "Group Profile", url: "group-profile", icon: "warning"},
      {title: "Group Detail", url: "group-detail", icon: "heart"},
      {title: "Group Members", url: "group-members", icon: "warning"},
    ],
  };
  public labels: Array<string> = [];

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON MENU");
        this.user = user;
        this.userPages.user = [
            {title: "Profile", url: `user-profile/${this.user?.uid}`, icon: "archive"},
            {title: "Settings", url: `user-settings/${this.user?.uid}`, icon: "trash"},
            {title: "Dashboard", url: `user-dashboard/${this.user?.uid}`, icon: "heart"},
          ];
      }
    });
  }

  ngOnInit() {
    this.labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  }

  signOut() {
    this.authService.signOut();
  }
}
