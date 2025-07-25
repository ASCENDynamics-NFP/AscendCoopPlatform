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
  (state) => state.loading,
);

export const selectTimeTrackingError = createSelector(
  selectTimeTrackingState,
  (state) => state.error,
);
