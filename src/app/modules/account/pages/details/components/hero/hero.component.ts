import {CommonModule} from "@angular/common";
import {Component, Input} from "@angular/core";
import {IonicModule, ModalController} from "@ionic/angular";
import {Account} from "../../../../../../models/account.model";
import {FormsModule} from "@angular/forms";
import {ImageUploadModalComponent} from "../../../../../../shared/components/image-upload-modal/image-upload-modal.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ImageUploadModalComponent,
  ],
})
export class HeroComponent {
  @Input() account?: Partial<Account>;
  @Input() isProfileOwner: boolean = false;
  segment: string = "profile"; // Default selected segment
  constructor(private modalController: ModalController) {}

  async openImageUploadModal() {
    if (!this.account?.id || !this.isProfileOwner) return;
    let modal = await this.modalController.create({
      component: ImageUploadModalComponent,
      componentProps: {
        collectionName: "accounts",
        docId: this.account?.id,
        firestoreLocation: `accounts/${this.account?.id}/profile`,
        maxHeight: 300,
        maxWidth: 900,
        fieldName: "heroImage",
      },
    });

    await modal.present();
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({behavior: "smooth"});
  }
}
