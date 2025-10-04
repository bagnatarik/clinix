import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Professions } from './professions';

describe('Professions', () => {
  let component: Professions;
  let fixture: ComponentFixture<Professions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Professions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
