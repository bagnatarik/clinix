import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rubriques } from './rubrique';

describe('Rubriques', () => {
  let component: Rubriques;
  let fixture: ComponentFixture<Rubriques>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rubriques],
    }).compileComponents();

    fixture = TestBed.createComponent(Rubriques);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
