import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";

@Component({
  selector: "app-group-registration",
  templateUrl: "./group-registration.component.html",
  styleUrls: ["./group-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupRegistrationComponent {
  @Input() account?: Partial<Account>;
  constructor() {}
}
