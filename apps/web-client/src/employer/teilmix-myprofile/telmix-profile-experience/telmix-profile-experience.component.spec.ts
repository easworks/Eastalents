import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelmixProfileExperienceComponent } from './telmix-profile-experience.component';

describe('TelmixProfileExperienceComponent', () => {
  let component: TelmixProfileExperienceComponent;
  let fixture: ComponentFixture<TelmixProfileExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelmixProfileExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelmixProfileExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
