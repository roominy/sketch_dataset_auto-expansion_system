import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {  fetchCategories, fetchCategoriesSuccess, fetchCategoriesFailure, 
            editCategory , editCategoryFailure, editCategorySuccess,
            addCategory, addCategoryFailure, addCategorySuccess,
            categoryStatusChange, categoryStatusChangeFailure,  categoryStatusChangeSuccess,
          submitSketch, submitSketchFailure, submitSketchSuccess,
            addBaselineGroup, addBaselineGroupFailure, addBaselineGroupSuccess,
            fetchBaselineGroups, fetchBaselineGroupsFailure, fetchBaselineGroupsSuccess,
            deleteBaselineGroup, deleteBaselineGroupFailure, deleteBaselineGroupSuccess,
            addBaselineGroupSketches, addBaselineGroupSketchesFailure, addBaselineGroupSketchesSuccess,
            fetchBaselineGroupSketches, fetchBaselineGroupSketchesFailure, fetchBaselineGroupSketchesSuccess,
            deleteBaselineGroupSketch, deleteBaselineGroupSketchFailure, deleteBaselineGroupSketchSuccess,
            addPipelineConfiguration, addPipelineConfigurationSuccess, addPipelineConfigurationFailure,
            fetchPipelineConfigurations, fetchPipelineConfigurationsSuccess, fetchPipelineConfigurationsFailure,
            changePipelineConfigurationStatus, changePipelineConfigurationStatusSuccess, changePipelineConfigurationStatusFailure,
            fetchPipelineResults, fetchPipelineResultsSuccess, fetchPipelineResultsFailure
        } from '@app/stores/app/app.actions';
import { CategoryService, AlertService, SketchService,BaselinesService } from '@app/_services';
import { Category, User } from '@app/_models'; // Add the import statement for User

@Injectable()

