import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AlertController, IonicModule, LoadingController} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.page.html",
  styleUrls: ["./user-login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class UserLoginPage {
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
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON LOGIN");
        this.router.navigateByUrl("/user-dashboard", {replaceUrl: true});
      }
    });
  }

  get email() {
    return this.loginForm.value.email;
  }

  get password() {
    return this.loginForm.value.password;
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

  // async getMagicLink() {
  //   const alert = await this.alertController.create({
  //     header: 'Get a Magic Link',
  //     message: 'We will send you a link to magically log in!',
  //     inputs: [
  //       {
  //         type: 'email',
  //         name: 'email',
  //         value: 'isaacout@gmail.com',
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Get Magic Link',
  //         handler: async (result) => {
  //           const loading = await this.loadingController.create();
  //           await loading.present();
  //           const { data, error } = await this.authService.onSignInWithEmailLink(result.email);
  //           await loading.dismiss();
  //           console.log('after signup: ', data);
  //           console.log('after signup error: ', error);

  //           if (error) {
  //             this.showAlert('Failed', error.message);
  //           } else {
  //             this.showAlert('Success', 'Please check your emails for further instructions!');
  //           }
  //         },
  //       },
  //     ],
  //   });
  //   await alert.present();
  // }

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
