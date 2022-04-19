import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractEmployerTalentComponent } from './view-contract-employer-talent.component';

describe('ViewContractEmployerTalentComponent', () => {
  let component: ViewContractEmployerTalentComponent;
  let fixture: ComponentFixture<ViewContractEmployerTalentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContractEmployerTalentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractEmployerTalentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
