import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Home } from './home/home';
import { DashboardLayout } from '../core/layouts/dashboard-layout/dashboard-layout';
import { UserAccount } from './user-account/user-account';

@NgModule({
  declarations: [],
  imports: [CommonModule, DashboardRoutingModule, Home, UserAccount, DashboardLayout],
})
export class DashboardModule {}
