import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo-component',
  imports: [],
  templateUrl: './logo-component.html',
  styleUrl: './logo-component.css',
})
export class LogoComponent {
  @Input() title: string = 'Clinix';
  @Input() textHeader: string = 'Espace patient';
}
