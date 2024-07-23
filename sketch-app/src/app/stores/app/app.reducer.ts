import { createReducer, on } from '@ngrx/store';
import { categorySelected, addCategory , addCategoryFailure, 
    editCategory , editCategoryFailure, categoryStatusChange, categoryStatusChangeFailure,
    fetchCategories, fetchCategoriesFailure,  fetchCategoriesSuccess,
     cancelCategoryAction, setCategory,
    addBaselineGroup, addBaselineGroupFailure, addBaselineGroupSuccess,
    fetchBaselineGroups, fetchBaselineGroupsFailure, fetchBaselineGroupsSuccess,
    deleteBaselineGroup, deleteBaselineGroupFailure, deleteBaselineGroupSuccess,
    addBaselineGroupSketches, addBaselineGroupSketchesFailure, addBaselineGroupSketchesSuccess,
    fetchBaselineGroupSketches, fetchBaselineGroupSketchesFailure, fetchBaselineGroupSketchesSuccess, 
    deleteBaselineGroupSketch, deleteBaselineGroupSketchFailure, deleteBaselineGroupSketchSuccess,
    emptyBaselineGroupSketchesState ,
    fetchPipelineConfigurations, fetchPipelineConfigurationsSuccess, fetchPipelineConfigurationsFailure,
    addPipelineConfiguration, addPipelineConfigurationSuccess, addPipelineConfigurationFailure,
    changePipelineConfigurationStatus, changePipelineConfigurationStatusSuccess, changePipelineConfigurationStatusFailure,
    fetchPipelineResults, fetchPipelineResultsSuccess, fetchPipelineResultsFailure,
    emptyPipelineResultsState
     } from '@app/stores/app/app.actions';
import { BaselineGroup, BaselineGroupSketches, Category, PipelineConfiguration, PipelineResult } from '@app/_models';



export interface AppState {
    categories: Category[];
    category: Category;
    // baselineGroup: BaselineGroup;
    baselineGroups: BaselineGroup[];
    pipelineResults: PipelineResult[];
    baselineGroupSketches: BaselineGroupSketches;
    pipelineConfigurations: PipelineConfiguration[];
    error: string;
    isLoading: boolean;
    isFetchCategoriesLoading: boolean;
    isAddCategoryLoading: boolean;
    isEditCategoryLoading: boolean;
    isCategoryStatusChangeLoading: boolean;
}


const initialState: AppState = {
    categories: [],
    category: new Category(),
    // baselineGroup: new BaselineGroup(),
    baselineGroups: [],
    pipelineResults: [],
    baselineGroupSketches: new BaselineGroupSketches(),
    pipelineConfigurations: [],
    error: '',
    isLoading: false,
    isFetchCategoriesLoading: false,
    isAddCategoryLoading: false,
    isEditCategoryLoading: false,
    isCategoryStatusChangeLoading: false
};

export const appReducer = createReducer(initialState,
    /// Categories reducers
    on(categorySelected, (state, { category }) => ({ ...state, category: category, error: ''})),
    on(addCategory, (state, { category }) => ({ ...state, category: category, isLoading: true, error: ''})),
    on(addCategoryFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(editCategory, (state, { category }) => ({ ...state, category: category, isLoading: true, error: '' })),
    on(editCategoryFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(categoryStatusChange, (state, { category }) => ({ ...state, category: category, isLoading: true, error: '' })),
    on(categoryStatusChangeFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(fetchCategories, (state, { }) => ({ ...state, isFetchCategoriesLoading: true, isLoading: true, error: '' })),
    on(fetchCategoriesSuccess, (state, { categories }) => ({ ...state, categories: categories, isFetchCategoriesLoading: false, isLoading: false, error: ''})),
    on(fetchCategoriesFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(cancelCategoryAction, (state, {}) => ({ ...state, isLoading: false, error: ''})),
    on(setCategory, (state, { category }) => ({ ...state, category: category, error: '' })),
    // on(addBaselineGroup, (state, { baselineGroup }) => ({ ...state, baselineGroup: baselineGroup, isLoading: true, error: ''})),
    // BaselineGroups reducers
    on(addBaselineGroup, (state, { baselineGroup }) => ({ ...state, isLoading: true, error: ''})),
    on(addBaselineGroupSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(addBaselineGroupFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(fetchBaselineGroups, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(fetchBaselineGroupsSuccess, (state, { baselineGroups }) => ({ ...state, baselineGroups: baselineGroups, isLoading: false, error: ''})),
    on(fetchBaselineGroupsFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(deleteBaselineGroup, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(deleteBaselineGroupSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(deleteBaselineGroupFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    // BaselineGroupSketches reducers
    on(addBaselineGroupSketches, (state, { }) => ({ ...state, isLoading: true, error: ''})),
    on(addBaselineGroupSketchesSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(addBaselineGroupSketchesFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(fetchBaselineGroupSketches, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(fetchBaselineGroupSketchesSuccess, (state, { baselineGroupSketches }) => ({ ...state, baselineGroupSketches: baselineGroupSketches, isLoading: false, error: ''})),
    on(fetchBaselineGroupSketchesFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(deleteBaselineGroupSketch, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(deleteBaselineGroupSketchSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(deleteBaselineGroupSketchFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(emptyBaselineGroupSketchesState, (state, { }) => ({ ...state, baselineGroupSketches: new BaselineGroupSketches(), isLoading: false, error: '' })),
    // PipelineConfigurations reducers
    on(fetchPipelineConfigurations, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(fetchPipelineConfigurationsSuccess, (state, { pipelineConfigurations }) => ({ ...state, pipelineConfigurations: pipelineConfigurations, isLoading: false, error: '' })),
    on(fetchPipelineConfigurationsFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })), 
    on(addPipelineConfiguration, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(addPipelineConfigurationSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(addPipelineConfigurationFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(changePipelineConfigurationStatus, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(changePipelineConfigurationStatusSuccess, (state, { }) => ({ ...state, isLoading: false, error: '' })),
    on(changePipelineConfigurationStatusFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(fetchPipelineResults, (state, { }) => ({ ...state, isLoading: true, error: '' })),
    on(fetchPipelineResultsSuccess, (state, { pipelineResults }) => ({ ...state, pipelineResults: pipelineResults, isLoading: false, error: '' })),
    on(fetchPipelineResultsFailure, (state, { error }) => ({ ...state, error: error, isLoading: false })),
    on(emptyPipelineResultsState, (state, { }) => ({ ...state, pipelineResults: [], isLoading: false, error: '' })),

);


