import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IonicModule} from "@ionic/angular";
import { GroupsService } from '../../../../../../core/services/groups.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-membership-list',
  templateUrl: './group-membership-list.component.html',
  styleUrls: ['./group-membership-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class GroupMembershipListComponent  implements OnInit {
  @Input() groupIdList: [] = []; // define your user here
  groupList: any[] = [];

  constructor(
    private router: Router,
    private groupsService: GroupsService
  ) { }

  ngOnInit() {
    // this.groupsService
    //   .getGroupsWithCondition("name", "!=", null, "name", 5)
    //   .then((users) => {
    //     console.log("userList", users);
    //     this.friendList = users;
    //   });
  }

  goToGroupPage(id: string) {
    this.router.navigate([`/group-profile/${id}`]);
  }

  goToGroupList() {
      this.router.navigate([`/group-list`]);
  }
}
