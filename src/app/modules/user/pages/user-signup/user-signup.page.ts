import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "../../../../core/services/auth.service";
import {MenuService} from "../../../../core/services/menu.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: "app-user-signup",
  templateUrl: "./user-signup.page.html",
  styleUrls: ["./user-signup.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class UserSignupPage {
  signupForm = this.fb.nonNullable.group({
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: [
      "",
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private menuService: MenuService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON SIGN UP");
        this.router.navigateByUrl("/user-profile/" + user.uid, {
          replaceUrl: true,
        });
      }
    });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    this.authService.signUp(email, password);
  }
}
