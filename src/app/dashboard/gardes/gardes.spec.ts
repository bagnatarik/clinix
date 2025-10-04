import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gardes } from './gardes';

describe('Gardes', () => {
  let component: Gardes;
  let fixture: ComponentFixture<Gardes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gardes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gardes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
