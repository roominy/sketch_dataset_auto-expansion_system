import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { selectIsLoginLoading, selectUser } from '@app/stores/auth/auth.selectors';
import { User } from '@app/_models';
import { register } from '@app/stores';




@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    user?: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private store: Store<AuthStoreModule>
    ) { 

        this.store.select(selectIsLoginLoading).subscribe(isLoading => (this.loading = isLoading));
        // this.user$ =  this.store.select(selectUser);
        this.store.select(selectUser).subscribe(user => (this.user = user));
        
    }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
        let pass = group.get('password')?.value;
        let confirmPass = group.get('confirm_password')?.value
        return pass === confirmPass ? null : { notSame: true }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [, Validators.required,Validators.email]],
            role: ['user', Validators.required],
            password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
            confirm_password: ['', [Validators.required]],
           
        }, { validators: this.checkPasswords });
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
        
        this.form.value.password = btoa(this.form.value.password);
        
        this.store.dispatch(register({ user: this.form.value })); 
    }

    // onSubmit() {
    //     this.submitted = true;

    //     // reset alerts on submit
    //     this.alertService.clear();

    //     // stop here if form is invalid
    //     if (this.form.invalid) {
    //         return;
    //     }
    
    //     this.form.value.password = btoa(this.form.value.password);
    

    //     this.loading = true;
    //     this.accountService.register(this.form.value)
    //         .pipe(first())
    //         .subscribe({
    //             next: () => {
    //                 this.alertService.success('Registration successful', { keepAfterRouteChange: true });
    //                 this.router.navigate(['../login'], { relativeTo: this.route });
    //             },
    //             error: error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             }
    //         });
    // }
}