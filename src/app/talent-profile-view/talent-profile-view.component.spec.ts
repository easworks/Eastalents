import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentProfileViewComponent } from './talent-profile-view.component';

describe('TalentProfileViewComponent', () => {
  let component: TalentProfileViewComponent;
  let fixture: ComponentFixture<TalentProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentProfileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
