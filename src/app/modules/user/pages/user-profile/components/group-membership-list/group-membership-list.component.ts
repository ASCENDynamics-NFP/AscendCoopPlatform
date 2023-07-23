import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AppRelationship} from "../../../../../../models/relationship.model";
import {User} from "firebase/auth";

@Component({
  selector: "app-group-membership-list",
  templateUrl: "./group-membership-list.component.html",
  styleUrls: ["./group-membership-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupMembershipListComponent implements OnInit {
  @Input() user: User | null = null; // define your user here
  @Input() groupList: AppRelationship[] = []; // define your user here

  constructor(private router: Router) {}

  ngOnInit() {}

  get allGroups() {
    let allGroups = [];
    for (let group of this.groupList) {
      if (group.status !== "accepted") continue;
      if (group.senderId === this.user?.uid) {
        allGroups.push({
          id: group.receiverId,
          name: group.receiverName,
          image: group.receiverImage,
          tagline: group.receiverTagline,
        });
      } else {
        allGroups.push({
          id: group.senderId,
          name: group.senderName,
          image: group.senderImage,
          tagline: group.senderTagline,
        });
      }
    }
    return allGroups;
  }

  goToGroupPage(id: string) {
    this.router.navigate([`/group-profile/${id}`]);
  }

  goToGroupList() {
    this.router.navigate([`/group-list`]);
  }
}
