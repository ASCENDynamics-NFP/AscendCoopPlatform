/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
import {Component, Input, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {StoreService} from "../../../../../../core/services/store.service";
import {
  Account,
  MutualAidCommunityEngagement,
} from "../../../../../../models/account.model";
import {
  servicesOptions,
  communityAffiliationsOptions,
  groupsOrForumsOptions,
} from "../../../../../../core/data/options";

@Component({
  selector: "app-mutual-aid-community-engagement",
  templateUrl: "./mutual-aid-community-engagement.component.html",
  styleUrls: ["./mutual-aid-community-engagement.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})
export class MutualAidCommunityEngagementComponent implements OnInit {
  @Input() account?: Partial<Account>;
  mutualAidForm: FormGroup;
  public servicesOptions: string[] = servicesOptions;
  public communityAffiliationsOptions: string[] = communityAffiliationsOptions;
  public groupsOrForumsOptions: string[] = groupsOrForumsOptions;

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
  ) {
    this.mutualAidForm = this.fb.group({
      servicesOffered: [[], Validators.required],
      servicesNeeded: [[]],
      communityAffiliations: [[], Validators.required],
      willingnessToProvideMentorship: [false],
      interestInReceivingMentorship: [false],
      groupsOrForumsParticipation: [[]],
    });
  }

  ngOnInit() {
    if (this.account?.mutualAidCommunityEngagement) {
      this.loadFormData();
    }
  }

  loadFormData() {
    if (this.account?.mutualAidCommunityEngagement) {
      this.mutualAidForm.patchValue({
        servicesOffered:
          this.account.mutualAidCommunityEngagement.servicesOffered || [],
        servicesNeeded:
          this.account.mutualAidCommunityEngagement.servicesNeeded || [],
        communityAffiliations:
          this.account.mutualAidCommunityEngagement.communityAffiliations || [],
        willingnessToProvideMentorship:
          this.account.mutualAidCommunityEngagement
            .willingnessToProvideMentorship || false,
        interestInReceivingMentorship:
          this.account.mutualAidCommunityEngagement
            .interestInReceivingMentorship || false,
        groupsOrForumsParticipation:
          this.account.mutualAidCommunityEngagement
            .groupsOrForumsParticipation || [],
      });
    }
  }

  onSubmit() {
    if (this.mutualAidForm.valid) {
      const updatedMutualAidCommunityEngagement: MutualAidCommunityEngagement =
        this.mutualAidForm.value;
      const updatedAccount: Partial<Account> = {
        ...this.account,
        mutualAidCommunityEngagement: updatedMutualAidCommunityEngagement,
      };

      this.storeService.updateDoc("accounts", updatedAccount);
      // .subscribe(
      //   () => {
      //     console.log("Document successfully updated!");
      //   },
      //   (error) => {
      //     console.error("Error updating document: ", error);
      //   }
      // );
    }
  }
}
