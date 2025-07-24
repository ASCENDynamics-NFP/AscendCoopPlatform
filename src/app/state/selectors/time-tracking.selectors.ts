import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TimeTrackingState} from "../reducers/time-tracking.reducer";

export const selectTimeTrackingState =
  createFeatureSelector<TimeTrackingState>("timeTracking");

export const selectProjects = createSelector(
  selectTimeTrackingState,
  (state) => state.projects,
);

export const selectEntries = createSelector(
  selectTimeTrackingState,
  (state) => state.entries,
);

export const selectTimeTrackingLoading = createSelector(
  selectTimeTrackingState,
  (state) => state.loading,
);

export const selectTimeTrackingError = createSelector(
  selectTimeTrackingState,
  (state) => state.error,
);
