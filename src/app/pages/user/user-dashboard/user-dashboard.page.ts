import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.page.html",
  styleUrls: ["./user-dashboard.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserDashboardPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
