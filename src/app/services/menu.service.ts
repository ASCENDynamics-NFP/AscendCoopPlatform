import {Injectable} from "@angular/core";
import {MenuController} from "@ionic/angular";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  constructor(
    public authService: AuthService,
    public menuCtrl: MenuController,
  ) {}

  onEnter() {
    this.removeMenu();
    const user = this.authService.getCurrentUser();

    if (user) {
      this.showMenuByRole("user");
    } else {
      this.showMenuByRole("guest");
    }
  }

  onLeave() {
    this.removeMenu();
  }

  showMenuByRole(role: string) {
    if (role === "admin") {
      this.showMenuById("admin");
    } else if (role === "user") {
      this.showMenuById("user");
    } else {
      this.showMenuById("guest");
    }
  }

  showMenu() {
    this.menuCtrl.enable(true);
  }

  removeMenu() {
    this.menuCtrl.enable(false);
  }

  showMenuById(menuId: string) {
    this.menuCtrl.enable(true, menuId);
  }
}
