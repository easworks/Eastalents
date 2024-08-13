import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificationPopupComponent } from './certification-popup.component';

describe('CertificationPopupComponent', () => {
  let component: CertificationPopupComponent;
  let fixture: ComponentFixture<CertificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
