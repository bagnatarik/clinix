import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesChambre } from './types-chambre';

describe('TypesChambre', () => {
  let component: TypesChambre;
  let fixture: ComponentFixture<TypesChambre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypesChambre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypesChambre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
