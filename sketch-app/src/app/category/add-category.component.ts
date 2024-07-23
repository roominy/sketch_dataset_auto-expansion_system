import { Component, OnInit, OnDestroy} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, CategoryService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { selectIsCategoryLoading } from '@app/stores/app/app.selectors';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { Store } from '@ngrx/store';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as AppActions from '@app/stores/app/app.actions';
import { Category } from '@app/_models';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.less']
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  id?: string;
  category_label!: string;
  loading = false;
  submitting = false;
  submitted = false;
  private actionsSubscription?: Subscription;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private store: Store<AppStoreModule>,
    private actions$: Actions
) { }
  

  ngOnInit(): void {
      this.form = this.formBuilder.group({
        category_name: ['', Validators.required],
        category_label: ['', Validators.required],
        description: ['', Validators.required],
      });

      this.actionsSubscription = merge(
        this.actions$.pipe(ofType(AppActions.addCategorySuccess)),
        this.actions$.pipe(ofType(AppActions.fetchCategoriesSuccess)),
        this.actions$.pipe(ofType(AppActions.fetchCategoriesFailure)),
        this.actions$.pipe(ofType(AppActions.addCategoryFailure)),
      ).subscribe(action => {
        // Handle the success actions here
        // The logic here will execute for any of the actions defined above
        if (action.type === '[App] Add Category Success' || action.type === '[App] Fetch Categories Success') {
          
          this.submitting = false;
          this.resetForm();
        } else {
          this.submitting = false;
        }
      });



      // this.store.select(selectIsCategoryLoading).subscribe(isLoading => (this.submitting = isLoading));
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

    this.submitting = true;
    let category = new Category();
    category.category_name = this.form.get('category_name')?.value;
    category.category_label = this.form.get('category_label')?.value;
    category.description = this.form.get('description')?.value;

    this.store.dispatch(AppActions.addCategory({category: category}));
    // this.categoryService.addCategory(this.form.value)
    //     .pipe(first())
    //     .subscribe({
    //         next: () => {
    //             this.alertService.success('Category Created.', { keepAfterRouteChange: true });
    //             this.router.navigateByUrl('/');
    //         },
    //         error: error => {
    //             this.alertService.error(error);
    //             this.submitting = false;
    //         }
    //     })
  }

  resetForm() {
    this.submitted = false;
    this.form.reset();

  }

  setName(value: any) {
    
    this.form.get('category_name')?.setValue(value?.toLowerCase());
  }

}
