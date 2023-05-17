import {Component, EnvironmentInjector, inject} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
  constructor(private authService: AuthService) {
    // You can use your AuthService here
  }
}
