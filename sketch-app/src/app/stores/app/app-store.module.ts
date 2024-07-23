import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppEffects } from '@app/stores/app/app.effects';

import { appReducer } from '@app/stores/app/app.reducer';

@NgModule({
    imports: [
        CommonModule,
        // StoreModule.forRoot({"app":appReducer}),
        // EffectsModule.forRoot([AppEffects])
        StoreModule.forFeature('app', appReducer),
        EffectsModule.forFeature([AppEffects])
    ],
    providers: [AppEffects]
})
export class AppStoreModule { }