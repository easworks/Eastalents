import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelmixProfileOverviewComponent } from './telmix-profile-overview.component';

describe('TelmixProfileOverviewComponent', () => {
  let component: TelmixProfileOverviewComponent;
  let fixture: ComponentFixture<TelmixProfileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelmixProfileOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelmixProfileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
