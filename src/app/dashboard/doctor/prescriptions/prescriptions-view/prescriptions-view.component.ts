import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PrescriptionsService } from '../prescriptions.service';
import { Prescription } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';

@Component({
  selector: 'app-prescriptions-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prescriptions-view.component.html',
})
export class PrescriptionsViewComponent {
  prescription$!: Observable<Prescription | null>;
  doctorName: string;

  constructor(
    private route: ActivatedRoute,
    private service: PrescriptionsService,
    private auth: AuthenticationService
  ) {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Doctor User';
    const id = this.route.snapshot.paramMap.get('id');
    this.prescription$ = id ? this.service.getById(id) : of(null);
  }
}