import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VettedIndividualsComponent } from './vetted-individuals.component';

describe('VettedIndividualsComponent', () => {
  let component: VettedIndividualsComponent;
  let fixture: ComponentFixture<VettedIndividualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VettedIndividualsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VettedIndividualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
