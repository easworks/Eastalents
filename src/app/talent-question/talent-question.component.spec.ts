import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentQuestionComponent } from './talent-question.component';

describe('TalentQuestionComponent', () => {
  let component: TalentQuestionComponent;
  let fixture: ComponentFixture<TalentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
