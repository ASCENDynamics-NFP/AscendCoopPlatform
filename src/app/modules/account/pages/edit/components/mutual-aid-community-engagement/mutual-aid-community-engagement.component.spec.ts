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
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {MutualAidCommunityEngagementComponent} from "./mutual-aid-community-engagement.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {IonicModule, IonSelect, IonSelectOption} from "@ionic/angular";
import {provideMockStore} from "@ngrx/store/testing";
import {Account} from "../../../../../../models/account.model";
import {CommonModule} from "@angular/common";

describe("MutualAidCommunityEngagementComponent", () => {
  let component: MutualAidCommunityEngagementComponent;
  let fixture: ComponentFixture<MutualAidCommunityEngagementComponent>;
  let mockAccount: Account;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MutualAidCommunityEngagementComponent,
        IonSelect,
        IonSelectOption,
      ],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule.forRoot(),
      ],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualAidCommunityEngagementComponent);
    component = fixture.componentInstance;

    // Create a mock account object
    mockAccount = {
      id: "12345",
      name: "Test User",
      mutualAidCommunityEngagement: {
        servicesOffered: ["Service1"],
        servicesNeeded: ["Service2"],
        communityAffiliations: ["Affiliation1"],
        willingnessToProvideMentorship: true,
        interestInReceivingMentorship: false,
        groupsOrForumsParticipation: ["Forum1"],
      },
    } as Account;

    component.account = mockAccount;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form controls correctly", () => {
    expect(component.mutualAidForm).toBeTruthy();
    expect(component.mutualAidForm.get("servicesOffered")).toBeTruthy();
    expect(component.mutualAidForm.get("servicesNeeded")).toBeTruthy();
    expect(component.mutualAidForm.get("communityAffiliations")).toBeTruthy();
    expect(
      component.mutualAidForm.get("willingnessToProvideMentorship"),
    ).toBeTruthy();
    expect(
      component.mutualAidForm.get("interestInReceivingMentorship"),
    ).toBeTruthy();
    expect(
      component.mutualAidForm.get("groupsOrForumsParticipation"),
    ).toBeTruthy();
  });

  it("should load form data when account has mutualAidCommunityEngagement", () => {
    component.loadFormData();
    fixture.detectChanges();

    const formValue = component.mutualAidForm.value;
    expect(formValue.servicesOffered).toEqual(
      mockAccount.mutualAidCommunityEngagement?.servicesOffered,
    );
    expect(formValue.servicesNeeded).toEqual(
      mockAccount.mutualAidCommunityEngagement?.servicesNeeded,
    );
    expect(formValue.communityAffiliations).toEqual(
      mockAccount.mutualAidCommunityEngagement?.communityAffiliations,
    );
    expect(formValue.willingnessToProvideMentorship).toBe(
      mockAccount.mutualAidCommunityEngagement?.willingnessToProvideMentorship,
    );
    expect(formValue.interestInReceivingMentorship).toBe(
      mockAccount.mutualAidCommunityEngagement?.interestInReceivingMentorship,
    );
    expect(formValue.groupsOrForumsParticipation).toEqual(
      mockAccount.mutualAidCommunityEngagement?.groupsOrForumsParticipation,
    );
  });

  it("should call loadFormData on ngOnInit if account has mutualAidCommunityEngagement", () => {
    spyOn(component, "loadFormData");
    component.ngOnInit();
    expect(component.loadFormData).toHaveBeenCalled();
  });

  it("should not call loadFormData on ngOnInit if account does not have mutualAidCommunityEngagement", () => {
    component.account = {id: "67890", name: "New User"} as Account;
    spyOn(component, "loadFormData");
    component.ngOnInit();
    expect(component.loadFormData).not.toHaveBeenCalled();
  });

  it("should mark form as invalid if required fields are empty", () => {
    component.mutualAidForm.patchValue({
      servicesOffered: [],
      communityAffiliations: [],
    });
    expect(component.mutualAidForm.invalid).toBeTruthy();
  });

  it("should mark form as valid if required fields are filled", () => {
    component.mutualAidForm.patchValue({
      servicesOffered: ["Service1"],
      communityAffiliations: ["Affiliation1"],
    });
    expect(component.mutualAidForm.valid).toBeTruthy();
  });

  it("should dispatch updateAccount action on valid form submission", () => {
    spyOn(component["store"], "dispatch");
    component.mutualAidForm.patchValue({
      servicesOffered: ["Service1"],
      communityAffiliations: ["Affiliation1"],
    });
    component.onSubmit();
    expect(component["store"].dispatch).toHaveBeenCalled();
  });

  it("should not dispatch updateAccount action on invalid form submission", () => {
    spyOn(component["store"], "dispatch");
    component.mutualAidForm.patchValue({
      servicesOffered: [],
      communityAffiliations: [],
    });
    component.onSubmit();
    expect(component["store"].dispatch).not.toHaveBeenCalled();
  });
});
