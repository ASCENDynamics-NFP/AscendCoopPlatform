import {Component} from "@angular/core";
import {MetaService} from "../../../../core/services/meta.service";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.page.html",
  styleUrls: ["./privacy-policy.page.scss"],
})
export class PrivacyPolicyPage {
  currentYear = new Date().getFullYear();

  constructor(private metaService: MetaService) {}

  ionViewWillEnter() {
    this.metaService.updateMetaTags(
      "Privacy Policy | ASCENDynamics NFP Collaborative Platform",
      "Learn about how ASCENDynamics NFP protects your privacy and personal information on our collaborative platform. Our commitment to data protection and user privacy.",
      "privacy policy, data protection, user privacy, ASCENDynamics NFP, data security",
      {
        title: "Privacy Policy | ASCENDynamics NFP",
        description:
          "ASCENDynamics NFP's privacy policy outlines how we protect and handle your personal information on our platform.",
        url: "https://ascendynamics.org/info/privacy-policy",
      },
      {
        card: "summary",
        title: "Privacy Policy | ASCENDynamics NFP",
        description:
          "Learn about our commitment to protecting your privacy and personal data.",
      },
    );
  }
}
