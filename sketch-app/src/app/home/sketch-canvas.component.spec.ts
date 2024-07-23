import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchCanvasComponent } from './sketch-canvas.component';

describe('SketchCanvasComponent', () => {
  let component: SketchCanvasComponent;
  let fixture: ComponentFixture<SketchCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SketchCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
