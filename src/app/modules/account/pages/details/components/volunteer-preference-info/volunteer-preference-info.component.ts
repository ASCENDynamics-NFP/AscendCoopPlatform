import {Component, Input} from "@angular/core";
import {VolunteerPreferences} from "../../../../../../models/account.model";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-volunteer-preference-info",
  templateUrl: "./volunteer-preference-info.component.html",
  styleUrls: ["./volunteer-preference-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class VolunteerPreferenceInfoComponent {
  @Input() volunteerPreferences?: VolunteerPreferences;

  constructor() {}
}
