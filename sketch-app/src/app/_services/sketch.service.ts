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
export class SketchService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private store: Store<AuthStoreModule>

    ) {}


    submitSketch(sketch: any) {
        
        return this.http.post(`${environment.apiUrl}/sketch/submission/sketch`, sketch);
    }


}