import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {ProfessionalInformation} from "../../../../../../models/account.model";

@Component({
  selector: "app-professional-info",
  templateUrl: "./professional-info.component.html",
  styleUrls: ["./professional-info.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProfessionalInfoComponent {
  @Input() professionalInfo?: ProfessionalInformation;

  constructor() {}
}
