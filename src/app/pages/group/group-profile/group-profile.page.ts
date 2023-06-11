import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../services/menu.service";
import {GroupsService} from "../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {Group} from "../../../models/group.model";

@Component({
  selector: "app-group-profile",
  templateUrl: "./group-profile.page.html",
  styleUrls: ["./group-profile.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupProfilePage implements OnInit {
  group: Group | any;
  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private groupsService: GroupsService,
  ) {}

  ngOnInit() {
    this.getGroup();
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  async getGroup() {
    this.groupsService
      .getGroup(this.route.snapshot.paramMap.get("groupId"))
      .then((group) => {
        this.group = group;
        console.log(group);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
