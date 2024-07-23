import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/_services';
import { BaselineGroup, Category } from '@app/_models';
import { selectCategory, selectBaselineGroups  } from '@app/stores/app/app.selectors';
import { fetchBaselineGroups, addBaselineGroup, deleteBaselineGroup , fetchPipelineConfigurations } from '@app/stores/app/app.actions';
import { Store } from '@ngrx/store';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as AppActions from '@app/stores/app/app.actions';
import { AppStoreModule } from '@app/stores/app/app-store.module';

@Component({
  selector: 'app-baseline-group',
  templateUrl: './baseline-group.component.html',
  styleUrls: ['./baseline-group.component.less']
})
export class BaselineGroupComponent implements OnInit {

  form!: FormGroup;
  id?: string;
  submitting = false;
  submitted = false;
  loading = false;
  deleting = false;

  category?: Category = new Category();
  baselineGroups: BaselineGroup[] = [];
  private actionsSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder,
    private alertService: AlertService,
    private appStore: Store<AppStoreModule> ,
    private actions$: Actions,) { 


    
  }

  ngOnInit(): void {

    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
      
    

      if(this.category){
        this.appStore.dispatch(fetchBaselineGroups({categoryId: this.category.category_id}));
        this.appStore.dispatch(fetchPipelineConfigurations({categoryId: this.category.category_id}));
      }

      this.appStore.select(selectBaselineGroups).subscribe(baselineGroups => (this.baselineGroups = baselineGroups));
      

    this.form = this.formBuilder.group({
      group_name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.actionsSubscription = merge(
      this.actions$.pipe(ofType(AppActions.addBaselineGroupSuccess)),
      this.actions$.pipe(ofType(AppActions.addBaselineGroupFailure)),
      this.actions$.pipe(ofType(AppActions.fetchBaselineGroupsSuccess)),
      this.actions$.pipe(ofType(AppActions.fetchBaselineGroupsFailure)),
    ).subscribe(action => {
      // Handle the success actions here
      // The logic here will execute for any of the actions defined above
      if (action.type === '[App] Fetch Baseline Groups Success' || action.type === '[App] Add Baseline Group Success') {
        
        this.deleting = false;
        this.submitting = false;
        this.resetForm();
      } else {
        this.deleting = false;
        this.submitting = false;
      }
    });


  }

  resetForm() {
    this.alertService.clear();
    this.submitted = false;
    this.form.reset();

  }
  
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  deleteGroup(group : BaselineGroup) {
    this.alertService.clear();
    this.deleting = true;
    this.appStore.dispatch(deleteBaselineGroup({groupId: group.baseline_group_id, categoryId: this.category?.category_id}));
    // group.isDeleting = true;
    // this.baselineGroups = this.baselineGroups.filter(x => x.group_id !== group.group_id);
    // group.isDeleting = false;
  }



  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.submitting = true;
    let baselineGroup = new BaselineGroup();
    baselineGroup.group_name = this.form.get('group_name')?.value;
    baselineGroup.description = this.form.get('description')?.value;
    baselineGroup.category_id = this.category?.category_id;
    this.appStore.dispatch(addBaselineGroup({baselineGroup}));
    
  }

  onNGDestroy(): void {
    this.alertService.clear();
    
  }

}
