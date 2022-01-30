import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentQuestionSelectItemComponent } from './talent-question-select-item.component';

describe('TalentQuestionSelectItemComponent', () => {
  let component: TalentQuestionSelectItemComponent;
  let fixture: ComponentFixture<TalentQuestionSelectItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentQuestionSelectItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentQuestionSelectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
