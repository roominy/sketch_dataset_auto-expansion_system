import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User , Category} from '@app/_models';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';

@Injectable({ providedIn: 'root' })
export class UserAdminService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private store: Store<AuthStoreModule>

    ) {}

    fetchUsers(){
        return this.http.get<User[]>(`${environment.apiUrl}/admin/users/fetchUsers`, {});
    }

    addUser(user: User) {
        
        return this.http.post(`${environment.apiUrl}/admin/users/addUser`, user);
    }

    editUser(user: User) {
        
        return this.http.post(`${environment.apiUrl}/admin/users/editUser`, user);
    }

    changeUserStatus(user: User) {
        
        return this.http.post(`${environment.apiUrl}/admin/users/changeUserStatus`, user);
    }

    resetPassword(user: User) {
        
        return this.http.post(`${environment.apiUrl}/admin/users/resetPassword`, user);
    }

}