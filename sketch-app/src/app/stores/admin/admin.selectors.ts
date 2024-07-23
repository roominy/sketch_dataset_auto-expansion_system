import { createSelector ,createFeatureSelector} from '@ngrx/store';
import {AdminState} from './admin.reducer'; 

//  (state: any) => state.auth;
 const selectApp = createFeatureSelector<AdminState>('admin');

export const selectUsers = createSelector(
    selectApp,
  (state) => state.users
);

export const selectedUser = createSelector(
  selectApp,
(state) => state.user
);

export const selectAdminError = createSelector(
    selectApp,
  (state) => state.error
);

export const selectIsAdminLoading = createSelector(
    selectApp,
  (state) => state.isLoading
);

export const selectIsFetchingUsers = createSelector(
    selectApp,
  (state) => state.isFetchingUsers
);

export const selectIsResetPassword = createSelector(
    selectApp,
  (state) => state.isResetPassword
);

export const selectIsChangeUserStatus = createSelector(
    selectApp,
  (state) => state.isChangeUserStatus
);

export const selectIsEditUser = createSelector(
    selectApp,
  (state) => state.isEditUser
);

export const selectIsAddUser = createSelector(
    selectApp,
  (state) => state.isAddUser
);
