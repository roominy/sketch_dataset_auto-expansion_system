import { createSelector ,createFeatureSelector} from '@ngrx/store';
import {AuthState} from './auth.reducer'; 

//  (state: any) => state.auth;
 const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
    selectAuth,
  (state) => state.user
);

export const selectAuthError = createSelector(
    selectAuth,
  (state) => state.error
);

export const selectIsLoginLoading = createSelector(
    selectAuth,
  (state) => state.isLoading
);

export const selectToggleMenu = createSelector(
    selectAuth,
  (state) => state.toggleMenu
);

export const isUpdateLoading = createSelector(
    selectAuth,
  (state) => state.isUpdateLoading
);

export const isDeactivateLoading = createSelector(
    selectAuth,
  (state) => state.isDeactivateLoading
);

export const isFetchLoading = createSelector(
    selectAuth,
  (state) => state.isFetchLoading
);




