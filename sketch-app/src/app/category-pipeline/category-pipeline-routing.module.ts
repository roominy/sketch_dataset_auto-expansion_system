import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { BaselineGroupComponent } from './baseline-group/baseline-group.component';
import { BaselineUploadComponent } from './baseline-upload/baseline-upload.component';
import { MetricConfigurationComponent } from './metric-configuration/metric-configuration.component';



const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'group', component: BaselineGroupComponent },
            { path: 'upload', component: BaselineUploadComponent },
            { path: 'configuration', component: MetricConfigurationComponent }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryPipelineRoutingModule { }
