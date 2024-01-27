import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserRegistrationComponent {
  @Input() account?: Partial<Account>;
  constructor() {}
}
