import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitativeAppComponent } from './quantitative-app.component';

describe('QuantitativeAppComponent', () => {
  let component: QuantitativeAppComponent;
  let fixture: ComponentFixture<QuantitativeAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantitativeAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitativeAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
