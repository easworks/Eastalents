import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactUsPopupComponent } from './contact-us-popup.component';

describe('ContactUsPopupComponent', () => {
  let component: ContactUsPopupComponent;
  let fixture: ComponentFixture<ContactUsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
