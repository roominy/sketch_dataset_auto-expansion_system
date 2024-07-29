import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaselineGroup, Category, PipelineConfiguration } from '@app/_models';
import { AlertService } from '@app/_services';
import { selectBaselineGroups, selectCategory, selectPipelineConfigurations } from '@app/stores/app/app.selectors';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { Subscription, merge, pipe } from 'rxjs';
import * as AppActions from '@app/stores/app/app.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-metric-configuration',
  templateUrl: './metric-configuration.component.html',
  styleUrls: ['./metric-configuration.component.less']
})
export class MetricConfigurationComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  baselineGroups: BaselineGroup[]  = []; 
  baselineGroup = 'baselineGroup'.toString();
  threshold = 'threshold'.toString();
  category?: Category;
  pipelineConfigurations: PipelineConfiguration[] = [];

  thresholds = [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];


  submitted = false;
  submitting = false;
  loading = false;
  activate = false;
  changingStatus = false;
  private actionsSubscription?: Subscription;

  configurationName = new String('');
  separator = '_'.toString();
  

  constructor(private alertService: AlertService,
              private formBuilder: FormBuilder,
              private appStore: Store<AppStoreModule>,
              private actions$: Actions,
  ) { }

  ngOnInit(): void {

    

    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
    

    let category_name = this.category?.category_name||'category';

    this.configurationName = this.configurationName.concat(category_name, this.separator, this.baselineGroup, this.separator, this.threshold);

    this.appStore.select(selectBaselineGroups).subscribe(baselineGroups => (this.baselineGroups = baselineGroups));
    

    this.appStore.select(selectPipelineConfigurations).subscribe(pipelineConfigurations => (this.pipelineConfigurations = pipelineConfigurations));
    

    this.actionsSubscription = merge(
      this.actions$.pipe(ofType(AppActions.addPipelineConfigurationSuccess)),
      this.actions$.pipe(ofType(AppActions.addPipelineConfigurationFailure)),
      this.actions$.pipe(ofType(AppActions.fetchPipelineConfigurationsSuccess)),
      this.actions$.pipe(ofType(AppActions.fetchPipelineConfigurationsFailure)),
      this.actions$.pipe(ofType(AppActions.changePipelineConfigurationStatusSuccess)),
      this.actions$.pipe(ofType(AppActions.changePipelineConfigurationStatusFailure)

    )
    ).subscribe(action => {
      // Handle the success actions here
      // The logic here will execute for any of the actions defined above
      if (action.type === '[App] Add Pipeline Configuration Success' || action.type === '[App] Fetch Pipeline Configurations Success') {
        
        // this.alertService.clear();
        this.submitting = false;
        this.resetForm();
      } else if (action.type === '[App] Change Pipeline Configuration Status Success' || action.type === '[App] Change Pipeline Configuration Status Failure'){
        this.changingStatus = false;
      } else if (action.type === '[App] Add Pipeline Configuration Failure'){
        this.submitting = false;
      } else {
        this.submitting = false;
        this.changingStatus = false;
      }
    });


    this.form = this.formBuilder.group({
      configuration_name: ['', Validators.required],
      baseline_group: ['', Validators.required],
      threshold: ['', Validators.required],
    });
  }

  onBaselineGroupChange(baselineGroupid: any) {

    
    
    let baselineGroup = this.baselineGroups.find(baseline => baseline.baseline_group_id?.toString() == baselineGroupid.target.value.toString() );
    
    this.baselineGroup = baselineGroup?.group_name ||'baselineGroup';


    this.configurationName = new String('');
    let category_name = this.category?.category_name||'category';
    this.configurationName = this.configurationName.concat(category_name, this.separator, this.baselineGroup, this.separator, this.threshold);
  }
  onThresholdChange(threshold: any) {

    
    this.threshold = threshold.target.value.toString();
    this.configurationName = new String('');
    let category_name = this.category?.category_name||'category';
    this.configurationName = this.configurationName.concat(category_name, this.separator, this.baselineGroup, this.separator, this.threshold);
  }

  resetForm() {
    
    this.configurationName = new String('');
    // this.alertService.clear();
    this.submitted = false;
    this.form.reset();
    this.baselineGroup = 'baselineGroup'.toString();
    this.threshold = 'threshold'.toString();
    let category_name = this.category?.category_name||'category';
    this.configurationName = this.configurationName.concat(category_name, this.separator, this.baselineGroup, this.separator, this.threshold);

  }

  get f() { return this.form.controls; }

  onSubmit(): void {


    this.alertService.clear();
    
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    
    this.submitting = true;
    

    let pipelineConfiguration = new PipelineConfiguration();
    pipelineConfiguration.category_id = this.category?.category_id;
    pipelineConfiguration.configuration_name = this.form.get('configuration_name')?.value;
    pipelineConfiguration.baseline_group_id = Number(this.form.get('baseline_group')?.value);
    pipelineConfiguration.threshold = Number(this.form.get('threshold')?.value);

    
    this.appStore.dispatch(AppActions.addPipelineConfiguration({pipelineConfiguration: pipelineConfiguration}));
  }

  changingConfigurationStatus(configuration: any){
    this.alertService.clear();
    this.changingStatus = true;
    this.appStore.dispatch(AppActions.changePipelineConfigurationStatus({ configurationId: configuration.configuration_id , categoryId: this.category?.category_id}));
  }

  ngOnDestroy(): void {
    this.alertService.clear();
    this.actionsSubscription?.unsubscribe();
    
  }

 

}
