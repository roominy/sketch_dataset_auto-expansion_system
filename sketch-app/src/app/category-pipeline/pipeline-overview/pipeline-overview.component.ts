import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/_services';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { selectCategory, selectPipelineConfigurations, selectPipelineResults } from '@app/stores/app/app.selectors';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {Category, PipelineResult, PipelineConfiguration } from '@app/_models';
import { Subscription, merge } from 'rxjs';
import * as AppActions from '@app/stores/app/app.actions';

@Component({
  selector: 'app-pipeline-overview',
  templateUrl: './pipeline-overview.component.html',
  styleUrls: ['./pipeline-overview.component.less']
})
export class PipelineOverviewComponent implements OnInit {

  form!: FormGroup;
  category?: Category;
  pipelineConfigurations: PipelineConfiguration[] = [];
  pipelineResults: PipelineResult[] = [];

  selectedResult?: PipelineResult;

  submitting = false;
  submitted = false;
  loading = false;
  preview = false;
  private actionsSubscription?: Subscription;

  constructor(private alertService: AlertService,
    private formBuilder: FormBuilder,
    private appStore: Store<AppStoreModule>,
    private actions$: Actions,) { }

  ngOnInit(): void {

    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
    

    this.appStore.select(selectPipelineConfigurations).subscribe(pipelineConfigurations => (this.pipelineConfigurations = pipelineConfigurations));

    this.appStore.select(selectPipelineResults).subscribe(pipelineResults => (this.pipelineResults = pipelineResults));

    this.actionsSubscription = merge(
      this.actions$.pipe(ofType(AppActions.fetchPipelineResultsSuccess)),
      this.actions$.pipe(ofType(AppActions.fetchPipelineResultsFailure)),
    ).subscribe(action => {
      // Handle the success actions here
      // The logic here will execute for any of the actions defined above
      if (action.type === '[App] Fetch Pipeline Results Success') {
        
        this.alertService.clear();
        this.submitting = false;
      } else {
        this.submitting = false;
      }
    });

    this.form = this.formBuilder.group({
      pipeline_configuration: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.preview = false;
    this.alertService.clear();
    this.submitted = true;
    if (this.form.invalid) {
      this.submitting = false;
      this.alertService.error('Please select a pipeline.',{ keepAfterRouteChange: true });
      return;
    }
    let configurationId = this.form.value.pipeline_configuration;
    this.submitting = true;

    this.appStore.dispatch(AppActions.fetchPipelineResults({configurationId: configurationId}));
  }

  previewSketch(result:PipelineResult): void {
    this.preview = true;
    this.selectedResult = result;
  }

  ngOnDestroy(): void {
    this.actionsSubscription?.unsubscribe();
    this.appStore.dispatch(AppActions.emptyPipelineResultsState());

  }



}
