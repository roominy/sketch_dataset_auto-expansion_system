import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoryPipelineRoutingModule } from './category-pipeline-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { BaselineGroupComponent } from './baseline-group/baseline-group.component';
import { BaselineUploadComponent } from './baseline-upload/baseline-upload.component';
import { MetricConfigurationComponent } from './metric-configuration/metric-configuration.component';
import { PipelineOverviewComponent } from './pipeline-overview/pipeline-overview.component';
import { BaselineViewComponent } from './baseline-view/baseline-view.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryPipelineRoutingModule,
    FormsModule,
    MatSelectModule
  ],
  declarations: [
    LayoutComponent,
    BaselineGroupComponent,
    BaselineUploadComponent,
    MetricConfigurationComponent,
    PipelineOverviewComponent,
    BaselineViewComponent
  ]
})
export class CategoryPipelineModule { }
