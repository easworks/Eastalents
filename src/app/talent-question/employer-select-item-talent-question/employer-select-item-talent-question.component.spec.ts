import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSelectItemTalentQuestionComponent } from './employer-select-item-talent-question.component';

describe('EmployerSelectItemTalentQuestionComponent', () => {
  let component: EmployerSelectItemTalentQuestionComponent;
  let fixture: ComponentFixture<EmployerSelectItemTalentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSelectItemTalentQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSelectItemTalentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
