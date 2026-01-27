import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';

export class DayJsHelper {
  static getStartOfToday(utc = true) {
    if (utc) {
      return dayjs().utc().startOf('day');
    }

    return dayjs().startOf('day');
  }

  static fromNgbDateStruct(date: NgbDateStruct, utc = true) {
    return DayJsHelper.getStartOfToday(utc)
      .set('year', date.year ?? 0)
      .set('month', (date.month ?? 1) - 1)
      .set('date', date.day ?? 1);
  }
}
