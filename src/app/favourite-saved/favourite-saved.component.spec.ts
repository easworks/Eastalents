import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteSavedComponent } from './favourite-saved.component';

describe('FavouriteSavedComponent', () => {
  let component: FavouriteSavedComponent;
  let fixture: ComponentFixture<FavouriteSavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouriteSavedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteSavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
