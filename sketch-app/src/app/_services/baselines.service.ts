import { Injectable, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { BaselineGroup, BaselineGroupSketches, PipelineConfiguration } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class BaselinesService {
    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    // BaselineGroup
    addBaselineGroup(baseline: BaselineGroup) {
        
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/addBaselineGroup`, baseline);
    }

    fetchBaselineGroups(categoryId: number){
        
        return this.http.get<BaselineGroup[]>(`${environment.apiUrl}/data_admin/dataset/getBaselineGroups?categoryId=${categoryId}`);
    }

    deleteBaselineGroup(baselineGroupId: number) {
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/deleteBaselineGroup?groupId=${baselineGroupId}`);
    }

    // BaselineGroupSketch
    addBaselineGroupSketches(baselineGroupSketches: BaselineGroupSketches) {
        
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/addBaslineGroupSketches`, baselineGroupSketches);
    }

    fetchBaselineGroupSketches(baselineGroupId: number){
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/getBaselineGroupSketches?groupId=${baselineGroupId}`);
    }

    deleteBaselineGroupSketch(baselineId: number) {
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/deleteBaselineGroupSketch?baselineId=${baselineId}`);
    }

    // PipelineConfigurations
    fetchPipelineConfigurations(categoryId: number){
        
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/getPipelineConfigurations?categoryId=${categoryId}`);
    }

    addPipelineConfiguration(pipelineConfiguration: PipelineConfiguration) {
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/addPipelineConfiguration`, pipelineConfiguration);
    }

    changePipelineConfigurationStatus(categoryId: number, configurationId: number) {
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/changePipelineConfigurationStatus?categoryId=${categoryId}&configurationId=${configurationId}`);
    }
    
    // PipelineResults
    getPipelineResults(configurationId: number) {
        return this.http.get(`${environment.apiUrl}/data_admin/dataset/getPipelineResult?configurationId=${configurationId}`);
    }
    
}