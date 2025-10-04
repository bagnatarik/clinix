import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesPrelevement } from './types-prelevement';

describe('TypesPrelevement', () => {
  let component: TypesPrelevement;
  let fixture: ComponentFixture<TypesPrelevement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesPrelevement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesPrelevement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
