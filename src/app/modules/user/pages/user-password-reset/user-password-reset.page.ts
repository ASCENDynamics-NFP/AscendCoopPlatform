import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-user-password-reset",
  templateUrl: "./user-password-reset.page.html",
  styleUrls: ["./user-password-reset.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class UserPasswordResetPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
