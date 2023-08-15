import {Component, EventEmitter, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
import {StoreService} from "../../../../../../core/services/store.service";
import {AppUser} from "../../../../../../models/user.model";
import {ActivatedRoute, RouterModule} from "@angular/router";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
})
export class SettingsComponent {
  @Output() languageChange = new EventEmitter<string>();
  private user?: Partial<AppUser> | null;
  private userId?: string | null;
  private userSubscription?: Subscription;

  settingsForm: FormGroup = new FormGroup({
    privacySetting: new FormControl("Public"),
    language: new FormControl("en"),
  });

  languageList = [
    {code: "en", name: "english", text: "English"},
    {code: "fr", name: "french", text: "Français"},
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private translateService: TranslateService,
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get("userId");
  }

  ionViewWillEnter() {
    this.userSubscription = this.storeService.users$.subscribe((users) => {
      this.user = users.find((u) => u.id === this.userId);
      if (this.user) {
        this.settingsForm.setValue({
          privacySetting: this.user.privacySetting,
          language: this.user.language,
        });
      }
    });
  }

  ionViewWillLeave() {
    this.userSubscription?.unsubscribe();
  }

  onLanguageChange(event: any) {
    let lang = this.settingsForm.get("language")?.value;
    this.translateService.use(lang);
    this.languageChange.emit(lang);
  }

  updateSetting() {
    if (this.userId) {
      this.storeService.updateDoc("users", {
        id: this.userId,
        privacySetting: this.settingsForm.get("privacySetting")?.value,
        language: this.settingsForm.get("language")?.value,
      });
    }
  }
}
