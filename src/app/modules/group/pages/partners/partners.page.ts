import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.page.html",
  styleUrls: ["./partners.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class PartnersPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
