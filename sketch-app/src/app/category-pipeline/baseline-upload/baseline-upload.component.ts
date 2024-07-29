import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ImageFile, BaselineGroup, BaselineGroupSketches } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, BaselineSketch } from '@app/_models';
import { selectBaselineGroups, selectCategory } from '@app/stores/app/app.selectors';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { AlertService } from '@app/_services';
import { Subscription, merge } from 'rxjs';
import * as AppActions from '@app/stores/app/app.actions';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-baseline-upload',
  templateUrl: './baseline-upload.component.html',
  styleUrls: ['./baseline-upload.component.less']
})
export class BaselineUploadComponent implements OnInit, OnDestroy {

  // // @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef | undefined;
  // files: ImageFile[] = [];

  // onDropFiles(files: ImageFile[]): void {
  //   this.files = [...this.files, ...files];
  // }

  category?: Category;

  uploadForm!: FormGroup;
  baselineGroups: BaselineGroup[]  = [];

  baselineGroupSketches: BaselineSketch[] = [];
  
  // files: File[] = [];
  // urls : string[]= [];
  selectedImages!: FileList;
  loading = false;
  submitting = false;
  submitted = false;
  uploading = false;
  private actionsSubscription?: Subscription;

  constructor(private formBuilder: FormBuilder,
    private appStore: Store<AppStoreModule> ,
    private alertService: AlertService,
    private actions$: Actions, 
  ) {
    
  }

  ngOnInit(): void {

    this.appStore.select(selectCategory).subscribe(category => (this.category = category));
      

    this.appStore.select(selectBaselineGroups).subscribe(baselineGroups => (this.baselineGroups = baselineGroups));
      

      this.actionsSubscription = merge(
        this.actions$.pipe(ofType(AppActions.addBaselineGroupSketchesSuccess)),
        this.actions$.pipe(ofType(AppActions.addBaselineGroupSketchesFailure)),
      ).subscribe(action => {
        // Handle the success actions here
        // The logic here will execute for any of the actions defined above
        if (action.type === '[App] Add Baseline Group Sketches Success') {
          
          this.submitting = false;
          this.resetForm();
        } else {
          this.submitting = false;
        }
      });
    
    

    this.uploadForm = this.formBuilder.group({
      baselines_group: ['', Validators.required]
    });
  }

  // onFileSelect(event: any): void {
  //   
  //   this.files = event.target.files;
  //   if (this.files.length > 70) {
  //     this.files = Array.from(this.files).slice(0, 70); // Limit to 50 files
      
  //   }
  // }

  onSubmit(): void {
    this.alertService.clear();
    
    if (this.uploadForm.valid && this.baselineGroupSketches.length) {
      this.submitting = true;
      this.submitted = true;
      
      // Here you would typically send the files and the form data to the server
      
      
      let baselineGroupSketchs: BaselineGroupSketches = new BaselineGroupSketches();
      baselineGroupSketchs.baseline_group_id = this.uploadForm.value.baselines_group;
      baselineGroupSketchs.baseline_sketches = this.baselineGroupSketches;

      
      this.appStore.dispatch(AppActions.addBaselineGroupSketches({BaselineGroupSketches: baselineGroupSketchs}));


    } else  {
      this.submitting = false;
      if(this.baselineGroupSketches.length == 0 && this.uploadForm.valid == false){
        // this.alertService.error('Please select files and choose a basel.',{ keepAfterRouteChange: true });
        this.alertService.error('Please select files and choose a basel.');
        return;

      } else if(this.baselineGroupSketches.length == 0){
        // this.alertService.error('Please select files.',{ keepAfterRouteChange: true });
        this.alertService.error('Please select files.');
        return;
      } else if(this.uploadForm.valid == false){
        // this.alertService.error('Please choose a category.',{ keepAfterRouteChange: true });
        this.alertService.error('Please choose a category.');
        return;
      }
      
      
      // alert('Please select files and choose a category.');
    }
  }

  resetForm() {
    // this.alertService.clear();
    this.submitting = false;
    this.submitted = false;
    this.uploadForm.reset();
    this.baselineGroupSketches = [];
    // this.files = [];
    // this.urls = [];

  }

  onImageSelected(event: Event): void {
    this.alertService.clear();

    
  
      const inputElement = event.target as HTMLInputElement;

      if (inputElement?.files && inputElement.files.length > 0) {
        this.selectedImages = inputElement.files;
      }

      

     
      
      for (let i = 0; i < this.selectedImages.length; i++) {
        let baselineSketch: BaselineSketch = new BaselineSketch();
        const reader = new FileReader();
        
        reader.readAsDataURL(this.selectedImages[i]);
        reader.onload = (event: ProgressEvent<FileReader>) => {
          baselineSketch.baseline_sketch = event.target?.result as string;
          baselineSketch.baseline_name=  this.selectedImages[i].name 
          this.baselineGroupSketches.push(baselineSketch);
          // this.urls.push(event.target?.result as string); // Specify the type as string
        };
      }
      // this.files = this.files.concat(Array.from(this.selectedImages));
      
      
      
      
  }

  removeImage(index: number): void {
    this.alertService.clear();
    // this.files.splice(index, 1);
    // this.urls.splice(index, 1);
    this.baselineGroupSketches.splice(index, 1);
    
  }


  

  onDrop(event: DragEvent): void {
    this.alertService.clear();
    
    
    event.preventDefault();

    if (event?.dataTransfer?.files) {
      this.selectedImages =  event.dataTransfer.files;
    }

    
    

    for (let i = 0; i < this.selectedImages.length; i++) {
      let baselineSketch: BaselineSketch = new BaselineSketch();
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedImages[i]);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        baselineSketch.baseline_sketch = event.target?.result as string;
        baselineSketch.baseline_name=  this.selectedImages[i].name 
        this.baselineGroupSketches.push(baselineSketch);
        // this.urls.push(event.target?.result as string); // Specify the type as string
        

      };
    }
    // this.files = this.files.concat(Array.from(this.selectedImages));
    
  }



  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  ngOnDestroy(): void {
    this.alertService.clear();
    
  }


}
