/***********************************************************************************************
* Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
* Copyright (C) 2023  ASCENDynamics NFP
*
* This file is part of Nonprofit Social Networking Platform.
*
* Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.

* Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public License
* along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
***********************************************************************************************/
// src/app/modules/admin/pages/branding/branding.page.ts

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
  ViewWillEnter,
} from "@ionic/angular/standalone";
import {
  BRANDING_DEFAULTS,
  BrandingConfig,
  BrandingService,
} from "../../../../core/services/branding.service";
import {Subscription} from "rxjs";

@Component({
  standalone: true,
  selector: "app-admin-branding",
  templateUrl: "./branding.page.html",
  styleUrls: ["./branding.page.scss"],
  imports: [
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonTitle,
    IonToggle,
    IonToolbar,
  ],
})
export class AdminBrandingPage implements OnInit, OnDestroy, ViewWillEnter {
  private readonly branding = inject(BrandingService);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private configSub?: Subscription;

  /** Working copy of the branding config, editable by the form. */
  draft: BrandingConfig = {...BRANDING_DEFAULTS};

  /** Snapshot of the active config to show alongside the editor. */
  active: BrandingConfig = {...BRANDING_DEFAULTS};

  hasLocalOverride = false;
  activeSegment = "editor";

  ionViewWillEnter(): void {
    this.activeSegment = "editor";
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.configSub = this.branding.config$.subscribe((cfg) => {
      this.active = cfg;
    });
    this.draft = {...this.branding.current};
    this.hasLocalOverride = this.branding.getLocalOverride() !== null;
  }

  ngOnDestroy(): void {
    this.configSub?.unsubscribe();
  }

  /** Switch between the Editor and Preview pages via segment buttons. */
  onSegmentChange(value: string | number | undefined): void {
    if (value === "preview") {
      this.activeSegment = "preview";
      void this.router.navigateByUrl("/info/theme-showcase");
    }
  }

  /** Apply the current draft as a per-device localStorage override. */
  async applyLocalOverride(): Promise<void> {
    this.branding.setLocalOverride(this.draft);
    this.hasLocalOverride = true;
    await this.showToast("Local override applied for this device.");
  }

  /**
   * Immediately push the draft colors to the token layer so the user
   * sees live feedback without having to click Apply.
   */
  previewDraft(): void {
    this.branding.previewTokens({
      primaryColor: this.draft.primaryColor,
      secondaryColor: this.draft.secondaryColor,
    });
  }

  /** Typed handler for native <input type="color"> input events. */
  onColorInput(field: "primaryColor" | "secondaryColor", event: Event): void {
    this.draft[field] = (event.target as HTMLInputElement).value;
    this.previewDraft();
  }

  async clearLocalOverride(): Promise<void> {
    this.branding.clearLocalOverride();
    this.hasLocalOverride = false;
    this.draft = {...this.branding.current};
    await this.showToast("Local override cleared.");
  }

  resetDraftToActive(): void {
    this.draft = {...this.active};
  }

  resetDraftToDefaults(): void {
    this.draft = {...BRANDING_DEFAULTS};
  }

  /** Generates the JSON payload an admin would upload to Firebase. */
  copyRemoteConfigTemplate(): void {
    const payload = {
      parameters: {
        branding_enabled: {
          defaultValue: {value: String(this.draft.enabled)},
          valueType: "BOOLEAN",
        },
        branding_app_name: {
          defaultValue: {value: this.draft.appName},
          valueType: "STRING",
        },
        branding_tagline: {
          defaultValue: {value: this.draft.tagline},
          valueType: "STRING",
        },
        branding_logo_url: {
          defaultValue: {value: this.draft.logoUrl},
          valueType: "STRING",
        },
        branding_primary_color: {
          defaultValue: {value: this.draft.primaryColor},
          valueType: "STRING",
        },
        branding_secondary_color: {
          defaultValue: {value: this.draft.secondaryColor},
          valueType: "STRING",
        },
        branding_show_about: {
          defaultValue: {value: String(this.draft.showAbout)},
          valueType: "BOOLEAN",
        },
        branding_show_team: {
          defaultValue: {value: String(this.draft.showTeam)},
          valueType: "BOOLEAN",
        },
        branding_show_donate: {
          defaultValue: {value: String(this.draft.showDonate)},
          valueType: "BOOLEAN",
        },
        branding_show_event_calendar: {
          defaultValue: {value: String(this.draft.showEventCalendar)},
          valueType: "BOOLEAN",
        },
        branding_show_think_tank: {
          defaultValue: {value: String(this.draft.showThinkTank)},
          valueType: "BOOLEAN",
        },
      },
    };
    const json = JSON.stringify(payload, null, 2);
    void navigator.clipboard
      .writeText(json)
      .then(() => this.showToast("Remote Config JSON copied to clipboard."))
      .catch(() =>
        this.showToast("Clipboard unavailable — see browser console."),
      );
    // eslint-disable-next-line no-console
    console.log("[Branding] Remote Config payload:\n" + json);
  }

  private async showToast(message: string): Promise<void> {
    const t = await this.toastCtrl.create({
      message,
      duration: 2200,
      position: "bottom",
    });
    await t.present();
  }
}
