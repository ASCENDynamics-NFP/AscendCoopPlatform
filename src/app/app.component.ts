import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MenuComponent} from "./shared/components/menu/menu.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent],
})
export class AppComponent {
  // public environmentInjector = inject(EnvironmentInjector);
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang("en");
    this.translate.addLangs(["en", "fr"]);
    // You can use your AuthService here
  }
}
