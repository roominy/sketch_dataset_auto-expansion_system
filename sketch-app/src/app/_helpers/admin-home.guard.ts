import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { selectUser } from '@app/stores/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AdminHomeGuard implements CanActivate {
    user?: any;
    constructor(
        private router: Router,
        private accountService: AccountService,
        private store: Store<AuthStoreModule>
        ) {
            this.store.select(selectUser).subscribe(user => (this.user = user));}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.user;
        if (user?.role === 'admin' || user?.role === 'data_admin' ) {
            // authorised so return true
            
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}