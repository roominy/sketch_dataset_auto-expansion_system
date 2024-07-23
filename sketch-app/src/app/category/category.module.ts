import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { LayoutComponent } from './layout.component';
import { AddCategoryComponent } from './add-category.component';
import { EditCategoryComponent } from './edit-category.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CategoryRoutingModule
    ],
    declarations: [
        LayoutComponent,
        AddCategoryComponent,
        EditCategoryComponent
    ]
})
export class CategoryModule { }