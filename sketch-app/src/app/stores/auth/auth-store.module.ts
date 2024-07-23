import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from '@app/stores/auth/auth.effects';

import { authReducer } from '@app/stores/auth/auth.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forRoot({"auth":authReducer}),
        EffectsModule.forRoot([AuthEffects])
    ],
    providers: [AuthEffects]
})
export class AuthStoreModule { }