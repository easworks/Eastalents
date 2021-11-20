import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploerJobpostingEditComponent } from './emploer-jobposting-edit.component';

describe('EmploerJobpostingEditComponent', () => {
  let component: EmploerJobpostingEditComponent;
  let fixture: ComponentFixture<EmploerJobpostingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploerJobpostingEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploerJobpostingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
