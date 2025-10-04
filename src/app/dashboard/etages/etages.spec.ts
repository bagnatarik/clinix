import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etages } from './etages';

describe('Etages', () => {
  let component: Etages;
  let fixture: ComponentFixture<Etages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
