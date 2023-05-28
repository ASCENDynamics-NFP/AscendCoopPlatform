import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {MenuComponent} from "./menu/menu.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, MenuComponent],
})
export class AppComponent {
  // public environmentInjector = inject(EnvironmentInjector);
  constructor() {
    // You can use your AuthService here
  }
}
