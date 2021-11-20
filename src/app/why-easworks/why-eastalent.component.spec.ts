import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhyEastalentComponent } from './why-easworks.component';

describe('WhyEasworksComponent', () => {
  let component: WhyEastalentComponent;
  let fixture: ComponentFixture<WhyEastalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyEastalentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyEastalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
