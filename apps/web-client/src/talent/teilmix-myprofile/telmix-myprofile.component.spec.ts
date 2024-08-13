import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelmixMyprofileComponent } from './telmix-myprofile.component';

describe('TelmixMyprofileComponent', () => {
  let component: TelmixMyprofileComponent;
  let fixture: ComponentFixture<TelmixMyprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelmixMyprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelmixMyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
