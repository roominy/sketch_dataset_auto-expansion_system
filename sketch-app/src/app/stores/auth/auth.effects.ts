import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { login, loginSuccess, loginFailure ,
        logout, logoutFailure, logoutSuccess,
        register, registerSuccess, registerFailure,
        updateProfile , updateProfileFailure,
        fetchProfile, fetchProfileSuccess, fetchProfileFailure,
        deactivateAccount,  deactivateAccountFailure, deactivateAccountSuccess } from '@app/stores/auth/auth.actions';
import { AccountService, AlertService } from '@app/_services';
import { User } from '@app/_models'; // Add the import statement for User

@Injectable()

export class AuthEffects {
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            switchMap(({ username, password }) =>
                this.accountService.login(username, password).pipe(
                    map((user: User) => loginSuccess({ user })),
                    tap(() => {
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                        this.router.navigateByUrl(returnUrl);
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(loginFailure({ error }));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            switchMap(() => 
                // Simulate a logout operation or call this.accountService.logout() if needed
                of(logoutSuccess()).pipe(
                    tap(() => {
                        this.alertService.success("Logged out successfully");
                        this.router.navigate(['/account/login']); // Navigate to login page
                    }),
                    catchError(error => {
                        // Handle any errors from the logout process
                        this.alertService.error("Error in logging out"); 
                        return of(logoutFailure({ error: "Error in logging out"}));
                    })
                )
            )
        )
    );

    register$ = createEffect(() => 
        this.actions$.pipe( 
            ofType(register),
            switchMap(({user}) => 
                this.accountService.register(user).pipe(
                // Simulate a logout operation or call this.accountService.logout() if needed
                    map(() => registerSuccess()),
                    tap((meassage) => {
                        this.alertService.success("User registered successfully",{ keepAfterRouteChange: true });
                        
                        this.router.navigate(['/account/login']); // Navigate to login page
                    }),
                    catchError(error => {
                        // Handle any errors from the logout process
                        this.alertService.error("Error in registering user "); 
                        return of(registerFailure({ error: "Error in registering user"}));
                    })
                )
            )
        )
    ); 

    // profile related effects

    fetchProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchProfile),
            switchMap(() => 
                this.accountService.fetchProfile().pipe(
                    map((user: User) => fetchProfileSuccess({ user })),
                    catchError(error => {
                        this.alertService.error(error);
                        return of(fetchProfileFailure({ error }));
                    })
                )
            )
        )
    );



    updateProfile$ = createEffect(() => 
        this.actions$.pipe(
            ofType(updateProfile),
            switchMap(({user}) => 
                this.accountService.updateProfile(user).pipe(
                    map(() => fetchProfile()),
                    tap(() => {
                        this.alertService.success("Profile updated successfully",{ keepAfterRouteChange: true });
                        
                        // this.router.navigate(['/']);

                    }),
                    catchError(error => {
                        this.alertService.error(error);
                        return of(updateProfileFailure({ error }));
                    })
                )
            )
        )
    );

    deactivateProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deactivateAccount),
            switchMap(({user}) => 
                this.accountService.deactivateProfile(user).pipe(
                    map(() => deactivateAccountSuccess()),
                    tap(() => {
                        this.alertService.success("Profile deactivated successfully. if you want to activate it again, please contact the admin.",{ keepAfterRouteChange: true });
                        this.router.navigate(['/account/login']); // Navigate to login page
                    }),
                    catchError(error => {
                        this.alertService.error("Error in deactivating profile"); 
                        return of(deactivateAccountFailure({ error: "Error in deactivating profile"}));
                    })
                )
            )
        )
    );

    constructor(private actions$: Actions, private accountService: AccountService,
                private route: ActivatedRoute, private alertService: AlertService, 
                private router: Router) {}
}