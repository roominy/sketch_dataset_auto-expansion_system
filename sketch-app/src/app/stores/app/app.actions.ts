import { createAction, props } from '@ngrx/store';
import {BaselineGroup, Category, BaselineGroupSketches} from '@app/_models';

// Category actions
export const categorySelected = createAction(
  '[App] Select Category',
  props<{ category: Category }>()
);

export const categorySelectedSuccess = createAction(
  '[App] Select Category Success'
);

export const categorySelectedFailure = createAction(
  '[APP] Select Category Failure',
  props<{ error: string }>()
);

export const editCategory = createAction(
  '[App] Edit Category',
  props<{ category: Category }>()
);

export const editCategorySuccess = createAction(
    '[App] Edit Category Success'
);

export const editCategoryFailure = createAction(
    '[App] Edit Category Failure',
    props<{ error: string }>()
);

export const categoryStatusChange = createAction(
    '[App] Delete Category',
    props<{ category: any }>()
);

export const categoryStatusChangeSuccess = createAction(
    '[App] Delete Category Success'
);

export const categoryStatusChangeFailure = createAction(
    '[App] Delete Category Failure',
    props<{ error: string }>()
);

export const addCategory = createAction(
    '[App] Add Category',
    props<{ category: Category }>()
);

export const addCategorySuccess = createAction(
    '[App] Add Category Success'
);

export const addCategoryFailure = createAction(
    '[App] Add Category Failure',
    props<{ error: string }>()
);

export const fetchCategories = createAction(
    '[App] Fetch Categories'
);

export const fetchCategoriesSuccess = createAction(
    '[App] Fetch Categories Success',
    props<{ categories: Category[] }>()
);

export const fetchCategoriesFailure = createAction(
    '[App] Fetch Categories Failure',
    props<{ error: string }>()
);

export const cancelCategoryAction = createAction(
    '[App] Cancel Category Action'
);

export const setCategory = createAction(
    '[App] Set Category',
    props<{ category: Category }>()
);

export const submitSketch = createAction(
    '[App] Submit Sketch',
    props<{ sketch: any }>()
);

export const submitSketchSuccess = createAction(
    '[App] Submit Sketch Success'
);

export const submitSketchFailure = createAction(
    '[App] Submit Sketch Failure',
    props<{ error: string }>()
);

// BaselineGroups actions

export const addBaselineGroup = createAction(
    '[App] Add Baseline Group',
    props<{ baselineGroup: BaselineGroup }>()
);

export const addBaselineGroupSuccess = createAction(
    '[App] Add Baseline Group Success'
);

export const addBaselineGroupFailure = createAction(
    '[App] Add Baseline Group Failure',
    props<{ error: string }>()
);

export const fetchBaselineGroups = createAction(
    '[App] Fetch Baseline Groups',
    // props<{ category: any }>()
    props<{ categoryId: any }>()
);

export const fetchBaselineGroupsSuccess = createAction(
    '[App] Fetch Baseline Groups Success',
    props<{ baselineGroups: any }>()
);

export const fetchBaselineGroupsFailure = createAction(
    '[App] Fetch Baseline Groups Failure',
    props<{ error: string }>()
);

export const deleteBaselineGroup = createAction(
    '[App] Delete Baseline Group',
    props<{ groupId: any, categoryId: any }>()
);

export const deleteBaselineGroupSuccess = createAction(
    '[App] Delete Baseline Group Success'
);

export const deleteBaselineGroupFailure = createAction(
    '[App] Delete Baseline Group Failure',
    props<{ error: string }>()
);

// BaselineGroupSketches actions

export const addBaselineGroupSketches = createAction(
    '[App] Add Baseline Group Sketches',
    props<{BaselineGroupSketches: BaselineGroupSketches }>()

);

export const addBaselineGroupSketchesSuccess = createAction(
    '[App] Add Baseline Group Sketches Success'
);

export const addBaselineGroupSketchesFailure = createAction(
    '[App] Add Baseline Group Sketches Failure',
    props<{ error: string }>()
);

export const fetchBaselineGroupSketches = createAction(
    '[App] Fetch Baseline Group Sketches',
    props<{ groupId: any }>()
);

export const fetchBaselineGroupSketchesSuccess = createAction(
    '[App] Fetch Baseline Group Sketches Success',
    props<{ baselineGroupSketches: any }>()
);

export const fetchBaselineGroupSketchesFailure = createAction(
    '[App] Fetch Baseline Group Sketches Failure',
    props<{ error: string }>()
);

export const deleteBaselineGroupSketch = createAction(
    '[App] Delete Baseline Group Sketch',
    props<{ groupId: any; baselineId: any }>()
);

export const deleteBaselineGroupSketchSuccess = createAction(
    '[App] Delete Baseline Group Sketch Success'
);

export const deleteBaselineGroupSketchFailure = createAction(
    '[App] Delete Baseline Group Sketch Failure',
    props<{ error: string }>()
);

export const emptyBaselineGroupSketchesState = createAction(
    '[App] Empty Baseline Group Sketch State',
);

// PipelineConfigurations actions

export const fetchPipelineConfigurations = createAction(
    '[App] Fetch Pipeline Configurations',
    props<{ categoryId: any }>()
);

export const fetchPipelineConfigurationsSuccess = createAction(
    '[App] Fetch Pipeline Configurations Success',
    props<{ pipelineConfigurations: any }>()
);

export const fetchPipelineConfigurationsFailure = createAction(
    '[App] Fetch Pipeline Configurations Failure',
    props<{ error: string }>()
);

export const addPipelineConfiguration = createAction(
    '[App] Add Pipeline Configuration',
    props<{ pipelineConfiguration: any }>()
);

export const addPipelineConfigurationSuccess = createAction(
    '[App] Add Pipeline Configuration Success'
);

export const addPipelineConfigurationFailure = createAction(
    '[App] Add Pipeline Configuration Failure',
    props<{ error: string }>()
);

export const changePipelineConfigurationStatus = createAction(
    '[App] Change Pipeline Configuration Status',
    props<{ configurationId: any , categoryId: any}>()
);

export const changePipelineConfigurationStatusSuccess = createAction(
    '[App] Change Pipeline Configuration Status Success'
);

export const changePipelineConfigurationStatusFailure = createAction(
    '[App] Change Pipeline Configuration Status Failure',
    props<{ error: string }>()
);

// PipelineResults actions
export const fetchPipelineResults = createAction(
    '[App] Fetch Pipeline Results',
    props<{ configurationId: any }>()
);

export const fetchPipelineResultsSuccess = createAction(
    '[App] Fetch Pipeline Results Success',
    props<{ pipelineResults: any }>()
);

export const fetchPipelineResultsFailure = createAction(
    '[App] Fetch Pipeline Results Failure',
    props<{ error: string }>()
);

export const emptyPipelineResultsState = createAction(
    '[App] Empty Pipeline Results State',
);












