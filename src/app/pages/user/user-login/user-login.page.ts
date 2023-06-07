import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule, LoadingController} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {MenuService} from "../../../services/menu.service";

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
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private menuService: MenuService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON LOGIN");
        this.router.navigateByUrl("/user-dashboard", {replaceUrl: true});
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

  async login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    if (!email || !password) {
      // Handle the case where email or password is not provided.
      console.log("Email and password are required");
      return;
    }

    try {
      const user = await this.authService.signIn(email, password);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
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
            const loading = await this.loadingController.create();
            await loading.present();
            this.authService.onSendPasswordResetEmail(result.email);
            await loading.dismiss();
            this.showAlert(
              "Success",
              "Please check your email for further instructions!",
            );
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
            const loading = await this.loadingController.create();
            await loading.present();
            this.authService
              .onSendSignInLinkToEmail(result.email)
              .then(() => {
                // The link was successfully sent. Inform the user.
                // Save the email locally so you don't need to ask the user for it again
                // if they open the link on the same device.
                window.localStorage.setItem("emailForSignIn", result.email);
                this.showAlert(
                  "Success",
                  "Please check your email for further instructions!",
                );
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                this.showAlert("Failed", error.message);
              })
              .finally(() => {
                loading.dismiss();
              });
          },
        },
      ],
    });
    await alert.present();
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  goToSignUp() {
    this.router.navigateByUrl("/user-signup", {replaceUrl: false});
  }
}
