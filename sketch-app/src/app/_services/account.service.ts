import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { AuthStoreModule } from '@app/stores';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    httpHeaders: HttpHeaders | undefined;

   

    


    constructor(
        private router: Router,
        private http: HttpClient,
        private store: Store<AuthStoreModule>

    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
        
    }

    

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        let httpOptions = {
            headers: new HttpHeaders()
                .append('accept', 'application/json')
                .append("Authorization", "Basic " + btoa(username+":"+password))
        };
        return this.http.get<User>(`${environment.apiUrl}/auth/authorization/login`, httpOptions)
            .pipe(map(user => {
                return user;
            }));
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/auth/authorization/register`, user);
    }


    fetchProfile(){
        return this.http.get<User>(`${environment.apiUrl}/user/profile/fetchProfile`, {});
    }

    updateProfile(user: User) {
        
        return this.http.post(`${environment.apiUrl}/user/profile/updateProfile`, user);
    }

    deactivateProfile(user: User) {
        return this.http.post(`${environment.apiUrl}/user/profile/deactivateProfile`, user);
    }

    

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }


}