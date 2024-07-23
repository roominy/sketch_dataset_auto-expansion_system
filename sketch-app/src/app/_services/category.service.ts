import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User , Category} from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    // private userSubject: BehaviorSubject<User | null>;
    // public user: Observable<User | null>;
   

    constructor(
        private router: Router,
        private http: HttpClient
    ) {}

    // public get userValue() {
    //     return this.userSubject.value;
    // }

    // setCategory(category: Category){
    //     this.category = category;
    // }

    // getCategory(){
    //     return this.category;
    // }

    fetchCategories(){
        return this.http.get<Category[]>(`${environment.apiUrl}/data_admin/dataset/getCategories`);
    }

    addCategory(category: Category) {
        
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/addCategory`, category);
    }

    editCategory(category: Category) {
        
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/editCategory`, category);
    }

    changeCategoryStatus(category: any) {
        
        return this.http.post(`${environment.apiUrl}/data_admin/dataset/changeCategoryStatus`, category);
    }

}