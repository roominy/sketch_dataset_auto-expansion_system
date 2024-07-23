import { Component, OnInit ,  OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '@app/_models';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { deactivateAccount, updateProfile, fetchProfile} from '@app/stores/auth/auth.actions';
import { isDeactivateLoading, isUpdateLoading, selectUser } from '@app/stores/auth/auth.selectors';
import { HelperService } from '@app/_services';
import * as AuthActions  from '@app/stores/auth/auth.actions';

import { Actions, ofType } from '@ngrx/effects';
import { merge, Subscription } from 'rxjs'

export class Roles {
  label: string | undefined;
  name: string | undefined;
  }

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit, OnDestroy {

  
    private actionsSubscription?: Subscription;
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submittingUpdate = false;
    submittingDeactivate = false;
    submitted = false;
    roles: Roles[] = [
        { label: "User", name: 'user' },
        { label: "Dataset Admin", name: 'data_admin' },
        { label: "Admin", name: 'admin' }
     ];

     user?: User;

    constructor(
        private formBuilder: FormBuilder,
        private authstore: Store<AuthStoreModule>,
        private route: ActivatedRoute,
        private router: Router,
        private helperService: HelperService,
        private actions$: Actions
        // private accountService: AccountService,  
        // private authActions: authActions  
      

    ) { }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
      let pass = group.get('password')?.value;
      let confirmPass = group.get('confirm_password')?.value
      return pass === confirmPass ? null : { notSame: true }
  }

    ngOnInit() {

      this.id = this.route.snapshot.params['id'];

        // form with validation rules
      this.form = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        username: ['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        // password only required in add mode
        password: ['', [...(!this.user?.id ? [ Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')] : [])]],
        confirm_password: ['', []],
           
      }, { validators: this.checkPasswords });

      this.authstore.select(selectUser).subscribe(user => (this.user = user));

      this.actionsSubscription = merge(
        this.actions$.pipe(ofType(AuthActions.deactivateAccountSuccess)),
        this.actions$.pipe(ofType(AuthActions.updateProfileSuccess)),
        this.actions$.pipe(ofType(AuthActions.fetchProfileSuccess)),
        this.actions$.pipe(ofType(AuthActions.deactivateAccountFailure)),
        this.actions$.pipe(ofType(AuthActions.updateProfileFailure)),
        this.actions$.pipe(ofType(AuthActions.fetchProfileFailure)),
        // Add more actions here as needed
      ).subscribe(action => {
        // Handle the success actions here
        // The logic here will execute for any of the actions defined above
        if (action.type === '[Profile] Deactivate Account Success') {
          
          this.submittingDeactivate = false;
          // Handle add category success
        } else if (action.type === '[Profile] Update Profile Success') {
          
          this.submittingUpdate = false;
          // Handle edit category success
        } else if (action.type === '[Profile] Fetch Profile Success') {
          
          this.submittingUpdate = false;
          this.form.patchValue({
            first_name: this.user?.first_name,
            last_name: this.user?.last_name,
            username: this.user?.username, 
            email: this.user?.email, 
            role: this.user?.role
          });
        } else {
          this.submittingUpdate = false;
          this.submittingDeactivate = false;
        }
      });


        
        // this.authstore.select(isUpdateLoading).subscribe(isLoading => (this.submittingUpdate = isLoading));
        // this.authstore.select(isDeactivateLoading).subscribe(isLoading => (this.submittingDeactivate = isLoading));
        

        this.form.patchValue({
          first_name: this.user?.first_name,
          last_name: this.user?.last_name,
          username: this.user?.username, 
          email: this.user?.email, 
          role: this.user?.role
        });

        this.form.get('username')?.disable();

        this.form.get('role')?.disable();

      }

      ngOnDestroy() {
        if (this.actionsSubscription) {
        this.actionsSubscription.unsubscribe();
        }
      }

      // convenience getter for easy access to form fields
      get f() { return this.form.controls; }

      onSubmit() { 

        ;
        this.submitted = true;

        if (this.form.invalid) {
          return;
        }

        this.submitted = false;
        // this.authstore.select(isUpdateLoading).subscribe(isLoading => (this.submittingUpdate = isLoading));
        this.submittingUpdate = true;
        if (!(this.form.value.password === '')) {
          this.form.value.password = btoa(this.form.value.password);
        }
        
        // this.form.value.username = this.user?.username;
        // this.form.value.role = this.user?.role;
        // // this.submittingUpdate = true;
        const user = new User();
        user.id = this.user?.id;
        user.username = this.user?.username;
        user.role = this.user?.role;
        user.first_name = this.form.value.first_name;
        user.last_name = this.form.value.last_name;
        user.email = this.form.value.email;
        user.password = this.form.value.password;



        

        

        // this.authstore.dispatch(updateProfile({user:user}));

        this.authstore.dispatch(AuthActions.updateProfile({user:user}));
        
        
        
      }

      deactivateAccount() {

        

        this.submitted = true;

        if (this.form.invalid) {
          return;
        }

        this.submitted = false;
        // this.authstore.select(isDeactivateLoading).subscribe(isLoading => (this.submittingDeactivate = isLoading));
        this.submittingDeactivate = true;
        // this.form.get('username')?.disable();

        // this.form.get('role')?.enable();
        // this.form.value.username = this.user?.username;
        // this.form.value.role = this.user?.role;
        const user = new User();
        user.id = this.user?.id;
        user.username = this.user?.username;
        user.role = this.user?.role;
        user.first_name = this.form.value.first_name;
        user.last_name = this.form.value.last_name;
        user.email = this.form.value.email;
        

        this.authstore.dispatch(deactivateAccount({user:user}));
        
        // this.submittingDeactivate = true;


      }

      refreshProfile(){

        

        this.authstore.dispatch(fetchProfile());
        this.helperService.reloadCurrentRoute();


        
      }
}


