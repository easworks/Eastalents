import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenAiVattingComponent } from './gen-ai-vatting.component';

describe('GenAiVattingComponent', () => {
  let component: GenAiVattingComponent;
  let fixture: ComponentFixture<GenAiVattingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenAiVattingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenAiVattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
