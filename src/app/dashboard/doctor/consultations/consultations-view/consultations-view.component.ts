import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConsultationsService } from '../consultations.service';
import { Consultation } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';

@Component({
  selector: 'app-consultations-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './consultations-view.component.html',
})
export class ConsultationsViewComponent {
  consultation$!: Observable<Consultation | null>;
  doctorName: string;

  constructor(
    private route: ActivatedRoute,
    private service: ConsultationsService,
    private auth: AuthenticationService
  ) {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Doctor User';
    const id = this.route.snapshot.paramMap.get('id');
    this.consultation$ = id ? this.service.getById(id) : of(null);
  }
}