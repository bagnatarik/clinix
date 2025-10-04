import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chambres } from './chambres';

describe('Chambres', () => {
  let component: Chambres;
  let fixture: ComponentFixture<Chambres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chambres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chambres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
