import { Component } from '@angular/core';

import { User , Category} from '@app/_models';

import { AccountService } from '@app/_services';
import {  ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { selectUser } from '@app/stores/auth/auth.selectors';




@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user?: User | null;

    constructor(
        private store: Store<AuthStoreModule>
    ) {
        this.store.select(selectUser).subscribe(user => (this.user = user));
    }

    ngOnInit() {
      
    }
}