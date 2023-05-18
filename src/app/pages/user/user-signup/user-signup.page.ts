import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-user-signup",
  templateUrl: "./user-signup.page.html",
  styleUrls: ["./user-signup.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
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
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private navCtrl: NavController,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON SIGN UP");
        this.router.navigateByUrl("/user-dashboard", {replaceUrl: true});
      }
    });
  }

  async signup() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;

      if (!email || !password) {
        // Handle the case where email or password is not provided.
        console.log("Email and password are required");
        this.showAlert("Signup failed", "Email and password are required");
        return;
      }

      this.authService.signUp(email, password).then(async (data) => {
        await loading.dismiss();
        console.log("data: ", data);

        this.showAlert("Signup success", "Please confirm your email now!");
        this.navCtrl.navigateBack("");
      });
    } catch (error) {
      this.showAlert(
        "Signup failed",
        "We ran into an error processing your signup. Please try again.",
      );
      console.log(error);
    }
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
