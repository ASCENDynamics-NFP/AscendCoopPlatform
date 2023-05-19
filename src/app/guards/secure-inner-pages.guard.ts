import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class SecureInnerPagesGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  // Used to restrict pages to users when they are logged in
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      // window.alert('Access denied!');
      this.router.navigate(["user-dashboard"]);
    }
    return true;
  }
}
