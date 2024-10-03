import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {EditPage} from "./edit.page";
import {EditMenuComponent} from "./components/edit-menu/edit-menu.component";
import {BasicInfoComponent} from "./components/basic-info/basic-info.component";
import {ContactInfoComponent} from "./components/contact-info/contact-info.component";
import {ProfessionalInfoComponent} from "./components/professional-info/professional-info.component";
import {VolunteerPreferenceInfoComponent} from "./components/volunteer-preference-info/volunteer-preference-info.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {LaborRightsInfoComponent} from "./components/labor-rights-info/labor-rights-info.component";
import {MutualAidCommunityEngagementComponent} from "./components/mutual-aid-community-engagement/mutual-aid-community-engagement.component";

@NgModule({
  declarations: [
    EditPage,
    EditMenuComponent,
    BasicInfoComponent,
    ContactInfoComponent,
    ProfessionalInfoComponent,
    VolunteerPreferenceInfoComponent,
    LaborRightsInfoComponent,
    MutualAidCommunityEngagementComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([{path: "", component: EditPage}]),
    TranslateModule,
  ],
})
export class EditPageModule {}
