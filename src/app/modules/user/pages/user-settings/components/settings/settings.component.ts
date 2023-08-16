import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {StoreService} from "../../../../../../core/services/store.service";
import {AppUser} from "../../../../../../models/user.model";
import {User} from "firebase/auth";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, TranslateModule],
})
export class SettingsComponent implements OnChanges {
  @Input() authUser?: User | null;
  @Input() user?: Partial<AppUser> | null;
  @Output() languageChange = new EventEmitter<string>();

  settingsForm = this.fb.group({
    privacySetting: ["public", Validators.required],
    language: ["en"],
  });

  languageList = [
    {code: "en", name: "english", text: "English"},
    {code: "fr", name: "french", text: "Français"},
  ];

  constructor(
    private fb: FormBuilder,
    private storeService: StoreService,
    private translateService: TranslateService,
  ) {}

  ngOnChanges() {
    this.loadFormData();
  }

  onLanguageChange(event: any) {
    let lang = this.settingsForm.value.language ?? "en";
    this.translateService.use(lang);
    this.languageChange.emit(lang);
  }

  updateSetting() {
    if (this.authUser?.uid) {
      this.storeService.updateDoc("users", {
        id: this.authUser?.uid,
        privacySetting: this.settingsForm.value.privacySetting, // this.settingsForm.get("privacySetting")?.value,
        language: this.settingsForm.value.language, //this.settingsForm.get("language")?.value,
      });
    }
  }

  loadFormData() {
    if (!this.user) return;
    // Update the form with the user data
    this.settingsForm.patchValue({
      privacySetting: this.user.privacySetting,
      language: this.user.language,
    });
  }
}
