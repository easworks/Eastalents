import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockJobsComponent } from './mock-jobs.component';

describe('MockJobsComponent', () => {
  let component: MockJobsComponent;
  let fixture: ComponentFixture<MockJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
