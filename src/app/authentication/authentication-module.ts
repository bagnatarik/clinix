import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing-module';
import { Login } from './components/login/login';
import { PatientAppointment } from './components/patient-appointment/patient-appointment';
import { InviteAccept } from './components/invite-accept/invite-accept';
import { ConfirmFirstLogin } from './components/confirm-first-login/confirm-first-login';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';
import { LogoComponent } from '../shared/logo-component/logo-component';

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    Login,
    PatientAppointment,
    InviteAccept,
    ConfirmFirstLogin,
    ForgotPassword,
    ResetPassword,
    LogoComponent,
  ],
})
export class AuthenticationModule {}
