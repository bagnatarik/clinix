import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-one-time-password-component',
  imports: [CommonModule],
  templateUrl: './one-time-password-component.html',
  styleUrl: './one-time-password-component.css',
})
export class OneTimePasswordComponent {
  /** number of digits */
  @Input() length = 6;

  /** optional Tailwind classes to merge with inputs */
  @Input() inputClass = '';

  /** emits current code on every change */
  @Output() codeChange = new EventEmitter<string>();

  /** emits once when code is complete (all digits filled) */
  @Output() complete = new EventEmitter<string>();

  @ViewChildren('otp') inputs!: QueryList<ElementRef<HTMLInputElement>>;

  boxes: undefined[] = [];
  values: string[] = [];

  ngOnInit() {
    this.reset();
  }

  ngOnChanges() {
    this.reset();
  }

  private reset() {
    this.boxes = Array(this.length);
    this.values = Array(this.length).fill('');
  }

  private focusAt(index: number) {
    const arr = this.inputs?.toArray();
    if (!arr) return;
    const el = arr[index];
    if (el) el.nativeElement.focus();
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const raw = input.value || '';
    // keep only digits
    const digit = raw.replace(/\D/g, '').slice(-1); // last digit typed
    this.values[index] = digit;
    input.value = digit;

    // emit code change
    this.emitChange();

    if (digit) {
      // move next if exists
      const next = Math.min(this.length - 1, index + 1);
      if (index < this.length - 1) this.focusAt(next);
    }

    // if all filled -> emit complete
    if (this.values.every((v) => v !== '')) {
      this.complete.emit(this.getCode());
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'Backspace') {
      event.preventDefault();
      // if current has value -> clear it, else go previous and clear
      if (this.values[index]) {
        this.values[index] = '';
        const el = this.inputs?.toArray()[index];
        if (el) el.nativeElement.value = '';
        this.emitChange();
      } else if (index > 0) {
        const prev = index - 1;
        this.focusAt(prev);
        this.values[prev] = '';
        const elPrev = this.inputs?.toArray()[prev];
        if (elPrev) elPrev.nativeElement.value = '';
        this.emitChange();
      }
      return;
    }

    // allow navigation arrows
    if (key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusAt(index - 1);
    }
    if (key === 'ArrowRight' && index < this.length - 1) {
      event.preventDefault();
      this.focusAt(index + 1);
    }

    // block non-digit except navigation
    if (!/^\d$/.test(key) && key.length === 1) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const digits = text.replace(/\D/g, '').slice(0, this.length).split('');
    if (!digits.length) return;

    for (let i = 0; i < this.length; i++) {
      this.values[i] = digits[i] || '';
      const el = this.inputs?.toArray()[i];
      if (el) el.nativeElement.value = this.values[i] || '';
    }

    // emit and focus last filled
    this.emitChange();
    const lastFilled = Math.min(digits.length - 1, this.length - 1);
    this.focusAt(lastFilled);

    if (this.values.every((v) => v !== '')) {
      this.complete.emit(this.getCode());
    }
  }

  getCode() {
    return this.values.join('');
  }

  private emitChange() {
    this.codeChange.emit(this.getCode());
  }
}
