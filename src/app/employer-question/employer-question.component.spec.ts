import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerQuestionComponent } from './employer-question.component';

describe('EmployerQuestionComponent', () => {
  let component: EmployerQuestionComponent;
  let fixture: ComponentFixture<EmployerQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployerQuestionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
