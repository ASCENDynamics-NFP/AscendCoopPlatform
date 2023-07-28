import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {Router} from "@angular/router";
import {AppGroup} from "../../../../../../models/group.model";
import {AppRelationship} from "../../../../../../models/relationship.model";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupListComponent implements OnInit {
  @Input() group: Partial<AppGroup> | null = null; // define your group here
  @Input() groupList: Partial<AppRelationship>[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  get allGroups() {
    let allGroups = [];
    for (let group of this.groupList) {
      if (group.status !== "accepted") continue;
      if (group.senderId === this.group?.id) {
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

  goToUserProfile(id: string | undefined) {
    this.router.navigate([`/group-profile/${id}`]);
  }

  goToGroupList() {
    if (this.group?.id) {
      this.router.navigate([`/group-profile/${this.group.id}/groups`]);
    }
  }
}
