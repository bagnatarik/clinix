import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProfesionnal } from './login-profesionnal';

describe('LoginProfesionnal', () => {
  let component: LoginProfesionnal;
  let fixture: ComponentFixture<LoginProfesionnal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginProfesionnal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginProfesionnal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
