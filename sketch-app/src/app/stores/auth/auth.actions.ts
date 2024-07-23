import { createAction, props } from '@ngrx/store';
import { User} from '@app/_models';

export const login = createAction(
  '[Login] User Login',
  props<{ username: string, password: string }>()
);

export const loginSuccess = createAction(
  '[Login] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Login] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Register] User Register',
  props<{ user: User }>()
);

export const registerSuccess = createAction('[Register] Register Success');

export const registerFailure = createAction(
  '[Register] Register Failure',
  props<{ error: string }>()
);

export const toggleMenu = createAction('[Menu] Toggle Menu');

export const fetchProfile = createAction('[Profile] Fetch Profile');

export const fetchProfileSuccess = createAction(
  '[Profile] Fetch Profile Success',
  props<{ user: User }>()
);

export const fetchProfileFailure = createAction(
  '[Profile] Fetch Profile Failure',
  props<{ error: string }>()
);

export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<{ user: User }>()
);

export const updateProfileSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ error: string }>()
);

export const deactivateAccount = createAction(
  '[Profile] Deactivate Account', 
  props<{ user: User }>()
);

export const deactivateAccountSuccess = createAction(
  '[Profile] Deactivate Account Success'
);

export const deactivateAccountFailure = createAction(
  '[Profile] Deactivate Account Failure',
  props<{ error: string }>()
);

export type authActions = 
  | ReturnType<typeof login>
  | ReturnType<typeof loginSuccess>
  | ReturnType<typeof loginFailure>
  | ReturnType<typeof logout>
  | ReturnType<typeof logoutSuccess>
  | ReturnType<typeof logoutFailure>
  | ReturnType<typeof register>
  | ReturnType<typeof registerSuccess>
  | ReturnType<typeof registerFailure>
  | ReturnType<typeof toggleMenu>
  | ReturnType<typeof fetchProfile>
  | ReturnType<typeof fetchProfileSuccess>
  | ReturnType<typeof fetchProfileFailure>
  | ReturnType<typeof updateProfile>
  | ReturnType<typeof updateProfileSuccess>
  | ReturnType<typeof updateProfileFailure>
  | ReturnType<typeof deactivateAccount>
  | ReturnType<typeof deactivateAccountSuccess>
  | ReturnType<typeof deactivateAccountFailure>;