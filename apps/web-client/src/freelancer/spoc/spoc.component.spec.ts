import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpocComponent } from './spoc.component';

describe('SpocComponent', () => {
  let component: SpocComponent;
  let fixture: ComponentFixture<SpocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
