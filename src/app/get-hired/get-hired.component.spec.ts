import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetHiredComponent } from './get-hired.component';

describe('GetHiredComponent', () => {
  let component: GetHiredComponent;
  let fixture: ComponentFixture<GetHiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetHiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetHiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
