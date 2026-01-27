import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ButtonIconDirective } from '../../directives/button-icon.directive';

@Component({
  selector: 'date-picker',
  imports: [ButtonIconDirective, NgbInputDatepicker, FormsModule],
  templateUrl: './date-picker.html',
  styles: `
    :host {
      position: relative;
    }
  `,
})
export class DatePicker {
  readonly selectedDate = model<NgbDateStruct>();

  protected onDateSelected(_: NgbDate) {}
}
