import { Component, computed, inject, model, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePicker } from '../../../../shared/components/date-picker/date-picker';
import { DayJsHelper } from '../../../../shared/helpers/dayjs-helper';
import { DiaryLogService } from '../../../../shared/services/diary-log.service';

@Component({
  selector: 'weekdays',
  imports: [DatePicker],
  templateUrl: './weekdays.html',
  styleUrl: './weekdays.scss',
})
export class Weekdays implements OnInit {
  readonly weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  private readonly calendar = inject(NgbCalendar);
  readonly selectedDate = model<NgbDateStruct>();
  readonly selectedDayJs = computed(() => DayJsHelper.fromNgbDateStruct(this.selectedDate()));

  ngOnInit() {
    this.selectedDate.set(this.calendar.getToday());
  }

  protected isDaySelected(weekday: string) {
    const today = DayJsHelper.getStartOfToday();

    return (
      weekday ===
        this.weekdays[this.selectedDayJs().day() === 0 ? 6 : this.selectedDayJs().day() - 1] &&
      today.isoWeek() === this.selectedDayJs().isoWeek()
    );
  }

  protected isTodayLbl(weekday: string) {
    const date = DayJsHelper.getStartOfToday();
    return weekday === this.weekdays[date.day() === 0 ? 6 : date.day() - 1];
  }

  protected selectWeekDay(weekday: string) {
    const dayIndex = this.weekdays.indexOf(weekday);
    const today = DayJsHelper.getStartOfToday();

    if (today.isoWeek() !== this.selectedDayJs().isoWeek()) {
      return;
    }

    const date = this.selectedDayJs().isoWeekday(dayIndex + 1);
    this.selectedDate.set({ day: date.date(), month: date.month() + 1, year: date.year() });
  }

  protected readonly diaryLogService = inject(DiaryLogService);

  hasFood(weekday: string) {
    return this.diaryLogService.hasFoodOnDate(
      this.selectedDayJs()
        .isoWeekday(this.weekdays.indexOf(weekday) + 1)
        .toISOString(),
    );
  }
}
