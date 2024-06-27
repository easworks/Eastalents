import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCoreSkillPopupComponent } from './update-core-skill-popup.component';

describe('UpdateCoreSkillPopupComponent', () => {
  let component: UpdateCoreSkillPopupComponent;
  let fixture: ComponentFixture<UpdateCoreSkillPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCoreSkillPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCoreSkillPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
