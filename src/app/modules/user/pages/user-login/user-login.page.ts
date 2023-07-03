import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule} from "@ionic/angular";
import {AuthService} from "../../../../core/services/auth.service";
import {Router} from "@angular/router";
import {MenuService} from "../../../../core/services/menu.service";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.page.html",
  styleUrls: ["./user-login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class UserLoginPage implements OnInit {
  loginForm = this.fb.nonNullable.group({
    // Using Validators.compose() for multiple validation rules
    email: ["", Validators.compose([Validators.required, Validators.email])],
    password: [
      "",
      Validators.compose([Validators.required, Validators.minLength(6)]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private menuService: MenuService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON LOGIN");
        this.router.navigateByUrl("/user-dashboard/" + user?.uid, {
          replaceUrl: true,
        });
      }
    });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  ngOnInit() {
    this.authService.onSignInWithEmailLink();
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.signIn(email, password);
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: "Receive a new password",
      message: "Please insert your email",
      inputs: [
        {
          type: "email",
          name: "email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Reset password",
          handler: async (result) => {
            this.authService.onSendPasswordResetEmail(result.email);
          },
        },
      ],
    });
    await alert.present();
  }

  async getEmailSignInLink() {
    const alert = await this.alertController.create({
      header: "Get an Email SignIn Link",
      message: "We will send you a link to log in!",
      inputs: [
        {
          type: "email",
          name: "email",
          value: "",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Get an Email SignIn Link",
          handler: async (result) => {
            this.authService.onSendSignInLinkToEmail(result.email);
          },
        },
      ],
    });
    await alert.present();
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }

  goToSignUp() {
    this.router.navigateByUrl("/user-signup", {replaceUrl: false});
  }
}
