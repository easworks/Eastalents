import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AeRolesComponent } from './ae-roles.component';

describe('AeRolesComponent', () => {
  let component: AeRolesComponent;
  let fixture: ComponentFixture<AeRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AeRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
