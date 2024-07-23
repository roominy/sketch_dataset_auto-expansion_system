import { createAction, props } from '@ngrx/store';
import {User} from '@app/_models';


export const fetchUsers = createAction(
    '[Admin] Fetch Users'
);

export const fetchUsersSuccess = createAction(
    '[Admin] Fetch Users Success',
    props<{ users: User[] }>()
);

export const fetchUsersFailure = createAction(
    '[Admin] Fetch Users Failure',
    props<{ error: string }>()
);

export const getUser = createAction(
    '[Admin] Get User',
    props<{ user: User }>()
);

export const addUser = createAction(
    '[Admin] Add User',
    props<{ user: User }>()
);

export const addUserSuccess = createAction(
    '[Admin] Add User Success',
    props<{ users: User[] }>()
);

export const addUserFailure = createAction(
    '[Admin] Add User Failure',
    props<{ error: string }>()
);

export const editUser = createAction(
    '[Admin] Edit User',
    props<{ user: User }>()
);

export const editUserSuccess = createAction(
    '[Admin] Edit User Success',
    props<{ users: User[] }>()
);

export const editUserFailure = createAction(
    '[Admin] Edit User Failure',
    props<{ error: string }>()
);

export const changeUserStatus = createAction(
    '[Admin] Change User Status',
    props<{ user: User }>()
);

export const changeUserStatusSuccess = createAction(
    '[Admin] Change User Status Success',
    props<{ users: User[] }>()
);

export const changeUserStatusFailure = createAction(
    '[Admin] Change User Status Failure',
    props<{ error: string }>()
);

export const resetPassword = createAction(
    '[Admin] Reset Password',
    props<{ user: User }>()
);

export const resetPasswordSuccess = createAction(
    '[Admin] Reset Password Success',
    props<{ users: User[] }>()
);

export const resetPasswordFailure = createAction(
    '[Admin] Reset Password Failure',
    props<{ error: string }>()
);


