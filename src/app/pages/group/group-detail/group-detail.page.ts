import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.page.html",
  styleUrls: ["./group-detail.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupDetailPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
