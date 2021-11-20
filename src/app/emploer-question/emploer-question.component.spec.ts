import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploerQuestionComponent } from './emploer-question.component';

describe('EmploerQuestionComponent', () => {
  let component: EmploerQuestionComponent;
  let fixture: ComponentFixture<EmploerQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmploerQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploerQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
