import { Component, OnInit } from '@angular/core';
import { Category } from '@app/_models';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { first } from 'rxjs/operators';

import { AccountService, AlertService, CategoryService } from '@app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { Store } from '@ngrx/store';
import { selectCategory, selectCategories } from '@app/stores/app/app.selectors';
import { categoryStatusChange, editCategory } from '@app/stores/app/app.actions';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as AppActions from '@app/stores/app/app.actions';


export class Status {
  label: string | undefined;
  name: string | undefined;
}

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.less']
})
export class EditCategoryComponent implements OnInit {
  form!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submittingEdit = false;
  submittingStatEdit = false;
  submitted = false;
  category?: Category;
  categories?: Category[];
  private actionsSubscription?: Subscription;

  status: Status[] = [
    { label: "Active", name: 'active' },
    { label: "Inactive", name: 'inactive' }
 ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private categoryService: CategoryService,
    private alertService: AlertService,
    private appStore: Store<AppStoreModule> ,
    private actions$: Actions

  ) { 
     
  }

  ngOnInit(): void {
    // this.setItems();
    
      this.form = this.formBuilder.group({
        category_id: ['', Validators.required],
        category_name: ['', Validators.required],
        category_label: ['', Validators.required],
        description: ['', Validators.required],
        status: ['', Validators.required],
      });

      this.appStore.select(selectCategory).subscribe(category => (this.category = category));
      

      this.form.patchValue({
        category_id: this.category?.category_id,
        category_name: this.category?.category_name,
        category_label: this.category?.category_label, 
        description: this.category?.description, 
        status: this.category?.status
      });

      this.form.get('category_id')?.disable();

      this.form.get('status')?.disable();


      this.actionsSubscription = merge(
        this.actions$.pipe(ofType(AppActions.editCategorySuccess)),
        this.actions$.pipe(ofType(AppActions.fetchCategoriesSuccess)),
        this.actions$.pipe(ofType(AppActions.fetchCategoriesFailure)),
        this.actions$.pipe(ofType(AppActions.editCategoryFailure)),
        this.actions$.pipe(ofType(AppActions.categoryStatusChangeSuccess)),
        this.actions$.pipe(ofType(AppActions.categoryStatusChangeFailure)),
      ).subscribe(action => {
        // Handle the success actions here
        // The logic here will execute for any of the actions defined above
        if (action.type === '[App] Edit Category Success' || action.type === '[App] Fetch Categories Success') {
          
          this.submittingEdit = false;
          this.submittingStatEdit = false;
          this.appStore.select(selectCategories).subscribe(categories => (this.categories = categories));
          
          // categories?.find((category: Category) => {
          const category = this.categories?.find(x => x.category_id === this.category?.category_id);
        
          this.form.patchValue({
            category_id: category?.category_id,
            category_name: category?.category_name,
            category_label:category?.category_label, 
            description: category?.description, 
            status: category?.status
          });

          this.appStore.dispatch(AppActions.setCategory({ category: category||new Category()}));

        } else {
          this.submittingEdit = false;
          this.submittingStatEdit = false;
        }
      });

      
      

     
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {

    // this.appStore.select(selectIsCategoryLoading).subscribe(isLoading => (this.submittingEdit = isLoading));
    
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.submitted = false;
    this.submittingEdit = true;

    let updatedcategory =  new Category();
    updatedcategory.category_id = this.form.get('category_id')?.value;
    updatedcategory.category_name = this.form.get('category_name')?.value;
    updatedcategory.category_label = this.form.get('category_label')?.value;
    updatedcategory.description = this.form.get('description')?.value;
    updatedcategory.status = this.form.get('status')?.value;
    
    this.appStore.dispatch(editCategory({ category : updatedcategory }));
    // this.categoryService.addCategory(this.form.value)
    //     .pipe(first())
    //     .subscribe({
    //         next: () => {
    //             this.alertService.success('Category Created.', { keepAfterRouteChange: true });
    //             this.router.navigateByUrl('/');
    //         },
    //         error: error => {
    //             this.alertService.error(error);
    //             this.submittingEdit = false;
    //         }
    //     })
  }

  // async setItems(){
  //   const fetchedCategory = await this.categoryService.getCategory();
  //   this.category = fetchedCategory || undefined;
  //   this.form.get('category_id')?.setValue(this.category?.category_id);
  //   this.form.get('category_name')?.setValue(this.category?.category_name);
  //   this.form.get('category_label')?.setValue(this.category?.category_label);
  //   this.form.get('description')?.setValue(this.category?.description);
  //   this.form.get('status')?.setValue(this.category?.status);
   
  // }

  updateCategoryStatus(){
    // this.appStore.select(selectIsCategoryLoading).subscribe(isLoading => (this.submittingStatEdit = isLoading));
    this.submitted = true;
    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
    
    let category = new Category();
    category.category_id = this.category?.category_id;
    category.category_name = this.form.value.category_name;
    category.category_label = this.form.value.category_label;
    category.description = this.form.value.description;
    category.status = this.category?.status;
    


    // reset alerts on submit
    this.alertService.clear();
    // this.form.value.category_id = this.category?.category_id;
    // this.form.value.status = this.category?.status;
    
    
    this.appStore.dispatch(categoryStatusChange({category: category}));

    
  }

}
