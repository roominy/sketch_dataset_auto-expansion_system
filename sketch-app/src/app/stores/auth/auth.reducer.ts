import { createReducer, on } from '@ngrx/store';
import {  login, loginSuccess, loginFailure,
          logout, logoutSuccess, logoutFailure,
          register, registerSuccess, registerFailure,
          toggleMenu, 
          fetchProfile, fetchProfileSuccess, fetchProfileFailure,
          updateProfile, updateProfileSuccess, updateProfileFailure,
          deactivateAccount, deactivateAccountSuccess, deactivateAccountFailure } from '@app/stores/auth/auth.actions';
import { User } from '@app/_models';

export interface AuthState {
  toggleMenu: boolean,
  user: User;
  error: string;
  isLoading: boolean;
  isUpdateLoading: boolean;
  isDeactivateLoading: boolean;
  isFetchLoading: boolean;
}

const initialState: AuthState = {
    // user: {
    //     id: 0,
    //     username: '',
    //     first_name: '',
    //     last_name: '',
    //     role: '',
    //     token: '',
    //     email: '',
    //     token_exp: 0
    // } ,
    toggleMenu: true,
    user: new User(),
    error: '',
    isLoading: false,
    isUpdateLoading: false,
    isDeactivateLoading: false,
    isFetchLoading: false
};

export const authReducer = createReducer(initialState,
  on(login, state => ({ ...state, isLoading: true, error: ''})),
  on(loginSuccess, (state, { user }) => ({ ...state, user: user, isLoading: false, error: ''})),
  on(loginFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
  on(logout, (state, { }) => ({ ...state, isLoading: true, error: '' , toggleMenu: true})),
  on(logoutSuccess, (state, { }) => ({ ...state, user: new User(), isLoading: false, error: ''})),
  on(logoutFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
  on(register, state => ({ ...state, isLoading: true, error: ''})),
  on(registerSuccess, (state, { }) => ({ ...state, isLoading: false, error: ''})),
  on(registerFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
  on(toggleMenu, state => ({ ...state, toggleMenu: !state.toggleMenu})),
  on(fetchProfile, state => ({ ...state, isDeactivateLoading: false, isUpdateLoading: false, isFetchLoading: true, isLoading: true, error: ''})),
  on(fetchProfileSuccess, (state, { user }) => ({ ...state, isFetchLoading: false, user: user, isLoading: false, error: ''})),
  on(fetchProfileFailure, (state, { error }) => ({ ...state, isFetchLoading: false, error: error, isLoading: false })),
  on(updateProfile, state => ({ ...state, isUpdateLoading: true, isLoading: true, error: ''})),
  on(updateProfileSuccess, (state, { user }) => ({ ...state, user: user, isUpdateLoading: false, isLoading: false, error: ''})),
  on(updateProfileFailure, (state, { error }) => ({ ...state, error: error, isUpdateLoading: false, isLoading: false })),
  on(deactivateAccount, state => ({ ...state, isDeactivateLoading: true, isLoading: true, error: ''})),
  on(deactivateAccountSuccess, (state, { }) => ({ ...state, user: new User(), isDeactivateLoading: false, isLoading: false, error: ''})),
  on(deactivateAccountFailure, (state, { error }) => ({ ...state, error: error, isDeactivateLoading: false, isLoading: false })) 
);