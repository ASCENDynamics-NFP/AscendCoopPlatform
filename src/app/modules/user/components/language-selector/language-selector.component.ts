import {CommonModule} from "@angular/common";
import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-language-selector",
  templateUrl: "./language-selector.component.html",
  styleUrls: ["./language-selector.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LanguageSelectorComponent implements OnInit {
  languageList = [
    {code: "en", name: "english", text: "English"},
    {code: "fr", name: "french", text: "Français"},
  ];
  @Output() languageChange = new EventEmitter<string>();
  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}

  onLanguageChange(event: any) {
    let lang = event?.target?.value || "en";
    this.translateService.use(lang);
  }
}
