import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule, NavController} from "@ionic/angular";
import {AuthService} from "../../../../core/services/auth.service";
import {MenuService} from "../../../../core/services/menu.service";

@Component({
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.page.html",
  styleUrls: ["./user-dashboard.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserDashboardPage implements OnInit {
  user = this.authService.user$;

  constructor(
    private authService: AuthService,
    private navContoller: NavController,
    public menuService: MenuService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  signOut() {
    this.authService.signOut();
  }

  openLogin() {
    this.navContoller.navigateBack("/user-login");
  }
}
