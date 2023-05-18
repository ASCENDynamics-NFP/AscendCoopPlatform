import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule, NavController} from "@ionic/angular";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.page.html",
  styleUrls: ["./user-dashboard.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserDashboardPage implements OnInit {
  user = this.authService.getCurrentUser();
  constructor(
    private authService: AuthService,
    private navContoller: NavController,) {}

  ngOnInit() {}

  signOut() {
    this.authService.signOut();
  }

  openLogin() {
    this.navContoller.navigateBack('/');
  }
}
