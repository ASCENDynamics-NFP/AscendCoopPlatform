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
import {Component, Input} from "@angular/core";
import {Listing} from "@shared/models/listing.model";
import {serverTimestamp} from "firebase/firestore";
import * as ListingsActions from "../../../../../../state/actions/listings.actions";
import {AppState} from "../../../../../../state/app.state";
import {Store} from "@ngrx/store";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent {
  @Input() listing!: Listing;
  @Input() isOwner: boolean = false;
  @Input() showButtons: boolean = true;

  constructor(private store: Store<AppState>) {}

  getCities(): string {
    if (this.listing.remote) {
      return "Remote";
    }

    const addresses = this.listing.contactInformation?.addresses;
    if (!addresses || addresses.length === 0) {
      return "No locations available";
    }

    return addresses
      .map((address) => `${address?.city}, ${address?.country}`)
      .join(", ");
  }

  togglePublishStatus() {
    if (this.listing) {
      const newStatus = this.listing.status === "active" ? "draft" : "active";
      const updatedListing = {
        ...this.listing,
        status: newStatus,
        lastModifiedAt: serverTimestamp(),
      } as Listing;
      this.store.dispatch(
        ListingsActions.updateListing({listing: updatedListing}),
      );
    }
  }

  // async deleteListing() {
  //   const alert = await this.alertController.create({
  //     header: "Confirm Deletion",
  //     message: "Are you sure you want to delete this listing?",
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         role: "cancel",
  //       },
  //       {
  //         text: "Delete",
  //         role: "destructive",
  //         handler: () => {
  //           if (this.listingId) {
  //             this.store.dispatch(
  //               ListingsActions.deleteListing({id: this.listingId}),
  //             );
  //           }
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }
}
