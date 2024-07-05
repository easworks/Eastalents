import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountEditPopupComponent } from './account-edit-popup.component';

describe('AccountEditPopupComponent', () => {
  let component: AccountEditPopupComponent;
  let fixture: ComponentFixture<AccountEditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountEditPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountEditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
