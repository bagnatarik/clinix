import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Antecedants } from './antecedants';

describe('Antecedants', () => {
  let component: Antecedants;
  let fixture: ComponentFixture<Antecedants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Antecedants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Antecedants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
