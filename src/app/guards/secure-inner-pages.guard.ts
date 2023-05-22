import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {MenuController} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class SecureInnerPagesGuard {
  constructor(
    public authService: AuthService,
    public router: Router,
    public menuCtrl: MenuController,
  ) {
    this.menuCtrl.enable(false);
  }

  // Used to restrict pages to users when they are logged in
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      // window.alert('Access denied!');
      this.menuCtrl.enable(true);
      this.router.navigate(["user-dashboard"]);
    }
    return true;
  }
}
