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
export class AuthGuard {
  constructor(
    public authService: AuthService,
    public menuCtrl: MenuController,
    public router: Router,
  ) {
    this.menuCtrl.enable(false);
  }

  // Used to restrict pages to users when they are logged out
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log("AuthGuard#canActivate called", this.authService.isLoggedIn);
    if (this.authService.isLoggedIn !== true) {
      // window.alert('Access Denied, Login is Required to Access This Page!');
      this.router.navigate(["user-login"]);
    }
    this.menuCtrl.enable(true);
    return true;
  }
}
