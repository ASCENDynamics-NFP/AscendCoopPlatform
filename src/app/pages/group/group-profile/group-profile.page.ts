import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-group-profile",
  templateUrl: "./group-profile.page.html",
  styleUrls: ["./group-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupProfilePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
