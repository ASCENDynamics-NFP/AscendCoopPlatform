import {CommonModule} from "@angular/common";
import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserRegistrationComponent {
  constructor() {}
}
