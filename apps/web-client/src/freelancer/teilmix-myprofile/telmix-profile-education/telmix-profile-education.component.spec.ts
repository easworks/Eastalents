import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelmixProfileEducationComponent } from './telmix-profile-education.component';

describe('TelmixProfileEducationComponent', () => {
  let component: TelmixProfileEducationComponent;
  let fixture: ComponentFixture<TelmixProfileEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelmixProfileEducationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelmixProfileEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
