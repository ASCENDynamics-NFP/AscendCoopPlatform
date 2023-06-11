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
import {User} from "../../../models/user.model";
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
        console.log("data: ", data);
        const timestamp = Timestamp.now();
        const user: User = {
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
          id: data.user.uid,
        };
        const userId = await this.usersService.createUser(user);
        await loading.dismiss();
        if (!userId) {
          this.showAlert(
            "Signup failed",
            "We ran into an error processing your signup. Please try again.",
          );
          return;
        }

        this.showAlert("Signup success", "Please confirm your email now!");
        this.navCtrl.navigateForward("user-profile/" + userId);
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
