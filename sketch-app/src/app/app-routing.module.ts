import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent, ProfileComponent ,SketchCanvasComponent } from '@app/home';
import { AuthGuard,AdminHomeGuard, HomeGuard } from './_helpers';
import { AppComponent } from './app.component';


const accountModule = () => import('@app/account/account.module').then(x => x.AccountModule);
const usersModule = () => import('@app/users/users.module').then(x => x.UsersModule);
const categoryModule = () => import('@app/category/category.module').then(x => x.CategoryModule);
const categoryPipelineModule = () => import('@app/category-pipeline/category-pipeline.module').then(x => x.CategoryPipelineModule);


const routes: Routes = [
    { path: '', component: AppComponent, canActivate: [AuthGuard]},
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'sketch', component: SketchCanvasComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AdminHomeGuard] },
    { path: 'category', loadChildren: categoryModule , canActivate: [AdminHomeGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'pipeline', loadChildren: categoryPipelineModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }