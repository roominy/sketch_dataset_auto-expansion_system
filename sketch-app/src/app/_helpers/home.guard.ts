import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '@app/_models';

import { AccountService } from '@app/_services';
import { AuthStoreModule } from '@app/stores';
import { selectUser } from '@app/stores/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {
    user?: User;
    constructor(
        private router: Router,
        private accountService: AccountService,
        private store: Store<AuthStoreModule>
    ) {
        this.store.select(selectUser).subscribe(user => (this.user = user));
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const user = this.accountService.userValue;
        const user = this.user;
        if (user?.role === 'user') {
            // authorised so return true
            
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}