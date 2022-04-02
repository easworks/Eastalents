import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCenterViewComponent } from './help-center-view.component';

describe('HelpCenterViewComponent', () => {
  let component: HelpCenterViewComponent;
  let fixture: ComponentFixture<HelpCenterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpCenterViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
