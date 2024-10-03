import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {DetailsPage} from "./details.page";
import {HeroComponent} from "./components/hero/hero.component";
import {ProfessionalInfoComponent} from "./components/professional-info/professional-info.component";
import {RelatedAccountsComponent} from "./components/related-accounts/related-accounts.component";
import {VolunteerPreferenceInfoComponent} from "./components/volunteer-preference-info/volunteer-preference-info.component";
import {SharedModule} from "../../../../shared/shared.module";
import {TranslateModule} from "@ngx-translate/core";
import {ContactInformationComponent} from "./components/contact-information/contact-information.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {MutualAidCommunityInfoComponent} from "./components/mutual-aid-community-info/mutual-aid-community-info.component";

@NgModule({
  declarations: [
    ContactInformationComponent,
    DetailsPage,
    HeroComponent,
    ProfessionalInfoComponent,
    RelatedAccountsComponent,
    VolunteerPreferenceInfoComponent,
    ProfileComponent,
    MutualAidCommunityInfoComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path: "", component: DetailsPage}]),
    TranslateModule,
  ],
})
export class DetailsPageModule {}
