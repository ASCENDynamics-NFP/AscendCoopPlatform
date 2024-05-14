import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class HeroComponent {
  @Input() account?: Partial<Account>;
  segment: string = "profile"; // Default selected segment
  constructor() {}

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({behavior: "smooth"});
  }
}
