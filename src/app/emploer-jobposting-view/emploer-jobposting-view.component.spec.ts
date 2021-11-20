import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploerJobpostingViewComponent } from './emploer-jobposting-view.component';

describe('EmploerJobpostingViewComponent', () => {
  let component: EmploerJobpostingViewComponent;
  let fixture: ComponentFixture<EmploerJobpostingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploerJobpostingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploerJobpostingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
