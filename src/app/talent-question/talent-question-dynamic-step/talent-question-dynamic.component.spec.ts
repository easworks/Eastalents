import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentQuestionDynamicComponent } from './talent-question-dynamic.component';

describe('TalentQuestionDynamicComponent', () => {
  let component: TalentQuestionDynamicComponent;
  let fixture: ComponentFixture<TalentQuestionDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentQuestionDynamicComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentQuestionDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
