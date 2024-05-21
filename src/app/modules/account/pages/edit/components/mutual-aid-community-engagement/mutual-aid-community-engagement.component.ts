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
  servicesOptions: string[] = [
    "Food Distribution",
    "Housing Assistance",
    "Healthcare",
    "Transportation",
    "Education",
  ];
  communityAffiliationsOptions: string[] = [
    "Local Non-Profit",
    "Community Center",
    "Neighborhood Association",
    "Religious Organization",
    "Online Community",
  ];
  groupsOrForumsOptions: string[] = [
    "Facebook Groups",
    "Reddit",
    "Local Forums",
    "Community Boards",
    "Slack Channels",
  ];

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
