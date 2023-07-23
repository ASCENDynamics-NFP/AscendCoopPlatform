import {CommonModule} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {AppUser} from "../../../../../../models/user.model";
import {RouterModule} from "@angular/router";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class DetailsComponent implements OnInit {
  @Input() user: AppUser | null = null; // define your user here
  dateOfBirth: Date = new Date(); // default initialization

  constructor() {}

  ngOnInit() {
    // If user and dateOfBirth exist, convert to Date, otherwise leave as default Date
    this.dateOfBirth = this.user?.dateOfBirth?.toDate() || this.dateOfBirth;
  }
}
