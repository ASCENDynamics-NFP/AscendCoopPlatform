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
// other-id.pipe.ts

import {Pipe, PipeTransform} from "@angular/core";
import {RelatedAccount} from "@shared/models/account.model";

@Pipe({
  name: "otherId",
})
export class OtherIdPipe implements PipeTransform {
  transform(
    relatedAccount: Partial<RelatedAccount>,
    accountId: string | null,
  ): string | null {
    if (!accountId) return null;
    if (
      relatedAccount.initiatorId &&
      relatedAccount.initiatorId !== accountId
    ) {
      return relatedAccount.initiatorId;
    }
    if (relatedAccount.targetId && relatedAccount.targetId !== accountId) {
      return relatedAccount.targetId;
    }
    return null;
  }
}
