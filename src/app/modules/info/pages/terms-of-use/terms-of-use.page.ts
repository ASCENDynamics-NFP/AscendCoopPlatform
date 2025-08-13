import {Component} from "@angular/core";

@Component({
  selector: "app-terms-of-use",
  templateUrl: "./terms-of-use.page.html",
  styleUrls: ["./terms-of-use.page.scss"],
})
export class TermsOfUsePage {
  currentYear = new Date().getFullYear();

  constructor() {}
}
