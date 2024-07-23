import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { User } from '@app/_models';
import { AdminStoreModule } from '@app/stores/admin/admin-store.module';
import { Store } from '@ngrx/store';
import { selectUsers } from '@app/stores/admin/admin.selectors';
import * as AdminActions from '@app/stores/admin/admin.actions';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
export class Roles {
    label: string | undefined;
    name: string | undefined;
    }

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit, OnDestroy {
    private actionsSubscription?: Subscription;
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submittingResetPassword = false;
    submitted = false;
    user?: User;
    users?: User[];
    roles: Roles[] = [
        { label: "User", name: 'user' },
        { label: "Dataset Admin", name: 'data_admin' },
        { label: "Admin", name: 'admin' }
     ];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private store: Store<AdminStoreModule>,
        private actions$: Actions
    ) { }

    

    ngOnInit() {
        this.id = this.route.snapshot.params['id']?.toString();

        // form with validation rules
        this.form = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            username: ['', Validators.required],
            email : ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            // password only required in add mode
            // password: ['', [Validators.minLength(6), ...(!this.id ? [Validators.required] : [])]]
        });

        this.title = 'Add User';
        if (this.id) {
            // edit mode
            this.title = 'Edit User';
            this.loading = true;
            this.store.select(selectUsers).subscribe(users => (this.users = users));
            

            this.user = this.users?.find(x => x.id?.toString() === this.id);
            
            this.form.patchValue(this.user||{});
            this.loading = false;
            // this.accountService.getById(this.id)
            //     .pipe(first())
            //     .subscribe(x => {
            //         this.form.patchValue(x);
            //         this.loading = false;
            //     });
        }

        this.actionsSubscription = merge(
            this.actions$.pipe(ofType(AdminActions.editUserSuccess)),
            this.actions$.pipe(ofType(AdminActions.addUserSuccess)),
            this.actions$.pipe(ofType(AdminActions.fetchUsersSuccess)),
            this.actions$.pipe(ofType(AdminActions.resetPasswordSuccess)),
            this.actions$.pipe(ofType(AdminActions.editUserFailure)),
            this.actions$.pipe(ofType(AdminActions.addUserFailure)),
            this.actions$.pipe(ofType(AdminActions.fetchUsersFailure)),
            this.actions$.pipe(ofType(AdminActions.resetPasswordFailure))
            // Add more actions here as needed
          ).subscribe(action => {
            // Handle the success actions here
            // The logic here will execute for any of the actions defined above
            if (action.type === '[Admin] Add User Success') {
              
              this.submitting = false;
              // Handle add category success
            } else if (action.type === '[Admin] Edit User Success') {
              
              this.submitting = false;
              // Handle edit category success
            } else if (action.type === '[Admin] Fetch Users Success') {
              
              this.submitting = false;
              this.submittingResetPassword = false;
              this.user = this.users?.find(x => x.id?.toString() === this.id);
              this.form.patchValue({
                first_name: this.user?.first_name,
                last_name: this.user?.last_name,
                username: this.user?.username, 
                email: this.user?.email, 
                role: this.user?.role
              });
            } else if (action.type === '[Admin] Reset Password Success') {
                this.submittingResetPassword = false;
            } else {
                this.submitting = false;
                this.submittingResetPassword = false;
            }
          });
    }

    ngOnDestroy(): void {
        this.actionsSubscription?.unsubscribe(); 
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitted = false;

        this.submitting = true;
        const user = new User();
        user.first_name = this.form.value.first_name;
        user.last_name = this.form.value.last_name;
        user.username = this.form.value.username;
        user.email = this.form.value.email;
        user.role = this.form.value.role;

        if (this.id) {
            user.id = Number(this.id);
            this.store.dispatch(AdminActions.editUser({ user }));
        } else {
            this.store.dispatch(AdminActions.addUser({ user }));
        }


        // this.store.dispatch(AdminActions.editUser({ user: this.form.value }));
        // this.saveUser()
        //     .pipe(first())
        //     .subscribe({
        //         next: () => {
        //             this.alertService.success('User saved', { keepAfterRouteChange: true });
        //             this.router.navigateByUrl('/');
        //         },
        //         error: error => {
        //             this.alertService.error(error);
        //             this.submitting = false;
        //         }
        //     })
    }

    resetPassword() {

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.submitted = false;

        this.submittingResetPassword = true;
        const user = new User();
        user.first_name = this.form.value.first_name;
        user.last_name = this.form.value.last_name;
        user.username = this.form.value.username;
        user.email = this.form.value.email;
        user.role = this.form.value.role;
        if (this.id) {
            user.id = Number(this.id);
            this.store.dispatch(AdminActions.resetPassword({ user }));
        }

    }

    // private saveUser() {
    //     // create or update user based on id param
    //     return this.id
    //         ? this.accountService.update(this.id!, this.form.value)
    //         : this.accountService.register(this.form.value);
    // }
}