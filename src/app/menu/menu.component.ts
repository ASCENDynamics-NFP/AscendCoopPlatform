import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  standalone: true,
  imports: [IonicModule, RouterLink, RouterLinkActive, CommonModule],
})
export class MenuComponent implements OnInit {
  public appPages = [
    {title: "Login", url: "user-login", icon: "mail"},
    {title: "Signup", url: "user-signup", icon: "paper-plane"},
    {title: "Dashboard", url: "user-dashboard", icon: "heart"},
    {title: "Profile", url: "user-profile", icon: "archive"},
    {title: "Settings", url: "user-settings", icon: "trash"},
    {title: "Group List", url: "group-list", icon: "warning"},
  ];
  public labels: Array<string> = [];

  constructor() {}

  ngOnInit() {
    this.labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  }
}
