import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class SecureInnerPagesGuard {
  constructor(
    public authService: AuthService,
    private navCtrl: NavController,
  ) {}

  // Used to restrict pages to users when they are logged in
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      // window.alert('Access denied!');
      this.navCtrl.navigateForward("group-list");
    }
    return true;
  }
}
