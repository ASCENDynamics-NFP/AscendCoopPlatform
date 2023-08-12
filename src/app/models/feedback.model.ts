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
import {Timestamp} from "firebase/firestore";

export interface AppFeedback {
  id: string; // Firestore document ID
  createdAt: Timestamp; // When the group was added
  createdBy: string; // User ID of the user who created the group
  lastModifiedAt: Timestamp; // When the group document was last modified
  lastModifiedBy: string; // User ID of the user who last modified the group
  email: string; // Email of the user who submitted the feedback
  emailVerified: boolean; // Whether the user's email has been verified
  name: string; // Name of the user who submitted the feedback
  feedback: string; // Feedback text
  type: string; // Feedback type
  attachment: string; // URL of the attachment
  rating: number; // Rating of the feedback
  category: string; // Category of the feedback
  isRead: boolean; // Whether the feedback has been read
  isResolved: boolean; // Whether the feedback has been resolved
}
