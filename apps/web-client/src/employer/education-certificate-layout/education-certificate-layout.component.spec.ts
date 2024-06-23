import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationCertificateLayoutComponent } from './education-certificate-layout.component';

describe('EducationCertificateLayoutComponent', () => {
  let component: EducationCertificateLayoutComponent;
  let fixture: ComponentFixture<EducationCertificateLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationCertificateLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationCertificateLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
