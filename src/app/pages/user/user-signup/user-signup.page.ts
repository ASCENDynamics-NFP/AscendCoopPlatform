import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {AlertController, IonicModule, LoadingController} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: "app-user-signup",
  templateUrl: "./user-signup.page.html",
  styleUrls: ["./user-signup.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class UserSignupPage implements OnInit {
  // signupForm: FormControl = new FormControl(false);
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) {}

  signupForm: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {}

  async signup() {
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;

    if (!email || !password) {
      // Handle the case where email or password is not provided.
      console.log("Email and password are required");
      return;
    }

    try {
      const user = await this.authService.signUp(email, password);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
}
