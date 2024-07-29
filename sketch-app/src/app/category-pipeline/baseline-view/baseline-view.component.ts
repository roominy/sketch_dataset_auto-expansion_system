import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaselineGroup, BaselineGroupSketches, Category, BaselineSketch } from '@app/_models';
import { selectBaselineGroups, selectCategory, selectBaselineGroupSketches } from '@app/stores/app/app.selectors';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { Subscription, merge } from 'rxjs';
import * as AppActions from '@app/stores/app/app.actions';
import { Actions, ofType } from '@ngrx/effects';
import { AlertService } from '@app/_services';

@Component({
  selector: 'app-baseline-view',
  templateUrl: './baseline-view.component.html',
  styleUrls: ['./baseline-view.component.less']
})
export class BaselineViewComponent implements OnInit, OnDestroy {

  category?: Category;

  seletGroupForm!: FormGroup;
  baselineGroups: BaselineGroup[]  = [];
  baselineGroupSketches?: BaselineGroupSketches ;
  selectedBaselineSketch?: BaselineSketch;
  baselineGroupId?: number;
  // baselineGroups: BaselineGroup[]  = [{'group_id': 1, 'group_name': 'Baseline Group 1', 'description': 'This is the first baseline group'},
  // {'group_id': 2, 'group_name': 'Baseline Group 2', 'description': 'This is the second baseline group'},
  // {'group_id': 3, 'group_name': 'Baseline Group 3', 'description': 'This is the third baseline group'},
  // {'group_id': 4, 'group_name': 'Baseline Group 4', 'description': 'This is the fourth baseline group'},
  // {'group_id': 5, 'group_name': 'Baseline Group 5', 'description': 'This is the fifth baseline group'}
  // ];
  preview = false;
  loading = false;
  submitting = false;
  submitted = false;
  deleting = false;
  private actionsSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder,
    private appStore: Store<AppStoreModule>,
    private actions$: Actions, 
    private alertService: AlertService,
  ) { 
    
  }

  ngOnInit(): void {


    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
      

      this.appStore.select(selectBaselineGroups).subscribe(baselineGroups => (this.baselineGroups = baselineGroups));
      

      this.appStore.select(selectBaselineGroupSketches).subscribe(baselineGroupSketches => (this.baselineGroupSketches = baselineGroupSketches));
      


      this.actionsSubscription = merge(
        this.actions$.pipe(ofType(AppActions.fetchBaselineGroupSketchesSuccess)),
        this.actions$.pipe(ofType(AppActions.fetchBaselineGroupSketchesFailure)),
      ).subscribe(action => {
        // Handle the success actions here
        // The logic here will execute for any of the actions defined above
        if (action.type === '[App] Fetch Baseline Group Sketches Success') {
          
          // this.alertService.clear();
          this.submitting = false;
          this.deleting = false;
        } else {
          this.submitting = false;
          this.deleting = false;
        }
      });


    this.seletGroupForm = this.formBuilder.group({
      baselines_group: ['', Validators.required]
    });
  }

  get f() { return this.seletGroupForm.controls; }

  onSubmit(): void {
    this.alertService.clear();
    
    this.preview = false;
    this.submitting = true;
    this.submitted = true;

    if (this.seletGroupForm.invalid) {
      this.submitting = false;
      this.alertService.error('Please select a basline group.');
      return;
    }

    this.baselineGroupId = this.seletGroupForm.value.baselines_group;

    


    this.appStore.dispatch(AppActions.fetchBaselineGroupSketches({groupId: this.baselineGroupId}));

    
  }

  previewBaseline(sketch: BaselineSketch): void {
    this.alertService.clear();
    this.preview = true;
    this.selectedBaselineSketch = sketch;
  }

  

  deleteGroup(sketch: BaselineSketch): void {
    this.alertService.clear();
    this.deleting = true;
    if (this.selectedBaselineSketch?.baseline_id === sketch.baseline_id) {
      this.preview = false;
    }

    this.appStore.dispatch(AppActions.deleteBaselineGroupSketch({groupId: this.baselineGroupId, baselineId: sketch.baseline_id}));
  }

  ngOnDestroy(): void {
    this.alertService.clear();
    
    this.appStore.dispatch(AppActions.emptyBaselineGroupSketchesState());
  }

}
