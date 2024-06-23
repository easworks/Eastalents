import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceSkillLayoutComponent } from './experience-skill-layout.component';

describe('ExperienceSkillLayoutComponent', () => {
  let component: ExperienceSkillLayoutComponent;
  let fixture: ComponentFixture<ExperienceSkillLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceSkillLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceSkillLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
