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

  async onEnter() {
    const isLoggedIn = this.authService.isLoggedIn;
    if (isLoggedIn) {
      await this.menuCtrl.enable(false, "guest");
      await this.menuCtrl.enable(true, "user");
    } else {
      await this.menuCtrl.enable(false, "user");
      await this.menuCtrl.enable(true, "guest");
    }
  }
}
