import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  AlertController,
  IonicModule,
  LoadingController,
  NavController,
} from "@ionic/angular";
import {Timestamp} from "firebase/firestore";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {AppUser} from "../../../models/user.model";
import {UsersService} from "../../../services/users.service";
import {MenuService} from "../../../services/menu.service";

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
    private usersService: UsersService,
    private menuService: MenuService,
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        console.log("GOT USER ON SIGN UP");
        this.router.navigateByUrl("/user-dashboard", {replaceUrl: true});
      }
    });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  async signup() {
    const loading = await this.loadingController.create();
    await loading.present();
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    if (!email || !password) {
      // Handle the case where email or password is not provided.
      this.showAlert("Signup failed", "Email and password are required");
      return;
    }

    this.authService
      .signUp(email, password)
      .then(async (data) => {
        const timestamp = Timestamp.now();
        const user: Partial<AppUser> = {
          email: email,
          displayName: "",
          profilePicture: "",
          emailVerified: false,
          bio: "",
          createdAt: timestamp,
          lastLoginAt: timestamp,
          lastModifiedAt: timestamp,
          lastModifiedBy: data.user.uid,
          name: "",
          uid: data.user.uid,
        };
        this.usersService.createUser(user);

        this.showAlert("Signup success", "Please confirm your email now!");
        this.navCtrl.navigateForward("user-profile/" + user.uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage =
          "We ran into an error processing your signup. Please try again.";
        let errorTitle = "Signup failed";
        // Handle Errors here.
        switch (errorCode) {
          case "auth/email-already-in-use":
            errorTitle = "Email already in use";
            errorMessage =
              "The email address is already in use by another account.";
            break;
          case "auth/invalid-email":
            errorTitle = "Invalid email";
            errorMessage = "The email address you have entered is not valid.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "Email/password accounts are not enabled.";
            errorMessage =
              "The type of authentication you're trying to use has not been enabled for this Firebase project.";
            break;
          case "auth/weak-password":
            errorTitle = "Weak password";
            errorMessage =
              "The password you have entered is too weak. Please choose a stronger password.";
            break;
          default:
            console.warn("An unknown error occurred: ", error.message);
            // Handle other errors
            break;
        }
        this.showAlert(errorTitle, errorMessage);
      })
      .finally(() => {
        loading.dismiss();
      });
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
