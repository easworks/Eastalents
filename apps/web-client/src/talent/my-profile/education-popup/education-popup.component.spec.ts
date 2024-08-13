import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationPopupComponent } from './education-popup.component';

describe('EducationPopupComponent', () => {
  let component: EducationPopupComponent;
  let fixture: ComponentFixture<EducationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
