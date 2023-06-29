import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";

@Component({
  selector: "app-group-members",
  templateUrl: "./group-members.page.html",
  styleUrls: ["./group-members.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupMembersPage implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}
}
