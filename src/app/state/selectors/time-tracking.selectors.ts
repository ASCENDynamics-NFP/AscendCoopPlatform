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
    return entries.filter((e) => {
      const d = e.date.toDate();
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
    const allEntries: TimeEntry[] = [];
    Object.keys(state.entities).forEach((key) => {
      if (key.startsWith(`${accountId}_`)) {
        const entries = state.entities[key] as TimeEntry[]; // Ensure type safety
        allEntries.push(...entries);
      }
    });
    return allEntries;
  });
