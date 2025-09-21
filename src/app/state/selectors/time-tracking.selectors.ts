import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TimeEntriesState} from "../reducers/time-tracking.reducer";

export const selectTimeTrackingState =
  createFeatureSelector<TimeEntriesState>("timeTracking");

export const selectEntries = (
  accountId: string,
  userId: string,
  weekStart?: Date,
) =>
  createSelector(selectTimeTrackingState, (state: TimeEntriesState) => {
    if (!state || !state.entities) {
      return [];
    }
    const entries = state.entities[`${accountId}_${userId}`] || [];
    if (!weekStart) {
      return entries;
    }
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return entries.filter((e: any) => {
      const val = e?.date;
      let d: Date;
      if (val && typeof val.toDate === "function") {
        d = val.toDate();
      } else if (val instanceof Date) {
        d = val as Date;
      } else if (typeof val === "string") {
        d = new Date(val);
      } else {
        // Fallback: cannot parse date, exclude
        return false;
      }
      return d >= start && d < end;
    });
  });

export const selectTimeTrackingLoading = createSelector(
  selectTimeTrackingState,
  (state) => state?.loading || false,
);

export const selectTimeTrackingError = createSelector(
  selectTimeTrackingState,
  (state) => state?.error || null,
);

export const selectAllEntriesForAccount = (accountId: string) =>
  createSelector(selectTimeTrackingState, (state: TimeEntriesState) => {
    if (!state || !state.entities) {
      return [];
    }
    const allEntries: any[] = [];
    Object.keys(state.entities).forEach((key) => {
      if (key.startsWith(`${accountId}_`)) {
        allEntries.push(...state.entities[key]);
      }
    });
    return allEntries;
  });

export const selectAllEntriesForUser = (userId: string) =>
  createSelector(selectTimeTrackingState, (state: TimeEntriesState) => {
    if (!state || !state.entities) {
      return [];
    }
    const allEntries: any[] = [];
    Object.keys(state.entities).forEach((key) => {
      const entries = state.entities[key] || [];
      // Filter entries where this user is the worker
      const userEntries = entries.filter(
        (entry: any) => entry.userId === userId,
      );
      allEntries.push(...userEntries);
    });
    return allEntries;
  });
