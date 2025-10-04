import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-component',
  imports: [CommonModule],
  templateUrl: './button-component.html',
  styleUrl: './button-component.css',
})
export class ButtonComponent implements OnInit {
  @Input() label: string = 'Click Here';
  @Input() className: string =
    'w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer transition-colors duration-300 text-white rounded p-2.5 text-sm font-medium flex items-center justify-center';

  @Input() type: 'button' | 'submit' | 'reset' = 'submit';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Output() click: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}
}
