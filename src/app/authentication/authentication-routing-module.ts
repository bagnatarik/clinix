import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationLayout } from '../core/layouts/authentication-layout/authentication-layout';
import { Login } from './components/login/login';
import { LoginProfesionnal } from './components/login-profesionnal/login-profesionnal';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

const routes: Routes = [
  {
    path: '',
    component: AuthenticationLayout,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: Login,
        pathMatch: 'full',
      },
      {
        path: 'login/professional',
        component: LoginProfesionnal,
        pathMatch: 'full',
      },
      {
        path: 'forgot-password',
        component: ForgotPassword,
      },
      {
        path: 'reset-password',
        component: ResetPassword,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
