import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.page.html",
  styleUrls: ["./landing.page.scss"],
  standalone: true,

  imports: [CommonModule, IonicModule, FormsModule],
})
export class LandingPage {
  constructor() {}

  submitContactForm(event: Event) {
    event.preventDefault();
    // Handle form submission logic here
  }
}
