import { Component, OnInit , OnDestroy} from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, UserAdminService } from '@app/_services';
import { Store } from '@ngrx/store';
import { AdminStoreModule } from '@app/stores/admin/admin-store.module';
import { MatIconModule } from '@angular/material/icon';
import { fetchUsers } from '@app/stores/admin/admin.actions';
import { selectUsers } from '@app/stores/admin/admin.selectors';
import { User } from '@app/_models';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as AdminActions from '@app/stores';

@Component({ templateUrl: 'list.component.html'})
export class ListComponent implements OnInit, OnDestroy {
    private actionsSubscription?: Subscription;
    users?: User[];
    displayedColumns: string[] = ['id', 'firstame', 'username', 'role'];
    submittingChangeUserStatus = false;
    

    constructor(private accountService: AccountService, 
        private store : Store<AdminStoreModule>,
        private actions$: Actions) {}
    

    ngOnInit() {
        this.store.dispatch(fetchUsers());

        this.store.select(selectUsers).subscribe((users) => {this.users = users});

        this.actionsSubscription = merge(
            this.actions$.pipe(ofType(AdminActions.changeUserStatusSuccess)),
            this.actions$.pipe(ofType(AdminActions.fetchUsersSuccess)),
            this.actions$.pipe(ofType(AdminActions.fetchUsersFailure)),
            this.actions$.pipe(ofType(AdminActions.changeUserStatusFailure)),
            // Add more actions here as needed
          ).subscribe(action => {
            if (action.type === '[Admin] Change User Status Success') {
              
              this.submittingChangeUserStatus = false;
              // Handle add category success
            } else if (action.type === '[Admin] Fetch Users Success') {
              
              this.submittingChangeUserStatus = false;
              // Handle edit category success
            } else {
                this.submittingChangeUserStatus = false;
            }
          });

        
        // this.accountService.getAll()
        //     .pipe(first())
        //     .subscribe(users => this.users = users);
    }

    ngOnDestroy(): void {
        this.actionsSubscription?.unsubscribe();
    }

    changeUserStatus(user: User) {
        this.submittingChangeUserStatus = true;
        this.store.dispatch(AdminActions.changeUserStatus({user: user}));
    }

    deleteUser(id: string) {
        // const user = this.users!.find(x => x.id === id);
        // user.isDeleting = true;
        // this.accountService.delete(id)
        //     .pipe(first())
        //     .subscribe(() => this.users = this.users!.filter(x => x.id !== id));
    }
}