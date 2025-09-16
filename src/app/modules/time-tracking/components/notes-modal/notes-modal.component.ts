/*******************************************************************************
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
// src/app/modules/time-tracking/components/notes-modal/notes-modal.component.ts

import {Component, Input, OnInit} from "@angular/core";
import {ModalController, ToastController} from "@ionic/angular";
import {Store} from "@ngrx/store";
import {Timestamp} from "firebase/firestore";
import {TimeEntry} from "../../../../../../shared/models/time-entry.model";
import {AuthUser} from "../../../../../../shared/models/auth-user.model";
import {selectAuthUser} from "../../../../state/selectors/auth.selectors";
import {filter, take} from "rxjs/operators";
import * as TimeTrackingActions from "../../../../state/actions/time-tracking.actions";
import {TimesheetNotificationService} from "../../services/timesheet-notification.service";

interface NoteItem {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: Timestamp;
  type: "user" | "admin" | "system";
  editedAt?: Timestamp;
}

@Component({
  selector: "app-notes-modal",
  templateUrl: "./notes-modal.component.html",
  styleUrls: ["./notes-modal.component.scss"],
})
export class NotesModalComponent implements OnInit {
  @Input() entry: TimeEntry | null = null;
  @Input() date: Date = new Date();
  @Input() projectName: string = "";
  @Input() isAdmin: boolean = false;

  noteHistory: NoteItem[] = [];
  newNote: string = "";
  currentUser: AuthUser | null = null;
  isSubmitting = false;

  constructor(
    private modalController: ModalController,
    private store: Store,
    private toastController: ToastController,
    private notificationService: TimesheetNotificationService,
  ) {}

  ngOnInit() {
    // Get current user
    this.store
      .select(selectAuthUser)
      .pipe(
        filter((user) => !!user),
        take(1),
      )
      .subscribe((user) => {
        this.currentUser = user;
      });

    // Load existing note history
    this.loadNoteHistory();
  }

  private loadNoteHistory() {
    if (!this.entry?.noteHistory) {
      this.noteHistory = [];
      return;
    }

    this.noteHistory = [...this.entry.noteHistory]
      .map((note) => ({
        ...note,
        createdAt: this.toTimestamp(note.createdAt),
        editedAt: note.editedAt ? this.toTimestamp(note.editedAt) : undefined,
      }))
      .sort((a, b) => {
        const aDate = this.toDate(a.createdAt)?.getTime() ?? 0;
        const bDate = this.toDate(b.createdAt)?.getTime() ?? 0;
        return aDate - bDate;
      });
  }

  async addNote() {
    if (!this.newNote.trim() || !this.currentUser) {
      return;
    }

    this.isSubmitting = true;

    const noteId = `note_${Date.now()}`;
    const newNoteItem: NoteItem = {
      id: noteId,
      content: this.newNote.trim(),
      createdBy: this.currentUser.uid,
      createdByName:
        this.currentUser.displayName || this.currentUser.email || "Unknown",
      createdAt: Timestamp.now(),
      type: this.isAdmin ? "admin" : "user",
    };

    // Add to local array for immediate UI update
    this.noteHistory.push(newNoteItem);

    // Update the entry with new note history
    const updatedEntry: TimeEntry = {
      ...this.entry!,
      noteHistory: this.noteHistory,
      // Also update the legacy notes field for backward compatibility
      notes: this.noteHistory
        .map((note) => {
          const created = this.toDate(note.createdAt);
          const createdLabel = created ? created.toLocaleDateString() : "";
          return `[${createdLabel}] ${note.createdByName}: ${note.content}`;
        })
        .join("\n\n"),
    };

    // Dispatch update action
    this.store.dispatch(
      TimeTrackingActions.updateTimeEntry({entry: updatedEntry}),
    );

    // Send notification about the new note
    if (this.entry) {
      this.notificationService.notifyNoteAdded(
        this.entry,
        this.newNote.trim(),
        this.isAdmin,
      );
    }

    // Clear input and show success
    this.newNote = "";
    this.isSubmitting = false;

    await this.showToast("Note added successfully", "success");
  }

  formatTimestamp(timestamp: Timestamp | any): string {
    const date = this.toDate(timestamp);
    if (!date) {
      return "";
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getNoteTypeIcon(type: string): string {
    switch (type) {
      case "admin":
        return "shield-checkmark";
      case "user":
        return "person";
      case "system":
        return "settings";
      default:
        return "chatbubble";
    }
  }

  getNoteTypeColor(type: string): string {
    switch (type) {
      case "admin":
        return "warning";
      case "user":
        return "primary";
      case "system":
        return "medium";
      default:
        return "primary";
    }
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  private async showToast(message: string, color: string = "primary") {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: "top",
    });
    await toast.present();
  }

  private toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value && typeof value.toDate === "function") return value.toDate();
    if (value && typeof value.seconds === "number") {
      return new Date(value.seconds * 1000 + (value.nanoseconds ?? 0) / 1e6);
    }
    if (value && typeof value._seconds === "number") {
      return new Date(value._seconds * 1000 + (value._nanoseconds ?? 0) / 1e6);
    }
    const date = value instanceof Date ? value : new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  private toTimestamp(value: any): Timestamp {
    if (value instanceof Timestamp) return value;
    const asDate = this.toDate(value) ?? new Date();
    return Timestamp.fromDate(asDate);
  }

  trackByNoteId(index: number, note: NoteItem): string {
    return note.id;
  }
}
