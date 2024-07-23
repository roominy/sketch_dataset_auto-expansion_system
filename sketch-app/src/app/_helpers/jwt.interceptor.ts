import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/_services';
import { User } from '@app/_models';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { selectUser } from '@app/stores/auth/auth.selectors';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    // user?: User;
    user: any;
    constructor(private accountService: AccountService, private store: Store<AuthStoreModule>) { 
        this.store.select(selectUser).subscribe(user => (this.user = user));
        // this.user =  this.store.select(selectUser);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const isLoggedIn = this.user && this.user?.token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.user.token}`
                }
            });
        }

        return next.handle(request);
    }
}