import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
import { AccountService, CategoryService ,HelperService} from './_services';
import { User } from '@app/_models';
import { Category } from '@app/_models';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { selectUser, selectToggleMenu } from '@app/stores/auth/auth.selectors';
import { selectCategories } from '@app/stores/app/app.selectors';
import { logout } from '@app/stores/auth/auth.actions';
import { fetchCategories, categorySelected } from '@app/stores/app/app.actions';
import { toggleMenu } from '@app/stores/auth/auth.actions';



@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
    user: any
    categories?: Category[] | null; 
    isCollapsed? : boolean;
    
    menuToggle?: boolean;


    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    isMobile= true;

    constructor(private accountService: AccountService, private observer: BreakpointObserver,
      private authStore: Store<AuthStoreModule>,
      private appStore: Store<AppStoreModule>,
      private router: Router, 
      private categoryService: CategoryService, 
      private helperService: HelperService) {
        // this.accountService.user.subscribe(x => this.user = x);
        this.authStore.select(selectUser).subscribe(user => (this.user = user));
        
        if (this.user?.token) {
          this.appStore.dispatch(fetchCategories());
        }

        this.appStore.select(selectCategories).subscribe(categories => (this.categories = categories));
        // this.user$ = this.store.select(selectUser);
        // this.categories = [
        //   { "category_id": 0, "category_name": "car", "category_label": "Car", "description": "Car Sketches", "status": "active"},
        //   { "category_id": 1, "category_name": "turtle" ,"category_label": "Turtle", "description": "Turtle Sketches", "status": "active"},
        //   { "category_id": 2, "category_name": "butterfly","category_label": "Butterfly" ,"description": "Butterfly Sketches", "status": "inactive"},
        //   { "category_id": 3, "category_name": "hammer" ,"category_label": "Hammer", "description": "Hammer Sketches", "status": "active"},
        //   { "category_id": 4, "category_name": "axe" ,"category_label": "Axe" , "description": "Axe Sketches", "status": "active"},
        //   ];
          
          
          if (this.user?.token) {
            
            this.router.navigate(['/home']);

          } else { 
            console.log("not logged in, redirecting to login page")
            this.router.navigate(['/account/login']);
          }
          // 
    }

    ngOnInit() {

      this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
        if(screenSize.matches){
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });

      if(this.isMobile){
        this.isCollapsed = false; 
      } else {
        this.authStore.select(selectToggleMenu).subscribe(toggleMenu => (this.isCollapsed = toggleMenu));
      }
    }

    toggleMenu() {
      this.authStore.dispatch(toggleMenu());
      if(this.isMobile){
        this.sidenav.toggle(); // On mobile, the menu can never be collapsed
        this.isCollapsed = false; 
      } else {
        this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
        // this.authStore.select(selectToggleMenu).subscribe(toggleMenu => (this.isCollapsed = toggleMenu));
        
      }
    }

    logout() {
      this.authStore.dispatch(logout());
    }

    addCategory() {
      this.router.navigate(['/category/add']);
    }

    editCategory(category: Category) {

      this.appStore.dispatch(categorySelected({category: category}));
      // this.categoryService.setCategory(category);
      
      this.router.navigate(['/category/edit']).then(() => {
        this.helperService.reloadCurrentRoute();
      });
      
    }

    refreshCategories() { 
      this.appStore.dispatch(fetchCategories());
    }

    selectCategory(category: Category) {
      this.appStore.dispatch(categorySelected({category: category}));
      this.router.navigate(['/sketch']);

      
      // this.categoryService.setCategory(category);
      // this.router.navigate(['/category']).then(() => {
      //   this.helperService.reloadCurrentRoute();
      // });
    
    }



    adminSelectCategory(category: Category) {
      this.appStore.dispatch(categorySelected({category: category}));
      // this.router.navigate(['/pipeline']);
      this.helperService.reloadToRoute('/pipeline');

      
      // this.categoryService.setCategory(category);
      // this.router.navigate(['/category']).then(() => {
      //   this.helperService.reloadCurrentRoute();
      // });
    
    }

}

// @Component({
//   selector: 'add-category-dialog',
//   templateUrl: 'add-category-dialog.html',
// })
// export class AddCategoryDialog implements OnInit {
//     form!: FormGroup;
//     category_name:string | undefined;
//     category_label:string | undefined;
//     description:string | undefined;
    

//     constructor(
//         private fb: FormBuilder,
//         private dialogRef: MatDialogRef<AddCategoryDialog>,
//         @Inject(MAT_DIALOG_DATA) data: Category){
//           this.category_name = data.category_name;
//           this.category_label = data.category_label;
//           this.description = data.description;
//     }
//     ngOnInit(): void {
//       this.form = this.fb.group({
//         description: [this.description, []],
//         category_name: [this.category_name, []],
//         category_label: [this.category_label, []]
//       });
//     }
//     save() {
//       this.dialogRef.close(this.form.value);
//     }

//     close() {
//       this.dialogRef.close();
//     }
//   }