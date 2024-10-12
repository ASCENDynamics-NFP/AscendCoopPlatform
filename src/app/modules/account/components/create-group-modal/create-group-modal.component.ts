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
// create-group-modal.component.ts
import {Component} from "@angular/core";
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Timestamp} from "firebase/firestore";
import {Account} from "../../../../models/account.model";
import {Store} from "@ngrx/store";
import * as AccountActions from "../../../../state/actions/account.actions";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {firstValueFrom} from "rxjs";

@Component({
  selector: "app-create-group-modal",
  templateUrl: "./create-group-modal.component.html",
  styleUrls: ["./create-group-modal.component.scss"],
})
export class CreateGroupModalComponent {
  public groupForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.groupForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      tagline: ["", Validators.required],
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, "cancel");
  }

  confirm() {
    return this.modalCtrl.dismiss(null, "confirm");
  }

  async onSubmit() {
    const groupData = this.groupForm.value;
    const authUser = await firstValueFrom(this.store.select(selectAuthUser));

    if (authUser) {
      const newGroup: Partial<Account> = {
        ...groupData,
        name: groupData.name || undefined,
        description: groupData.description || undefined,
        tagline: groupData.tagline || undefined,
        type: "group", // Specify that this account is a group
        // Include other necessary fields like address, language, etc.
        // Default images or placeholder values
        iconImage: "assets/icon/favicon.png",
        heroImage: "assets/image/orghero.png",
        // Initialize other group-specific properties if needed
        groupDetails: {
          admins: [authUser.uid], // Set the user ID of the creator as an admin
          dateFounded: Timestamp.now(), // Set the founding date
          supportedLanguages: ["en"], // Example value
        },
      };

      // Dispatch action to create group
      this.store.dispatch(
        AccountActions.createAccount({account: newGroup as Account}),
      );

      // Close the modal after dispatching the action
      this.modalCtrl.dismiss({accountId: newGroup.id}, "confirm");
    } else {
      // Handle error if user is not authenticated
      this.modalCtrl.dismiss(null, "cancel");
    }
  }
}