export class AppEffects {
    fetchCategoties$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchCategories),
            switchMap(() =>
                this.categoryService.fetchCategories().pipe(
                    map((categories ) => fetchCategoriesSuccess({ categories })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchCategoriesFailure({ error }));
                    })
                )
            )
        )
    );


    editCategoty$ = createEffect(() =>
        this.actions$.pipe(
            ofType(editCategory),
            switchMap(({category}) =>
                this.categoryService.editCategory(category).pipe(
                    map(() => fetchCategories() ),
                    tap(() => {
                        // this.router.navigate(['/']);
                        this.alertService.success('Category updated successfully.',{ keepAfterRouteChange: true });    
                    }),
                    tap(() => {
                       
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(editCategoryFailure({ error }));
                    })
                )
            )
        )
    );


    addCategoty$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addCategory),
            switchMap(({category}) =>
                this.categoryService.addCategory(category).pipe(
                    map(() => fetchCategories()),
                    tap(() => {
                        this.router.navigate(['/']);
                        this.alertService.success('Category added successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(addCategoryFailure({ error }));
                    })
                )
            )
        )
    );

    changeCategoryStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(categoryStatusChange),
            switchMap(({category}) =>
                this.categoryService.changeCategoryStatus(category).pipe(
                    map(() => fetchCategories()),
                    tap(() => {
                        // this.router.navigate(['/']);
                        this.alertService.success('Category status changed successfully', { keepAfterRouteChange: true });
                        
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(categoryStatusChangeFailure({ error }));
                    })
                )
            )
        )
    );

    //  SketchSubmition effects

    submitSketch$ = createEffect(() =>
        this.actions$.pipe(
            ofType(submitSketch),
            switchMap(({sketch}) =>
                this.sketchService.submitSketch(sketch).pipe(
                    map(() => submitSketchSuccess()),
                    tap(() => {
                        this.alertService.success('Sketch submitted successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(submitSketchFailure({ error }));
                    })
                )
            )
        )
    );

    // BaselineGroups effects

    fetchBaselineGroups$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchBaselineGroups),
            switchMap(({categoryId}) =>
                this.baselinesService.fetchBaselineGroups(categoryId).pipe(
                    map((baselineGroups ) => fetchBaselineGroupsSuccess({ baselineGroups })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchBaselineGroupsFailure({ error }));
                    })
                )
            )
        )
    );

    addBaselineGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addBaselineGroup),
            switchMap(({baselineGroup}) =>
                this.baselinesService.addBaselineGroup(baselineGroup).pipe(
                    // map(() => fetchBaselineGroups({ category: baselineGroup.category }) ),
                    map(() => fetchBaselineGroups({ categoryId: baselineGroup?.category_id}) ),
                    tap(() => {
                        this.alertService.success('Baseline Group added successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(addCategoryFailure({ error }));
                    })
                )
            )
        )
    );

    deleteBaselineGroup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteBaselineGroup),
            switchMap(({groupId, categoryId}) =>
                this.baselinesService.deleteBaselineGroup(groupId).pipe(
                    map(() => fetchBaselineGroups({ categoryId: categoryId })),
                    tap(() => {
                        this.alertService.success('Baseline Group deleted successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(deleteBaselineGroupFailure({ error }));
                    })
                )
            )
        )
    );

    // BaselineGroupSketches effects

    addBaselineGroupSketches$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addBaselineGroupSketches),
            switchMap(({BaselineGroupSketches}) =>
                this.baselinesService.addBaselineGroupSketches(BaselineGroupSketches).pipe(
                    map(() => addBaselineGroupSketchesSuccess()),
                    tap(() => {
                        this.alertService.success('Sketches added to Baseline Group successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(addBaselineGroupSketchesFailure({ error }));
                    })
                )
            )
        )
    );

    fetchBaselineGroupSketches$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchBaselineGroupSketches),
            switchMap(({groupId}) =>
                this.baselinesService.fetchBaselineGroupSketches(groupId).pipe(
                    map((baselineGroupSketches ) => fetchBaselineGroupSketchesSuccess({ baselineGroupSketches })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchBaselineGroupSketchesFailure({ error }));
                    })
                )
            )
        )
    );

    deleteBaselineGroupSketch$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteBaselineGroupSketch),
            switchMap(({groupId, baselineId}) =>
                this.baselinesService.deleteBaselineGroupSketch(baselineId).pipe(
                    map(() => fetchBaselineGroupSketches({ groupId: groupId })),
                    tap(() => {
                        this.alertService.success('Sketch deleted successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(deleteBaselineGroupSketchFailure({ error }));
                    })
                )
            )
        )
    );

    // PipelineConfigurations effects

    fetchPipelineConfigurations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPipelineConfigurations),
            switchMap(({categoryId}) =>
                this.baselinesService.fetchPipelineConfigurations(categoryId).pipe(
                    map((pipelineConfigurations ) => fetchPipelineConfigurationsSuccess({ pipelineConfigurations })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchPipelineConfigurationsFailure({ error }));
                    })
                )
            )
        )
    );

    addPipelineConfiguration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addPipelineConfiguration),
            switchMap(({pipelineConfiguration}) =>
                this.baselinesService.addPipelineConfiguration(pipelineConfiguration).pipe(
                    map(() => fetchPipelineConfigurations({categoryId: pipelineConfiguration.category_id}) ),
                    tap(() => {
                        this.alertService.success('Pipeline Configuration added successfully.',{ keepAfterRouteChange: true });
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(addPipelineConfigurationFailure({ error }));
                    })
                )
            )
        )
    );

    changePipelineConfigurationStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(changePipelineConfigurationStatus),
            switchMap(({configurationId, categoryId}) =>
                this.baselinesService.changePipelineConfigurationStatus(categoryId, configurationId).pipe(
                    map(() => fetchPipelineConfigurations({categoryId: categoryId})),
                    tap(() => {
                        this.alertService.success('Pipeline Configuration status changed successfully', { keepAfterRouteChange: true });
                        
                    }),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(changePipelineConfigurationStatusFailure({ error }));
                    })
                )
            )
        )
    );

    // PipelineResults effects
    fetchPipelineResults$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPipelineResults),
            switchMap(({configurationId}) =>
                this.baselinesService.getPipelineResults(configurationId).pipe(
                    map((pipelineResults ) => fetchPipelineResultsSuccess({ pipelineResults })),
                    catchError(error => { 
                        this.alertService.error(error); 
                        return of(fetchPipelineResultsFailure({ error }));
                    })
                )
            )
        )
    );

     

    constructor(private actions$: Actions, private categoryService: CategoryService,
        private route: ActivatedRoute, private alertService: AlertService, 
        private router: Router, private sketchService : SketchService,
        private baselinesService: BaselinesService) {}

}