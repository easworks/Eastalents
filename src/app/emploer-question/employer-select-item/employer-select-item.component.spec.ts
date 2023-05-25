import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSelectItemComponent } from './employer-select-item.component';

describe('EmployerSelectItemComponent', () => {
  let component: EmployerSelectItemComponent;
  let fixture: ComponentFixture<EmployerSelectItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployerSelectItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSelectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
