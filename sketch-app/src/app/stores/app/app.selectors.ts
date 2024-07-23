import { createSelector ,createFeatureSelector} from '@ngrx/store';
import {AppState} from './app.reducer'; 

//  (state: any) => state.auth;
 const selectApp = createFeatureSelector<AppState>('app');

export const selectCategories = createSelector(
    selectApp,
  (state) => state.categories
);

export const selectCategory = createSelector(
    selectApp,
  (state) => state.category
);

export const selectAppError = createSelector(
    selectApp,
  (state) => state.error
);

export const selectIsCategoryLoading = createSelector(
    selectApp,
  (state) => state.isLoading
);


export const selectIsCategoriesFetchLoading = createSelector(
    selectApp,
  (state) => state.isFetchCategoriesLoading
);

export const selectBaselineGroups = createSelector( 
    selectApp,
  (state) => state.baselineGroups
);

// export const selectBaselineGroup = createSelector(
//     selectApp,
//   (state) => state.baselineGroup
// );

export const selectBaselineGroupSketches = createSelector(
    selectApp,
  (state) => state.baselineGroupSketches
);

export const selectPipelineConfigurations = createSelector(
    selectApp,
  (state) => state.pipelineConfigurations
);

export const selectPipelineResults = createSelector(
    selectApp,
  (state) => state.pipelineResults
);





