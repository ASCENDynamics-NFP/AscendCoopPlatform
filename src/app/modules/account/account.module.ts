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
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {SettingsComponent} from "./pages/settings/components/settings/settings.component";
import {SharedModule} from "../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {EffectsModule} from "@ngrx/effects";
import {StoreModule} from "@ngrx/store";
import {AccountEffects} from "../../state/effects/account.effects";
import {ProjectsEffects} from "../../state/effects/projects.effects";
import {accountReducer} from "../../state/reducers/account.reducer";
import {ContactInformationComponent} from "./pages/details/components/contact-information/contact-information.component";
import {HeroComponent} from "./pages/details/components/hero/hero.component";
import {MutualAidCommunityInfoComponent} from "./pages/details/components/mutual-aid-community-info/mutual-aid-community-info.component";
import {ProfessionalInfoComponent} from "./pages/details/components/professional-info/professional-info.component";
import {LaborRightsInfoComponent} from "./pages/details/components/labor-rights-info/labor-rights-info.component";
import {ProfileComponent} from "./pages/details/components/profile/profile.component";
import {RelatedAccountsComponent} from "./pages/details/components/related-accounts/related-accounts.component";
import {VolunteerPreferenceInfoComponent} from "./pages/details/components/volunteer-preference-info/volunteer-preference-info.component";
import {DetailsPage} from "./pages/details/details.page";
import {ContactInfoFormComponent} from "./pages/edit/components/contact-info-form/contact-info-form.component";
import {EditPage} from "./pages/edit/edit.page";
import {BasicInfoFormComponent} from "./pages/edit/components/basic-info-form/basic-info-form.component";
import {EditMenuComponent} from "./pages/edit/components/edit-menu/edit-menu.component";
import {MutualAidCommunityEngagementFormComponent} from "./pages/edit/components/mutual-aid-community-engagement-form/mutual-aid-community-engagement-form.component";
import {LaborRightsInfoFormComponent} from "./pages/edit/components/labor-rights-info-form/labor-rights-info-form.component";
import {ProfessionalInfoFormComponent} from "./pages/edit/components/professional-info-form/professional-info-form.component";
import {VolunteerPreferenceInfoFormComponent} from "./pages/edit/components/volunteer-preference-info-form/volunteer-preference-info-form.component";
import {AccountRoutingModule} from "./account-routing.module";
import {RegistrationPage} from "./pages/registration/registration.page";
import {UnifiedRegistrationComponent} from "./pages/registration/components/unified-registration/unified-registration.component";
import {DirectoryPage} from "./pages/directory/directory.page";
import {ListPage} from "./relatedAccount/pages/list/list.page";
import {RelatedListingsComponent} from "./pages/details/components/related-listings/related-listings.component";
import {ListingsListPage} from "./relatedListings/pages/listings-list/listings-list.page";
import {RoleManagementPage} from "./pages/role-management/role-management.page";
import {RoleHierarchyPage} from "./pages/role-hierarchy/role-hierarchy.page";
import {ProjectsPage} from "./pages/projects/projects.page";
import {SafeUrlPipe} from "../../shared/pipes/safe-url.pipe";
import {CategorySelectorComponent} from "../../shared/components/project-category/category-selector.component";
import {GroupCalendarComponent} from "./pages/details/components/group-calendar/group-calendar.component";
import {StandardRoleSelectorComponent} from "./components/standard-role-selector/standard-role-selector.component";
import {FaqSectionComponent} from "./pages/details/components/faq-section/faq-section.component";
import {FaqFormComponent} from "./pages/edit/components/faq-form/faq-form.component";
import {AdminDashboardPage} from "./pages/admin-dashboard/admin-dashboard.page";
import {AdminGroupProfileFormComponent} from "./pages/admin-dashboard/components/admin-group-profile-form/admin-group-profile-form.component";
import {InviteMemberModalComponent} from "./components/invite-member-modal/invite-member-modal.component";
import {SmartCategorySuggestionsComponent} from "./pages/projects/components/smart-category-suggestions/smart-category-suggestions.component";
import {ProjectFiltersComponent} from "./pages/projects/components/project-filters/project-filters.component";
import {BulkActionsComponent} from "./pages/projects/components/bulk-actions/bulk-actions.component";
import {ProjectCreationComponent} from "./pages/projects/components/project-creation/project-creation.component";
import {TemplatePreviewModalComponent} from "./pages/projects/components/template-preview-modal/template-preview-modal.component";

@NgModule({
  declarations: [
    SettingsComponent,
    EditPage,
    EditMenuComponent,
    BasicInfoFormComponent,
    ContactInfoFormComponent,
    LaborRightsInfoFormComponent,
    MutualAidCommunityEngagementFormComponent,
    ContactInformationComponent,
    ProfessionalInfoFormComponent,
    VolunteerPreferenceInfoFormComponent,
    DetailsPage,
    HeroComponent,
    ProfessionalInfoComponent,
    LaborRightsInfoComponent,
    RelatedAccountsComponent,
    VolunteerPreferenceInfoComponent,
    ProfileComponent,
    MutualAidCommunityInfoComponent,
    RegistrationPage,
    UnifiedRegistrationComponent,
    DirectoryPage,
    ListingsListPage,
    ListPage,
    RelatedListingsComponent,
    RoleManagementPage,
    RoleHierarchyPage,
    ProjectsPage,
    AdminDashboardPage,
    AdminGroupProfileFormComponent,
    GroupCalendarComponent,
    StandardRoleSelectorComponent,
    FaqSectionComponent,
    FaqFormComponent,
    InviteMemberModalComponent,
    SmartCategorySuggestionsComponent,
    ProjectFiltersComponent,
    BulkActionsComponent,
    ProjectCreationComponent,
    TemplatePreviewModalComponent,
    SafeUrlPipe,
    CategorySelectorComponent,
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    StoreModule.forFeature("accounts", accountReducer),
    EffectsModule.forFeature([AccountEffects, ProjectsEffects]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AccountModule {}
