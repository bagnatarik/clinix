import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFirstLogin } from './confirm-first-login';

describe('ConfirmFirstLogin', () => {
  let component: ConfirmFirstLogin;
  let fixture: ComponentFixture<ConfirmFirstLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmFirstLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmFirstLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
