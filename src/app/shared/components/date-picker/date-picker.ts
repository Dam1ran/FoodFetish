import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbInputDatepicker, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ButtonIconDirective } from '../../directives/button-icon.directive';

@Component({
  selector: 'date-picker',
  imports: [ButtonIconDirective, NgbInputDatepicker, FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
})
export class DatePicker {
  readonly selectedDate = model<NgbDateStruct>();

  // protected onChange = (_: NgbDateStruct) => {};
  // protected onTouched = () => {};
  // protected isDisabled = signal(false);

  // writeValue(date: NgbDateStruct) {
  //   this.selectedDate.set(date);
  // }

  // registerOnChange(fn: any) {
  //   this.onChange = fn;
  // }

  // registerOnTouched(fn: any) {
  //   this.onTouched = fn;
  // }

  // setDisabledState?(isDisabled: boolean) {
  //   this.isDisabled.set(isDisabled);
  // }

  protected onDateSelected(_: NgbDate) {}
}
