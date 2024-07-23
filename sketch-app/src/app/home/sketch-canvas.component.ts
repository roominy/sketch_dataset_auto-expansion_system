import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Category, User } from '@app/_models';
import { AppStoreModule } from '@app/stores/app/app-store.module';
import { selectCategory } from '@app/stores/app/app.selectors';
import { AuthStoreModule } from '@app/stores/auth/auth-store.module';
import { selectUser } from '@app/stores/auth/auth.selectors';
import { Store } from '@ngrx/store';
import { submitSketch, submitSketchFailure, submitSketchSuccess } from '@app/stores/app/app.actions';
import { Subscription, merge } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as AppActions  from '@app/stores/app/app.actions';
import { AlertService } from '@app/_services';

@Component({
  selector: 'app-sketch-canvas',
  templateUrl: './sketch-canvas.component.html',
  styleUrls: ['./sketch-canvas.component.less']
})
export class SketchCanvasComponent implements OnInit, AfterViewInit {

  private actionsSubscription?: Subscription;
  category?: Category;
  user?: User;

  drawing = false;
  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  paths: { x: number; y: number }[][] = [];
  currentPath: { x: number; y: number }[] = [];
  submiting = false;

  constructor( private alertService: AlertService,
               private authStore: Store<AuthStoreModule>,
               private appStore: Store<AppStoreModule>,
               private actions$: Actions) {
    
  }

  ngOnInit(): void {
    this.authStore.select(selectUser).subscribe(user => (this.user = user));
    this.appStore.select(selectCategory).subscribe(category => (this.category = category));

    this.actionsSubscription = merge(
      this.actions$.pipe(ofType(AppActions.submitSketchSuccess)),
      this.actions$.pipe(ofType(AppActions.submitSketchFailure)),
      this.actions$.pipe(ofType(AppActions.categorySelected)),
    ).subscribe(action => {
      // Handle the success actions here
      // The logic here will execute for any of the actions defined above
      if (action.type === '[App] Select Category') {
        this.clearCanvas();
      } else if (action.type === '[App] Submit Sketch Success') {
        this.submiting = false;
        this.clearCanvas();
      } else if (action.type === '[App] Submit Sketch Failure') {
        this.submiting = false;
      } 
    });
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('sketchCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    this.ctx.beginPath();
    this.ctx.moveTo(event.offsetX, event.offsetY);
    this.currentPath = [{ x: event.offsetX, y: event.offsetY }];
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;
    this.ctx.lineTo(event.offsetX, event.offsetY);
    this.ctx.stroke();
    this.currentPath.push({ x: event.offsetX, y: event.offsetY });
  }

  stopDrawing() {
    if (this.drawing) {
      this.paths.push(this.currentPath);
      this.currentPath = [];
      this.drawing = false;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.paths = [];
  }

  saveCanvas() {
    
    if (this.paths.length === 0) {
      this.alertService.error('Please draw something before saving.');
      return;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;

    // Fill the temporary canvas with white
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the existing canvas content onto the temporary canvas
    tempCtx.drawImage(this.canvas, 0, 0);

    // Generate PNG data from the temporary canvas
    const pngData = tempCanvas.toDataURL('image/png');
    
    // const pngData = this.canvas.toDataURL('image/png');

    // Generate SVG data
    const svgData = this.pathsToSVG();

    const svgBase64 = this.encodeSVGToBase64(svgData);

    // Prepare the payload
    const payload = {
      png: pngData,
      svg: svgBase64,
      sketcher_id: this.user ? this.user.id : null, // Example of including additional data
      category_id: this.category ? this.category.category_id : null
    }; 
    
    this.submiting = true;
    this.alertService.clear();
    this.appStore.dispatch(submitSketch({ sketch: payload }));
    // Here you can send the svgContent to your backend
  }

  pathsToSVG() {
    let svgString = `<svg width="${this.canvas.width}" height="${this.canvas.height}" xmlns="http://www.w3.org/2000/svg">`;
    this.paths.forEach(path => {
      if (path.length > 0) {
        svgString += `<path d="M ${path[0].x} ${path[0].y} `;
        path.slice(1).forEach(point => {
          svgString += `L ${point.x} ${point.y} `;
        });
        svgString += '" stroke="black" fill="none"/>';
      }
    });
    svgString += '</svg>';
    return svgString;
  }

  private encodeSVGToBase64(svgString: string): string {
    // Encode SVG markup to base64
    const base64EncodedSVG = btoa(unescape(encodeURIComponent(svgString)));
  
    // Format as data URL
    return `data:image/svg+xml;base64,${base64EncodedSVG}`;
  }
}