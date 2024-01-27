import {CommonModule} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-group-registration",
  templateUrl: "./group-registration.component.html",
  styleUrls: ["./group-registration.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupRegistrationComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
