import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentProfileEditComponent } from './talent-profile-edit.component';

describe('TalentProfileEditComponent', () => {
  let component: TalentProfileEditComponent;
  let fixture: ComponentFixture<TalentProfileEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentProfileEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
