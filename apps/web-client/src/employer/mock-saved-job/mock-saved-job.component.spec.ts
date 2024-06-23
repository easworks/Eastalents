import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockSavedJobComponent } from './mock-saved-job.component';

describe('MockSavedJobComponent', () => {
  let component: MockSavedJobComponent;
  let fixture: ComponentFixture<MockSavedJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockSavedJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockSavedJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
