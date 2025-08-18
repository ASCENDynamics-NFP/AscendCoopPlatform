import {Component} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-terms-of-use",
  templateUrl: "./terms-of-use.page.html",
  styleUrls: ["./terms-of-use.page.scss"],
})
export class TermsOfUsePage {
  currentYear = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Terms of Use | ASCENDynamics NFP Collaborative Platform",
      "Review the terms of use for ASCENDynamics NFP's collaborative platform. Understand your rights and responsibilities when using our nonprofit networking platform.",
      "terms of use, terms of service, user agreement, ASCENDynamics NFP, platform rules",
      {
        title: "Terms of Use | ASCENDynamics NFP",
        description:
          "ASCENDynamics NFP's terms of use governing the use of our collaborative platform and services.",
        url: "https://app.ASCENDynamics.org/info/terms-of-use",
      },
      {
        card: "summary",
        title: "Terms of Use | ASCENDynamics NFP",
        description:
          "Learn about the terms and conditions for using our platform.",
      },
    );
  }
}
