import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineGroupComponent } from './baseline-group.component';

describe('BaselineGroupComponent', () => {
  let component: BaselineGroupComponent;
  let fixture: ComponentFixture<BaselineGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaselineGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselineGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
