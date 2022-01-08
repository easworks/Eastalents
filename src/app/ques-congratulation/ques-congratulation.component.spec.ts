import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesCongratulationComponent } from './ques-congratulation.component';

describe('QuesCongratulationComponent', () => {
  let component: QuesCongratulationComponent;
  let fixture: ComponentFixture<QuesCongratulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuesCongratulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesCongratulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
