import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { login } from '@app/stores/auth/auth.actions';
import { selectIsLoginLoading ,selectUser} from '@app/stores/auth/auth.selectors';
import { AuthStoreModule } from '@app/stores';


import { AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    user:any;

    constructor(
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private store: Store<AuthStoreModule>
    ) {
        this.store.select(selectIsLoginLoading).subscribe(isLoading => (this.loading = isLoading));
        // this.user$ =  this.store.select(selectUser);
        this.store.select(selectUser).subscribe(user => (this.user = user));
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

   
    
    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.store.dispatch(login({ username: this.f.username.value, password: this.f.password.value }));
    }

    // onSubmit() {
        
    //     this.submitted = true;
    //     // reset alerts on submit
    //     this.alertService.clear();

    //     // stop here if form is invalid
    //     if (this.form.invalid) {
    //         return;
    //     }

    //     this.loading = true;
    //     this.accountService.login(this.f.username.value, this.f.password.value)
    //         .pipe(first())
    //         .subscribe({
    //             next: () => {
    //                 // get return url from query parameters or default to home page
    //                 const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //                 this.router.navigateByUrl(returnUrl);
    //             },
    //             error: error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             }
    //         });
    // }
}