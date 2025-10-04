import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesAntecedant } from './types-antecedant';

describe('TypesAntecedant', () => {
  let component: TypesAntecedant;
  let fixture: ComponentFixture<TypesAntecedant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesAntecedant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesAntecedant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
