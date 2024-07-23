import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { loginFailure, logout } from '@app/stores/auth/auth.actions';

import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Alert } from '@app/_models';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService, 
        private alertService: AlertService,
        private authStore: Store<AuthStoreModule>,
        private router: Router ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                tap(event => {
                    if (event instanceof HttpResponse && request.url.endsWith('/verify/')) {
                        // Handle a successful verification response
                        // You could also check for event.status === 200 if needed
                        this.alertService.success('Email verification successful. You can now login', { keepAfterRouteChange: true });
                        this.router.navigateByUrl('/account/login');
                        
                        // Here you could use Angular services to show success messages or redirect
                    }
                }),
                catchError((err: HttpErrorResponse) => {
                    if (request.url.endsWith('/verify/')) {
                        // Specific handling for verification errors
                        if (err.status === 400) {
                            // Handle specific 400 errors for the verification endpoint
                            this.alertService.error('Verification failed. Email already verified or token expired. Please chech your email for the verification link.');
                            this.router.navigate(['/account/login']);
                            
                            // Use services to show error messages to the user
                        }
                    }
                    
                    if ([401, 403].includes(err.status) && this.accountService.userValue) {
                        // auto logout if 401 or 403 response returned from api
                        // this.accountService.logout();
                        
                        this.authStore.dispatch(logout());
                    }

                    const error = err.error?.message || err.statusText;
                    console.error('HTTP Error', err);
                    return throwError(() => error);
                })
            );
    }

    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     return next.handle(request).pipe(catchError(err => {
    //         if ([401, 403].includes(err.status) && this.accountService.userValue) {
    //             // auto logout if 401 or 403 response returned from api
    //             this.accountService.logout();
    //         }

    //         const error = err.error?.message || err.statusText;
    //         console.error(err);
    //         return throwError(() => error);
    //     }))
    // }
}