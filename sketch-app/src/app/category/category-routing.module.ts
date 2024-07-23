import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LayoutComponent } from './layout.component';
import { AddCategoryComponent } from './add-category.component';
import { EditCategoryComponent } from './edit-category.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'add', component: AddCategoryComponent },
            { path: 'edit', component: EditCategoryComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryRoutingModule { }
