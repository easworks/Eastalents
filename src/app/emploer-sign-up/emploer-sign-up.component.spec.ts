import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploerSignUpComponent } from './emploer-sign-up.component';

describe('EmploerSignUpComponent', () => {
  let component: EmploerSignUpComponent;
  let fixture: ComponentFixture<EmploerSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploerSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploerSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
