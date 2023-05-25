import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalenMessageboxComponent } from './talen-messagebox.component';

describe('TalenMessageboxComponent', () => {
  let component: TalenMessageboxComponent;
  let fixture: ComponentFixture<TalenMessageboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalenMessageboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalenMessageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
