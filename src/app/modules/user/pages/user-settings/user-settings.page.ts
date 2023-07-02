import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {MenuService} from "../../../../core/services/menu.service";
import {TranslateModule} from "@ngx-translate/core";
import {LanguageSelectorComponent} from "../../components/language-selector/language-selector.component";
import {FriendRequestComponent} from "../../components/friend-request/friend-request.component";
import {AuthService} from "../../../../core/services/auth.service";

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
    FriendRequestComponent,
  ],
})
export class UserSettingsPage implements OnInit {
  user = this.authService.getCurrentUser();
  constructor(
    private menuService: MenuService,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.menuService.onEnter();
  }

  ionViewWillLeave() {}
}
