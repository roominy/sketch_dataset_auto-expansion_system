import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';


import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from '@app/_helpers';
import { AppComponent } from '@app/app.component';
import { AlertComponent } from '@app/_components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '@app/home';

import { ProfileComponent } from './home/profile.component';
import {AuthStoreModule} from '@app/stores/auth/auth-store.module';
import {AppStoreModule} from '@app/stores/app/app-store.module';


import { StoreModule } from '@ngrx/store'
;
import { EffectsModule } from '@ngrx/effects';
import { SketchCanvasComponent } from '@app/home/sketch-canvas.component'
import { AdminStoreModule } from './stores/admin/admin-store.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule, 
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,       
        // StoreModule.forRoot({}, {})
        AuthStoreModule,
        AppStoreModule,
        AdminStoreModule
        // EffectsModule.forRoot([])    
           ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        ProfileComponent,
        SketchCanvasComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };