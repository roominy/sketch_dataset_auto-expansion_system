import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { fetchUsers, fetchUsersSuccess, fetchUsersFailure,
     addUser, addUserFailure, editUser, editUserFailure, 
     changeUserStatus, changeUserStatusFailure,  resetPassword, resetPasswordFailure
    } from '@app/stores/admin/admin.actions';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models'; // Add the import statement for User
import { UserAdminService } from '@app/_services/user-admin.service';

@Injectable()

export class AdminEffects {
    
    fetchUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchUsers),
            switchMap(() =>
                this.userAdminService.fetchUsers().pipe(
                    map((users ) => fetchUsersSuccess({ users })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchUsersFailure({ error }));
                    })
                )
            )
        )
    );

    addUser$ = createEffect(() => 
        this.actions$.pipe( 
            ofType(addUser),
            switchMap(({user}) => 
                this.userAdminService.addUser(user).pipe(
                    map(() => fetchUsers()),
                    tap(() => {
                        this.alertService.success('User created successfully.',{ keepAfterRouteChange: true });

                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(addUserFailure({ error }));
                    })
                )
            )
        )
    );

    editUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(editUser),
            switchMap(({user}) =>
                this.userAdminService.editUser(user).pipe(
                    map(() => fetchUsers()),
                    tap(() => {
                        this.alertService.success('User updated successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(editUserFailure({ error }));
                    })
                )
            )
        )
    );

    deactivateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(changeUserStatus),
            switchMap(({user}) =>
                this.userAdminService.changeUserStatus(user).pipe(
                    map(() => fetchUsers()),
                    tap(() => {
                        if(user.status === 'active'){
                            this.alertService.success('User deactivated successfully.',{ keepAfterRouteChange: true });
                        }
                        else{
                            this.alertService.success('User activated successfully.',{ keepAfterRouteChange: true });
                        }
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(changeUserStatusFailure({ error }));
                    })
                )
            )
        )
    );

    resetPassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(resetPassword),
            switchMap(({user}) =>
                this.userAdminService.resetPassword(user).pipe(
                    map(() => fetchUsers()),
                    tap(() => {
                        this.alertService.success('User password reset successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(resetPasswordFailure({ error }));
                    })
                )
            )
        )
    );



//     editCategoty$ = createEffect(() =>
//         this.actions$.pipe(
//             ofType(editCategory),
//             switchMap(({category}) =>
//                 this.categoryService.editCategory(category).pipe(
//                     map(() => fetchCategories()),
//                     tap(() => {
//                         this.alertService.success('Category updated successfully.',{ keepAfterRouteChange: true });
//                     }),
//                     catchError(error => { 
//                         this.alertService.error(error); 
//                         return of(editCategoryFailure({ error }));
//                     })
//                 )
//             )
//         )
//     );


//     addCategoty$ = createEffect(() =>
//         this.actions$.pipe(
//             ofType(addCategory),
//             switchMap(({category}) =>
//                 this.categoryService.addCategory(category).pipe(
//                     map(() => fetchCategories()),
//                     tap(() => {
//                         this.alertService.success('Category added successfully.',{ keepAfterRouteChange: true });
//                     }),
//                     catchError(error => { 
//                         this.alertService.error(error); 
//                         return of(addCategoryFailure({ error }));
//                     })
//                 )
//             )
//         )
//     );

    constructor(private actions$: Actions, private userAdminService: UserAdminService,
        private route: ActivatedRoute, private alertService: AlertService, 
        private router: Router) {}

}