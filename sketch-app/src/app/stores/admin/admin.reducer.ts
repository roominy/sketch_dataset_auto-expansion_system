import { createReducer, on } from '@ngrx/store';
import { User } from '@app/_models';
import { addUser, addUserSuccess, addUserFailure, 
        fetchUsers, fetchUsersFailure, fetchUsersSuccess,
        editUser, editUserFailure, editUserSuccess,
        changeUserStatus,  changeUserStatusFailure, changeUserStatusSuccess,
        resetPassword, resetPasswordFailure, resetPasswordSuccess,
         getUser } from '@app/stores/admin/admin.actions';



export interface AdminState {
    users: User[];
    user: User;
    error: string;
    isLoading: boolean;
    isFetchingUsers: boolean;
    isResetPassword: boolean;
    isChangeUserStatus: boolean;
    isEditUser: boolean;
    isAddUser: boolean;
}


const initialState: AdminState = {
    users: [],
    user: new User(),
    error: '',
    isLoading: false,
    isFetchingUsers: false,
    isResetPassword: false,
    isChangeUserStatus: false,
    isEditUser: false,
    isAddUser: false
};

export const adminReducer = createReducer(initialState,
    on(fetchUsers, (state, { }) => ({ ...state, isAddUser: false, isEditUser: false, isChangeUserStatus: false, isResetPassword: false, isFetchingUsers: true, isLoading: true, error: '' })),
    on(fetchUsersSuccess, (state, { users }) => ({ ...state, users: users, isFetchingUsers: false, isLoading: false, error: ''})), 
    on(fetchUsersFailure, (state, { error }) => ({ ...state, error: error, isFetchingUsers: false, isLoading: false })),
    on(getUser, (state, { user }) => ({ ...state, user: user, error: '' })),
    on(addUser, (state, { user }) => ({ ...state, user: user, isAddUser: true, isLoading: true, error: '' })),
    on(addUserSuccess, (state, { users }) => ({ ...state, users: users, user: new User(), isAddUser: false, isLoading: false, error: '' })),
    on(addUserFailure, (state, { error }) => ({ ...state, error: error, isAddUser: false, isLoading: false })),
    on(editUser, (state, { user }) => ({ ...state, user: user, isEditUser: true, isLoading: true, error: '' })),
    on(editUserSuccess, (state, { users }) => ({ ...state, users: users, user: new User(), isEditUser: false, isLoading: false, error: '' })),
    on(editUserFailure, (state, { error }) => ({ ...state, error: error, isEditUser: false, isLoading: false })),
    on(changeUserStatus, (state, { user }) => ({ ...state, user: user, isChangeUserStatus: true, isLoading: true, error: '' })),
    on(changeUserStatusSuccess, (state, { users }) => ({ ...state, users: users, user: new User(), isChangeUserStatus: false, isLoading: false, error: '' })),
    on(changeUserStatusFailure, (state, { error }) => ({ ...state, error: error, isChangeUserStatus: false, isLoading: false })),
    on(resetPassword, (state, { user }) => ({ ...state, user: user, isResetPassword: true, isLoading: true, error: '' })),
    on(resetPasswordSuccess, (state, { users }) => ({ ...state, users: users, user: new User(), isResetPassword: false, isLoading: false, error: '' })),
    on(resetPasswordFailure, (state, { error }) => ({ ...state, error: error, isResetPassword: false, isLoading: false })),


    // on(categorySelected, (state, { category }) => ({ ...state, category: category, error: ''})),
    // on(addCategory, (state, { category }) => ({ ...state, category: category, isLoading: true, error: ''})),
    // on(editCategory, (state, { category }) => ({ ...state, category: category, isLoading: true, error: '' })),
    // on(categoryStatusChange, (state, { category }) => ({ ...state, category: category, isLoading: true, error: '' })),
    // //on(loginSuccess, (state, { user }) => ({ ...state, user: user, isLoading: false, error: ''})),
    // on(addCategoryFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    // on(editCategoryFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    // on(categoryStatusChangeFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    // on(fetchCategories, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    // on(fetchCategoriesSuccess, (state, { categories }) => ({ ...state, categories: categories, category: new Category(), isLoading: false, error: ''})),
    // on(fetchCategoriesFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    
   //on(logout, (state, { }) => ({ ...state, isLoading: true })),
    //on(logoutSuccess, (state, { }) => ({ ...state, user: new User(), isLoading: false, error: ''})),
    //on(logoutFailure, (state, { error }) => ({ ...state, error: error, isLoading: false }))
);


