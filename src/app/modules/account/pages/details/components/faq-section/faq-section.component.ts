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
import {Router} from "@angular/router";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: "app-faq-section",
  templateUrl: "./faq-section.component.html",
  styleUrls: ["./faq-section.component.scss"],
})
export class FaqSectionComponent {
  @Input() faqs: FAQ[] = [];
  @Input() canEdit: boolean = false;
  @Input() accountId: string = "";

  constructor(private router: Router) {}

  onManageFAQs() {
    if (this.accountId) {
      this.router.navigate([`/account/${this.accountId}/edit`], {
        queryParams: {section: "faq"},
      });
    }
  }

  trackByFAQ(index: number, faq: FAQ): string {
    return faq.id;
  }
}
