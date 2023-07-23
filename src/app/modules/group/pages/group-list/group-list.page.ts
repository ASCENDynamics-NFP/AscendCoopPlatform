import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule, LoadingController} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {GroupsService} from "../../../../core/services/groups.service";
import {DocumentData} from "firebase/firestore";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.page.html",
  styleUrls: ["./group-list.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class GroupListPage implements OnInit {
  groups: DocumentData[] | null = [];
  searchTerm: string = "";

  constructor(
    private menuService: MenuService,
    private groupService: GroupsService,
    private loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.getGroups();
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  async getGroups() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.groupService
      .getGroups()
      .then((groups) => {
        this.groups = groups;
        // Do something with the groups
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async search() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.groupService
      .searchGroups(this.searchTerm)
      .then((groups) => {
        this.groups = groups;
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
