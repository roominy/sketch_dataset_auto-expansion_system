import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AdminEffects } from '@app/stores/admin/admin.effects';

import { adminReducer } from '@app/stores/admin/admin.reducer';

@NgModule({
    imports: [
        CommonModule,
        // StoreModule.forRoot({"app":appReducer}),
        // EffectsModule.forRoot([AppEffects])
        StoreModule.forFeature('admin', adminReducer),
        EffectsModule.forFeature([AdminEffects])
    ],
    providers: [AdminEffects]
})
export class AdminStoreModule { }