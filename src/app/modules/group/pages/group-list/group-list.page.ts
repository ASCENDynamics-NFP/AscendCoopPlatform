/**
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
* 
* This file is part of Nonprofit Social Networking Platform.
* 
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
* 
* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
*/
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
