import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobReferenceLayoutComponent } from './job-reference-layout.component';

describe('JobReferenceLayoutComponent', () => {
  let component: JobReferenceLayoutComponent;
  let fixture: ComponentFixture<JobReferenceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobReferenceLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobReferenceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
