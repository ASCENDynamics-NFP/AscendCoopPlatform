/********************************************************************************
 * Nonprofit Social Networking Platform: Allowing Users and Organizations to Collaborate.
 * Copyright (C) 2023  ASCENDynamics NFP
 *
 * This file is part of Nonprofit Social Networking Platform.
 *
 * Nonprofit Social Networking Platform is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Nonprofit Social Networking Platform is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Nonprofit Social Networking Platform.  If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/
// src/app/modules/info/pages/theme-showcase/theme-showcase.page.ts

import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {
  ActionSheetController,
  AlertController,
  IonAccordion,
  IonAccordionGroup,
  IonAvatar,
  IonBackButton,
  IonBadge,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonChip,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonImg,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonPopover,
  IonProgressBar,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonRefresher,
  IonRefresherContent,
  IonReorder,
  IonReorderGroup,
  IonRippleEffect,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonText,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToggle,
  IonToolbar,
  LoadingController,
  ToastController,
} from "@ionic/angular/standalone";
import type {ItemReorderEventDetail} from "@ionic/angular";

interface ReorderItem {
  id: number;
  label: string;
}

@Component({
  standalone: true,
  selector: "app-theme-showcase",
  templateUrl: "./theme-showcase.page.html",
  styleUrls: ["./theme-showcase.page.scss"],
  imports: [
    FormsModule,
    IonAccordion,
    IonAccordionGroup,
    IonAvatar,
    IonBackButton,
    IonBadge,
    IonBreadcrumb,
    IonBreadcrumbs,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonChip,
    IonCol,
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonFab,
    IonFabButton,
    IonFabList,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonItemDivider,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonImg,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonNote,
    IonPopover,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
    IonRange,
    IonRefresher,
    IonRefresherContent,
    IonReorder,
    IonReorderGroup,
    IonRippleEffect,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSkeletonText,
    IonSpinner,
    IonTabBar,
    IonTabButton,
    IonText,
    IonTextarea,
    IonThumbnail,
    IonTitle,
    IonToggle,
    IonToolbar,
  ],
})
export class ThemeShowcasePage implements OnInit, OnDestroy {
  isDark = false;

  // Form demo values
  inputValue = "";
  textareaValue = "";
  toggleValue = true;
  checkboxValue = false;
  radioValue = "option1";
  rangeValue = 50;
  segmentValue = "all";
  selectValue = "option1";
  searchValue = "";

  // Datetime demo
  datetimeValue: string = new Date().toISOString();

  // Skeleton demo
  showSkeleton = true;

  // Tabs demo
  selectedTab = "home";

  // Infinite-scroll demo
  infiniteItems: number[] = Array.from({length: 6}, (_, i) => i + 1);

  // Reorder demo
  reorderItems: ReorderItem[] = [
    {id: 1, label: "First item"},
    {id: 2, label: "Second item"},
    {id: 3, label: "Third item"},
    {id: 4, label: "Fourth item"},
  ];

  private previousBodyClass = "";
  private previousHtmlClass = "";

  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.previousBodyClass = document.body.className;
    this.previousHtmlClass = document.documentElement.className;
    // Reflect whatever the current effective theme is: explicit `dark`
    // class, or OS preference when no explicit class is set.
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      this.isDark = true;
    } else if (root.classList.contains("light")) {
      this.isDark = false;
    } else {
      this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }

  ngOnDestroy() {
    document.body.className = this.previousBodyClass;
    document.documentElement.className = this.previousHtmlClass;
  }

  onThemeToggle(event: any) {
    this.isDark = event.detail.checked;
    // Ionic 8 puts platform mode classes (`md`/`ios`) on <html>, so the
    // dark/light theme classes must live on <html> too. The explicit
    // `.light` class lets the toggle override the OS dark preference.
    const root = document.documentElement;
    if (this.isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.add("dark"); // legacy selector compatibility
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }

  // ----- Overlay demos ---------------------------------------------------

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      subHeader: "Important message",
      message: "This is a themed Ionic alert.",
      buttons: ["Cancel", "OK"],
    });
    await alert.present();
  }

  async presentActionSheet() {
    const sheet = await this.actionSheetCtrl.create({
      header: "Choose an action",
      buttons: [
        {text: "Share", icon: "share-outline", handler: () => {}},
        {text: "Edit", icon: "create-outline", handler: () => {}},
        {
          text: "Delete",
          role: "destructive",
          icon: "trash-outline",
          handler: () => {},
        },
        {text: "Cancel", role: "cancel", icon: "close-outline"},
      ],
    });
    await sheet.present();
  }

  async presentToast(position: "top" | "middle" | "bottom" = "bottom") {
    const toast = await this.toastCtrl.create({
      message: "Saved successfully",
      duration: 2000,
      position,
      color: "success",
      icon: "checkmark-circle-outline",
    });
    await toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: "Loading…",
      duration: 1500,
      spinner: "crescent",
    });
    await loading.present();
  }

  // ----- Refresher / Infinite-scroll -------------------------------------

  onRefresh(event: CustomEvent) {
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  onInfinite(event: CustomEvent) {
    setTimeout(() => {
      const next = this.infiniteItems.length;
      this.infiniteItems = [
        ...this.infiniteItems,
        ...Array.from({length: 4}, (_, i) => next + i + 1),
      ];
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }, 800);
  }

  // ----- Reorder ---------------------------------------------------------

  onReorder(event: CustomEvent<ItemReorderEventDetail>) {
    this.reorderItems = event.detail.complete([...this.reorderItems]);
  }

  // ----- Skeleton --------------------------------------------------------

  toggleSkeleton() {
    this.showSkeleton = !this.showSkeleton;
  }
}
