import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: "app-group-create",
  templateUrl: "./group-create.page.html",
  styleUrls: ["./group-create.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupCreatePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
