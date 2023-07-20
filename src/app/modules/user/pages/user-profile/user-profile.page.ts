import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {UsersService} from "../../../../core/services/users.service";
import {ActivatedRoute} from "@angular/router";
import {MenuService} from "../../../../core/services/menu.service";
import {FriendListComponent} from "./components/friend-list/friend-list.component";
import {GroupMembershipListComponent} from "./components/group-membership-list/group-membership-list.component";
import {HeroComponent} from "./components/hero/hero.component";
import {DetailsComponent} from "./components/details/details.component";
import {RelationshipsCollectionService} from "../../../../core/services/relationships-collection.service";
import {AppRelationship} from "../../../../models/relationship.model";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FriendListComponent,
    GroupMembershipListComponent,
    HeroComponent,
    DetailsComponent,
  ],
})
export class UserProfilePage implements OnInit {
  user: any;
  groupIdList: [] = []; // define your user here
  friendList: AppRelationship[] = [];
  groupList: AppRelationship[] = [];
  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private menuService: MenuService,
    private relationshipsCollectionService: RelationshipsCollectionService,
  ) {}

  ngOnInit() {
    this.getUser();

    this.relationshipsCollectionService
      .getRelationships(this.route.snapshot.paramMap.get("uid"))
      .then((relationships) => {
        console.log("relationships", relationships);
        for (let relationship of relationships) {
          if (
            relationship.type === "friend" &&
            relationship.status === "accepted"
          ) {
            this.friendList.push(relationship);
          } else if (relationship.type === "group") {
            this.groupList.push(relationship);
          }
        }
      });
  }

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}

  async getUser() {
    this.usersService
      .getUser(this.route.snapshot.paramMap.get("uid"))
      .then((data) => {
        this.user = data;
        this.groupIdList = []; //data?.['groupIdList'];
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
