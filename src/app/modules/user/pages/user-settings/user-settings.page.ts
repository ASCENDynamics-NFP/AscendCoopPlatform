import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {TranslateModule} from "@ngx-translate/core";
import {LanguageSelectorComponent} from "../../components/language-selector/language-selector.component";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.page.html",
  styleUrls: ["./user-settings.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    LanguageSelectorComponent,
  ],
})
export class UserSettingsPage implements OnInit {
  constructor(private menuService: MenuService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}
}
