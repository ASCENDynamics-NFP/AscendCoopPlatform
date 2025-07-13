import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AboutUsPage} from "./pages/about-us/about-us.page";
import {ServicesPage} from "./pages/services/services.page";
import {StartupsPage} from "./pages/startups/startups.page";
import {NonprofitsPage} from "./pages/nonprofits/nonprofits.page";
import {ContactUsPage} from "./pages/contact-us/contact-us.page";
import {EventCalendarPage} from "./pages/event-calendar/event-calendar.page";
import {TeamPage} from "./pages/team/team.page";
import {ThinkTankPage} from "./pages/think-tank/think-tank.page";

const routes: Routes = [
  {path: "about-us", component: AboutUsPage},
  {path: "services", component: ServicesPage},
  {path: "startups", component: StartupsPage},
  {path: "nonprofits", component: NonprofitsPage},
  {path: "contact-us", component: ContactUsPage},
  {path: "event-calendar", component: EventCalendarPage},
  {path: "team", component: TeamPage},
  {path: "think-tank", component: ThinkTankPage},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoRoutingModule {}
